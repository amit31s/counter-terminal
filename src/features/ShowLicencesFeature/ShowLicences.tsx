import { StyledDefaultSearchOutlinedIcon } from "@ct/assets/icons";
import { StyledInput } from "@ct/components";
import { stringConstants } from "@ct/constants";
import { Box, FlatList, Text } from "native-base";
import { useState } from "react";

/**
 * licences.json is normally generated automatically by running `yarn install` but the TypeScript
 * code needs to be able to handle the case when it doesn't exist
 */
function getLicenceInfo(): Record<string, License> {
  let licensesObj: Record<string, License> = {};
  try {
    licensesObj = require("./licenses.json");
  } catch (ignored) {}
  return licensesObj;
}

interface License {
  licenses: string;
  repository?: string;
  publisher?: string;
  email?: string;
  url?: string;
  description?: string;
  copyright?: string;
  licenseFile?: string;
  licenseText?: string;
  licenseModified?: string;
  path?: string;
  name?: string;
  version?: string;
}

const keys: (keyof License)[] = [
  "name",
  "version",
  "description",
  "licenses",
  "publisher",
  "copyright",
  "repository",
];

export const ShowLicences = () => {
  const [searchString, setSearchString] = useState("");

  const licenses = Object.values(getLicenceInfo());
  const licensesStrings = licenses
    .map((license) => keys.map((key) => (license[key] ? `${license[key]}\n` : "")).join(""))
    .filter((licenseString) => licenseString.includes(searchString));

  return (
    <Box my="1%" flex={1}>
      <Box
        ml="45px"
        mr="45px"
        borderWidth={0}
        shadow={"0"}
        flex={1}
        p="12px"
        testID={stringConstants.ShowLicencesModal.showLicencesBodyTestID}
      >
        <Box testID={stringConstants.ShowLicencesModal.showLicencesWebViewTestID} />

        <StyledInput
          inputContainerProps={{ w: "100%", mb: "12px" }}
          icon={<StyledDefaultSearchOutlinedIcon />}
          inputProps={{
            placeholder: "Search for a package",
            value: searchString,
            onChangeText: setSearchString,
          }}
        />

        <FlatList
          h={1}
          data={licensesStrings}
          renderItem={({ item }) => (
            <Box borderBottomWidth="1" borderColor="coolGray.400" pl="4" pr="5" py="2">
              <Text fontSize="20px" fontWeight={"light"}>
                {item}
              </Text>
            </Box>
          )}
        />
      </Box>
    </Box>
  );
};
