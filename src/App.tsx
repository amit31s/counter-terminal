import { Auth } from "@aws-amplify/auth";
import { clearData, customTheme, persistor, store } from "@ct/common";
import { STORAGE_KEYS } from "@ct/common/enums";
import { envProvider } from "@ct/common/platformHelper";
import { getGitBuildInfo } from "@ct/features/GitInfoFeature/GitInfo";
import { NativeBaseProvider } from "native-base";
import { RefContext, useGlobalRefInputContext } from "postoffice-global-ref-input";
import { AppRegistry, StyleSheet, View } from "react-native";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useAWSConfig } from "./common/hooks/useAWSConfig";
import { useRefreshTokens } from "./common/hooks/useRefreshTokens";
import { useS3Presigner } from "./common/hooks/useS3Presigner";
import { LoadingModal } from "./components";
import { setupPolyfill } from "./configs/polyfill";
import { inset } from "./constants";
import { Navigation } from "./navigation";

setupPolyfill();

if (typeof navigator.virtualKeyboard?.overlaysContent === "boolean") {
  navigator.virtualKeyboard.overlaysContent = true;
}

const queryClient = new QueryClient();

const Root = () => {
  const { authConfig } = useAWSConfig();
  Auth.configure(authConfig);

  useS3Presigner();

  useRefreshTokens();

  return (
    <>
      <Navigation />
      <LoadingModal />
    </>
  );
};

const wrapperStyles = StyleSheet.create({
  wrapper: {
    width: "100vw",
    height: "100vh",
  },
});

const App = () => {
  const keypadRefValues = useGlobalRefInputContext();

  return (
    <View style={wrapperStyles.wrapper}>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NativeBaseProvider theme={customTheme} initialWindowMetrics={inset}>
            <QueryClientProvider client={queryClient}>
              <RefContext.Provider value={keypadRefValues}>
                <Root />
              </RefContext.Provider>
            </QueryClientProvider>
          </NativeBaseProvider>
        </PersistGate>
      </ReduxProvider>
    </View>
  );
};

const { hash } = getGitBuildInfo();
const storedHash = localStorage.getItem(STORAGE_KEYS.CTSTK0007);
if (envProvider.REACT_APP_CLEAR_CACHE_ON_UPDATE === "true" && hash !== storedHash) {
  clearData().then(() => {
    localStorage.setItem(STORAGE_KEYS.CTSTK0007, hash);
    window.location.reload();
  });
} else {
  localStorage.setItem(STORAGE_KEYS.CTSTK0007, hash);
  AppRegistry.registerComponent("counterterminal", () => App);
  AppRegistry.runApplication("counterterminal", {
    rootTag: document.getElementById("root"),
  });
}

export default App;
