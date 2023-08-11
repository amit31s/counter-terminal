import { StyledOtherPrintOutlinedIcon } from "@ct/assets/icons";
import { StyledButton, StyledInput } from "@ct/components";
import { Box } from "native-base";
import { LabelPrinterClient } from "postoffice-peripheral-management-service";
import { ReactElement, SetStateAction, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import tw from "tailwind-react-native-classnames";

const buttonStyles = StyleSheet.create({
  save: {
    width: "20%",
    marginLeft: 20,
    marginTop: 50,
    marginRight: "auto",
  },
  calibrate: {
    width: "auto",
    marginRight: 10,
  },
  print: {
    width: "auto",
    marginRight: "auto",
  },
});

export type PrinterSectionProps = {
  title: string;
  testIdPrefix: string;
  serialNumber?: string;
  printerClient: LabelPrinterClient;
  onSubmit: (serialNumber: string) => void;
};

const PrinterSection = ({
  title,
  serialNumber,
  onSubmit,
  testIdPrefix,
}: PrinterSectionProps): ReactElement => {
  const [serialNo, setSerialNo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (serialNumber) {
      setSerialNo(serialNumber);
    }
    if (!isSaved) {
      return;
    }
    const savedTimer = window.setTimeout(function () {
      setIsSaved(false);
    }, 1000);
    return () => clearTimeout(savedTimer);
  }, [serialNumber, isSaved]);

  return (
    <View style={tw`p-6 mb-6 bg-gray-100 border border-gray-200 rounded-md`}>
      {title && (
        <View style={tw`relative -mt-6 -ml-6`}>
          <Text
            style={tw`relative px-4 py-2 mb-2 mr-4 text-2xl font-bold text-black bg-white border-b border-r border-gray-200 rounded-tl-lg rounded-br-lg w-52`}
          >
            {title}
          </Text>
        </View>
      )}
      <View style={tw`w-full mt-4`}>
        <Box alignSelf="stretch" flexDir="row">
          <StyledInput
            flex={1}
            inputContainerProps={{ w: "100%" }}
            icon={<StyledOtherPrintOutlinedIcon />}
            testID={`${testIdPrefix}-input-container`}
            label="Serial Number"
            labelProps={{
              fontSize: "22px",
            }}
            inputProps={{
              value: serialNo,
              fontFamily: "monospace",
              blurOnSubmit: true,
              testID: `${testIdPrefix}-input`,
              onChangeText: (value: SetStateAction<string>) => {
                setSerialNo(value);
              },
              onSubmitEditing: async () => {
                setSubmitting(true);
                onSubmit(serialNo);
                setSubmitting(false);
              },
            }}
          />
          <StyledButton
            label={"Save"}
            type="tertiary"
            size="slim"
            isDisabled={submitting || serialNo.length === 0}
            testID={`${testIdPrefix}-serial-number-save-button`}
            onPress={() => {
              setSubmitting(true);
              onSubmit(serialNo);
              setSubmitting(false);
              setIsSaved(true);
            }}
            styles={buttonStyles.save}
          />
        </Box>
        {isSaved && (
          <View style={tw`absolute right-0 px-3 bg-green-500 top-1 rounded-xl`}>
            <Text style={tw`text-base font-bold text-white`}>✓ Saved</Text>
          </View>
        )}
        <View style={tw`w-full p-6 mt-6 bg-white border border-gray-300 rounded-lg`}>
          <Text style={tw`text-xl font-bold`}>Tools</Text>
          <Box alignSelf="stretch" flexDir="row" style={tw`mt-4`}>
            <StyledButton
              label={"Calibrate"}
              type="tertiary"
              size="slim"
              testID={`${testIdPrefix}-calibrate-button`}
              onPress={() => {
                console.log("Calibrate");
              }}
              styles={buttonStyles.calibrate}
            />
            <StyledButton
              label={"Print Configuration Label"}
              type="tertiary"
              size="slim"
              testID={`${testIdPrefix}-print-configuration-label-button`}
              onPress={() => {
                console.log("Print Config");
              }}
              styles={buttonStyles.print}
            />
          </Box>
        </View>
      </View>
    </View>
  );
};

export default PrinterSection;
