import { ErrorBoundary } from "@ct/common";
import { STORAGE_KEYS } from "@ct/common/enums";
import { envProvider } from "@ct/common/platformHelper";
import { SCREENS } from "@ct/constants";
import { AuthRoutes, DeeplinkRoutes } from "@ct/features";
import {
  AuthRedirect,
  CashDrawerScreen,
  CashTransferScreen,
  EnvironmentVariableConfigScreen,
  FeatureFlagConfigScreen,
  HomeScreen,
  LicenceInfoScreen,
  LoginScreen,
  NotAllowedOnThisBranch,
  PMSModule,
  PouchAcceptanceScreen,
  PouchDispatch,
  ReceiptScreen,
  SignOutRedirect,
  SystemInfoScreen,
  UserLogin,
} from "@ct/screens";
import { getItem } from "@ct/utils";

import { BrowserRouter, HashRouter, Navigate, Route, Routes } from "react-router-dom";

const Router = envProvider.REACT_APP_USING_ELECTRON === "true" ? HashRouter : BrowserRouter;

const CASH_DRAWER_ID = getItem(STORAGE_KEYS.CTSTK0006);

export const Navigation = () => (
  <Router>
    <ErrorBoundary>
      <Routes>
        <Route element={<DeeplinkRoutes />}>
          <Route path={SCREENS.AUTH_REDIRECT} element={<AuthRedirect />} />
          <Route path={SCREENS.SIGNOUT_REDIRECT} element={<SignOutRedirect />} />
          <Route path={SCREENS.USER_LOGIN} element={<UserLogin />} />
          <Route element={<AuthRoutes />}>
            <Route path={SCREENS.HOME} element={<HomeScreen />} />
            <Route path={SCREENS.CASH_TRANSFER} element={<CashTransferScreen />} />
            <Route path={SCREENS.CASH_DRAWER} element={<CashDrawerScreen />} />
            <Route path={SCREENS.RECEIPT} element={<ReceiptScreen />} />
            <Route path={SCREENS.POUCH_ACCEPTANCE} element={<PouchAcceptanceScreen />} />
            <Route path={SCREENS.POUCH_DESPATCH} element={<PouchDispatch />} />
            <Route path={SCREENS.PMS_MODULE} element={<PMSModule />} />
            <Route path={SCREENS.SYSTEM_INFO} element={<SystemInfoScreen />} />
            <Route path={SCREENS.LICENCE_INFO} element={<LicenceInfoScreen />} />
            <Route
              path={SCREENS.ENVIRONMENT_VARIABLE_CONFIG}
              element={<EnvironmentVariableConfigScreen />}
            />
            <Route path={SCREENS.FEATURE_FLAG_CONFIG} element={<FeatureFlagConfigScreen />} />
          </Route>
          <Route path={SCREENS.LOGIN} element={<LoginScreen />} />
          <Route path={SCREENS.NOT_ALLOWED_ON_THIS_BRANCH} element={<NotAllowedOnThisBranch />} />

          <Route
            path="*"
            element={<Navigate to={!CASH_DRAWER_ID ? SCREENS.CASH_DRAWER : SCREENS.HOME} replace />}
          />
        </Route>
      </Routes>
    </ErrorBoundary>
  </Router>
);
