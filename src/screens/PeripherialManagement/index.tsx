import { iconMaker } from "@ct/assets/icons";
import {
  POL_DEVICE_SERVER_HOST,
  POL_DEVICE_SERVER_SIMULATED,
  Screen,
  useAppSelector,
} from "@ct/common";
import { getTerminalId } from "@ct/common/helpers/getTerminalId";
import { CustomModal, StyledButton } from "@ct/components";
import { STRING_CONSTANTS } from "@ct/constants";
import { getUserName } from "@ct/utils/Services/auth";
import styled from "@emotion/styled";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment";
import { Text } from "native-base";
import {
  AdminGetVersionResponse,
  IngenicoPedClient,
  LabelAvailablePrinters,
  LabelPrinterClient,
  ReceiptPrinterClient,
  ReceiptPrinterModes,
  ServiceEvent,
  SupportedServices,
  adminClient,
  setup,
} from "postoffice-peripheral-management-service";
import { useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import tw from "tailwind-react-native-classnames";
import { Section } from "./Section";
import { testIds, testLabel, testReceipt } from "./testData";

const SectionContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  margin: "24px",
  gap: "24px",
});

const ButtonContainer = styled.div({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  flexWrap: "wrap",
  gap: "32px",
});

const InfoIcon = iconMaker(InfoOutlinedIcon, 80);

