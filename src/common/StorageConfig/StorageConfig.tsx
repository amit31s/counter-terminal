import { StyledButton } from "@ct/components";
import { COLOR_CONSTANTS, stringConstants } from "@ct/constants";
import CodeMirror from "@uiw/react-codemirror";
import exportFromJson from "export-from-json";
import { Box, Text } from "native-base";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useFilePicker } from "use-file-picker";
import { stringifyValues } from "./storageConfigHelper";
import { styles } from "./styles";

const buttonStyles = StyleSheet.create({
  base: {
    alignSelf: "flex-start",
  },
  marginBottom: {
    marginBottom: 16,
  },
  marginRight: {
    marginRight: 16,
  },
  marginVertical: {
    marginVertical: 16,
  },
});

const mb = [buttonStyles.base, buttonStyles.marginBottom];
const mrb = [buttonStyles.base, buttonStyles.marginRight, buttonStyles.marginBottom];
const my = [buttonStyles.base, buttonStyles.marginVertical];
const mry = [buttonStyles.base, buttonStyles.marginRight, buttonStyles.marginVertical];

interface StorageConfigProps {
  storageKey: string;
  activeConfig: Record<string, unknown>;
  getOriginalConfig: () => Record<string, unknown>;
  description: string;
  shouldStringifyValues: boolean;
}

export const exportHandler = (config: string) => {
  const data = JSON.parse(config);
  const fileName = "ct_config";
  const exportType = exportFromJson.types.json;
  exportFromJson({ data, fileName, exportType });
};

export const submitHandler = (config: string, key: string, shouldStringify: boolean) => {
  const parsed = JSON.parse(config);
  const values = shouldStringify ? stringifyValues(parsed) : parsed;
  const stringified = JSON.stringify(values);
  localStorage.setItem(key, stringified);
  window.location.reload();
};

export const StorageConfig = ({
  activeConfig,
  storageKey,
  getOriginalConfig,
  description,
  shouldStringifyValues,
}: StorageConfigProps) => {
  const [config, setConfig] = useState(JSON.stringify(activeConfig, null, 2));
  const [error, setError] = useState("");
  const [openFileSelector, { filesContent }] = useFilePicker({
    accept: ".json",
    multiple: false,
  });

  useEffect(() => {
    if (!filesContent.length) {
      return;
    }
    setError("");
    try {
      setConfig(JSON.stringify(JSON.parse(filesContent[0].content), null, 2));
    } catch (_e) {
      setError(`${stringConstants.StorageConfig.notImported} ${(_e as Error).message}`);
    }
  }, [filesContent]);

  const handleImport = () => {
    openFileSelector();
  };

  const handleExport = () => {
    setError("");
    try {
      exportHandler(config);
    } catch (_e) {
      setError((_e as Error).message);
    }
  };

  const handleSubmit = (updatedConfig: string) => {
    setError("");
    try {
      submitHandler(updatedConfig, storageKey, shouldStringifyValues);
    } catch (_e) {
      setError((_e as Error).message);
    }
  };

  const handleResetPrevious = () => {
    setConfig(JSON.stringify(activeConfig, null, 2));
  };

  const handleResetDefault = () => {
    const updatedConfig = JSON.stringify(getOriginalConfig(), null, 2);
    setConfig(updatedConfig);
    handleSubmit(updatedConfig);
  };

  return (
    <Box my="1%" flex={1}>
      <Box ml="45px" mr="45px" px="12px" borderWidth={0} shadow={"0"} flex={1}>
        <Box display="flex" flexDirection="row" mt="16px">
          <StyledButton
            type="secondary"
            size="slim"
            styles={mrb}
            onPress={handleImport}
            label={stringConstants.StorageConfig.importConfig}
            testID={stringConstants.StorageConfig.importConfig}
          />

          <StyledButton
            type="secondary"
            size="slim"
            styles={mb}
            onPress={handleExport}
            label={stringConstants.StorageConfig.exportConfig}
            testID={stringConstants.StorageConfig.exportConfig}
          />
        </Box>

        <Text pb="14px" fontSize={14}>
          {description}
        </Text>

        <CodeMirror style={styles.codeMirror} height="100%" value={config} onChange={setConfig} />

        <Text variant="small-bold" color={COLOR_CONSTANTS.errorButtonColor}>
          {error}
        </Text>

        <Box display="flex" flexDirection="row">
          <StyledButton
            type="tertiary"
            size="slim"
            styles={mry}
            onPress={() => handleSubmit(config)}
            label={stringConstants.StorageConfig.updateConfig}
            testID={stringConstants.StorageConfig.updateConfig}
          />

          <StyledButton
            type="tertiary"
            size="slim"
            styles={mry}
            onPress={handleResetPrevious}
            label={stringConstants.StorageConfig.undoUnsavedChanges}
            testID={stringConstants.StorageConfig.undoUnsavedChanges}
          />

          <StyledButton
            type="tertiary"
            size="slim"
            styles={my}
            onPress={handleResetDefault}
            label={stringConstants.StorageConfig.resetToDefaults}
            testID={stringConstants.StorageConfig.resetToDefaults}
          />
        </Box>
      </Box>
    </Box>
  );
};
