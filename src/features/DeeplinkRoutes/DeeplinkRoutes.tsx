import { useAppDispatch, useAppSelector, useCheckInternet } from "@ct/common";
import { envProvider } from "@ct/common/platformHelper";
import { signOutUser } from "@ct/common/state/auth.slice";
import queryString from "query-string";
import { ReactNode, useEffect, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { InternetFailureModal } from "../CommitFailModalFeature";
import { setTouchKeyboardEnabled } from "@ct/common/state/touchKeyboard.slice";

export const DeeplinkRoutes = ({ children }: { children?: ReactNode }) => {
  useCheckInternet();
  const navigate = useNavigate();
  const deeplinkBroadcast = useMemo(() => new BroadcastChannel("deeplink_channel"), []);
  const signOutBroadcast = useMemo(() => new BroadcastChannel("Signout"), []);
  const dispatch = useAppDispatch();
  const { userTokenData } = useAppSelector((state) => state.auth);

  window.electronAPI?.deeplink(async (_event, screen, params) => {
    navigate(screen, { state: params });
  });

  useEffect(() => {
    const postMsgTimer = setTimeout(() => {
      deeplinkBroadcast.postMessage({ ready: true });
    }, 1);
    return () => clearTimeout(postMsgTimer);
  }, [deeplinkBroadcast]);

  useEffect(() => {
    if (!userTokenData) {
      return;
    }

    const userId = localStorage.getItem(
      `CognitoIdentityServiceProvider.${envProvider.REACT_APP_FORGEROCK_COGNITO_WEB_CLIENT_ID}.LastAuthUser`,
    );

    if (!userId) {
      return;
    }

    deeplinkBroadcast.postMessage({ userId });
  }, [deeplinkBroadcast, userTokenData]);

  useEffect(() => {
    deeplinkBroadcast.onmessage = (event: MessageEvent<{ route: string }>) => {
      if (!event.data.route) {
        return;
      }

      const urlSplit = event.data.route.split(`?`);
      const params = urlSplit.length < 2 ? {} : queryString.parse(`?${urlSplit[1]}`);

      navigate(urlSplit[0], { state: params });
    };
  }, [deeplinkBroadcast, navigate]);

  useEffect(() => {
    signOutBroadcast.onmessage = async (event: MessageEvent<{ signOut: boolean }>) => {
      if (envProvider.REACT_APP_USING_ELECTRON !== "true" && event.data.signOut === true) {
        dispatch(setTouchKeyboardEnabled(false));
        await dispatch(signOutUser());
        signOutBroadcast.postMessage({ done: true });
        signOutBroadcast.close();
      }
    };
  }, [dispatch, signOutBroadcast]);

  return (
    <>
      <InternetFailureModal />
      {children ? children : <Outlet />}
    </>
  );
};