export const PMSModule = () => {
  const { device } = useAppSelector((rootState) => rootState.auth);
  const { PMS } = STRING_CONSTANTS.screenNames;
  const [response, setResponse] = useState("");
  const [uiDisplay, setUiDisplay] = useState("");
  const [pmsVersionInfo, setPmsVersionInfo] = useState<AdminGetVersionResponse>();
  const [showModal, setShowModal] = useState(false);

  const devices = useMemo(
    () =>
      setup({
        deviceServerHost: POL_DEVICE_SERVER_HOST,
        callbacks: {
          onDisplayUpdate: (event: ServiceEvent) => {
            setUiDisplay(event.message);
          },
          onConnectionError: () => {
            setUiDisplay("Unable to connect to device service");
          },
        },
      }),
    [],
  );

  const pinPad = useMemo(() => {
    const terminalId = getTerminalId(device.branchID, device.nodeID);

    return devices.buildClient(SupportedServices.IngenicoPed, {
      terminalId,
      clerkId: getUserName(),
      useMock: POL_DEVICE_SERVER_SIMULATED,
    }) as IngenicoPedClient;
  }, [device.branchID, device.nodeID, devices]);

  const labelPrinter = useMemo(
    () =>
      devices.buildClient(SupportedServices.LabelPrinter, {
        useMock: POL_DEVICE_SERVER_SIMULATED,
      }) as LabelPrinterClient,
    [devices],
  );

  const receiptPrinter = useMemo(
    () =>
      devices.buildClient(SupportedServices.ReceiptPrinter, {
        useMock: POL_DEVICE_SERVER_SIMULATED,
      }) as ReceiptPrinterClient,
    [devices],
  );

  useEffect(() => {
    const pmsAdminClient = devices.buildClient(SupportedServices.Admin, {
      useMock: POL_DEVICE_SERVER_SIMULATED,
    }) as adminClient;

    (async () => {
      try {
        const versionInfo = await pmsAdminClient.getVersion();
        setPmsVersionInfo(versionInfo);
      } catch (error) {
        setUiDisplay("Unable to obtain PMS Version");
      }
    })();
  }, [devices]);

  const callPMS = useCallback(
    async (supportedDevice: SupportedServices, props?: Record<string, unknown>) => {
      switch (supportedDevice) {
        case SupportedServices.LabelPrinter: {
          await labelPrinter.print({
            printer: props?.printer as LabelAvailablePrinters,
            label: testLabel,
          });
          setShowModal(true);
          setResponse("Printed");
          break;
        }
        case SupportedServices.ReceiptPrinter: {
          await receiptPrinter.print(testReceipt, ReceiptPrinterModes.Html);
          setShowModal(true);
          setResponse("Printed");
          break;
        }
        case SupportedServices.IngenicoPed: {
          await pinPad.initialise();
          setShowModal(true);
          setResponse("Initialised");
          break;
        }
        case SupportedServices.MagneticStripeCardReader: {
          setUiDisplay("Mag Card test functionality is not available.");
          break;
        }
        case SupportedServices.Scanner: {
          setUiDisplay("Scanner test functionality is not available.");
          break;
        }
        default: {
          setUiDisplay("Cannot find device type");
          break;
        }
      }
    },
    [labelPrinter, pinPad, receiptPrinter],
  );

  return (
    <Screen title={PMS}>
      <CustomModal
        testID={testIds.modal}
        titleProps={{ testID: testIds.responseText }}
        title={response}
        isOpen={showModal}
        icon={<InfoIcon />}
        primaryButtonProps={{
          testID: testIds.closeButton,
          label: "Close",
          onPress: () => {
            setUiDisplay("");
            setShowModal(false);
          },
        }}
      />
      <div>
        {uiDisplay !== "" && (
          <View style={tw`p-2 bg-gray-200 border-b border-gray-300 w-full absolute`}>
            <Text style={tw`text-lg text-center text-black uppercase`}>{uiDisplay}</Text>
          </View>
        )}
        <SectionContainer>
          <Section title="Ingenico" testID={testIds.ingenicoWrapper}>
            <View style={tw`w-full`}>
              <StyledButton
                testID={testIds.initialiseButton}
                onPress={async () => callPMS(SupportedServices.IngenicoPed)}
                label="Initialise Pin Pad"
                size="slim"
                type="tertiary"
              />
            </View>
          </Section>
          <Section title="Label Printers" testID={testIds.labelPrinterWrapper}>
            <ButtonContainer>
              <StyledButton
                testID={testIds.testPrintButton}
                onPress={async () =>
                  callPMS(SupportedServices.LabelPrinter, {
                    printer: LabelAvailablePrinters.RoyalMail,
                  })
                }
                label="Print RM Label"
                size="slim"
                type="tertiary"
              />
              <StyledButton
                testID={testIds.testPrintButton2}
                onPress={async () =>
                  callPMS(SupportedServices.LabelPrinter, {
                    printer: LabelAvailablePrinters.MonarchsHead,
                  })
                }
                label="Print MH Label"
                size="slim"
                type="tertiary"
              />
              <StyledButton
                testID={`${testIds.labelPrinterWrapper}-calibrate`}
                onPress={async () => {
                  await labelPrinter.calibrate();
                  setShowModal(true);
                  setResponse("Calibrated");
                }}
                label="Calibrate Printers"
                size="slim"
                type="secondary"
              />
              <StyledButton
                testID={`${testIds.labelPrinterWrapper}-config`}
                onPress={async () => {
                  await labelPrinter.printConfigurationLabels();
                  setShowModal(true);
                  setResponse("Printed Configuration Labels");
                }}
                label="Print Configuration Labels"
                size="slim"
                type="secondary"
              />
            </ButtonContainer>
          </Section>
          <Section title="Receipt Printer" testID={testIds.receiptPrinterWrapper}>
            <View style={tw`w-full`}>
              <StyledButton
                testID={testIds.receiptPrintButton}
                onPress={async () => callPMS(SupportedServices.ReceiptPrinter)}
                label="Test Receipt Print"
                size="slim"
                type="tertiary"
              />
            </View>
          </Section>
          <Section title="PMS Version" testID={testIds.pmsVersionWrapper}>
            <View style={tw`w-full text-center text-black`}>
              <Text variant="body">
                <strong>Release</strong>: <code>{pmsVersionInfo?.release}</code>
              </Text>
              <Text variant="body" mt="4px">
                <strong>Built</strong>: <code>{pmsVersionInfo?.hash}</code>
              </Text>
              <Text variant="body" mt="4px">
                <Text bold>Built</Text>:{" "}
                <code>
                  {pmsVersionInfo?.built
                    ? moment.unix(Number(pmsVersionInfo?.built)).format("DD/MM/YYYY h:mm a")
                    : ""}
                </code>
              </Text>
            </View>
          </Section>
        </SectionContainer>
      </div>
    </Screen>
  );
};
