import { reducer, RootState } from "@ct/common/state";
import { inset } from "@ct/constants";
import { crashReporter } from "@pol/frontend-logger-web";
import { configureStore } from "@reduxjs/toolkit";
import { render, renderHook, RenderHookOptions, RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NativeBaseProvider } from "native-base";
import { JSXElementConstructor, PropsWithChildren, ReactElement, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import { listenerMiddleware } from "../state/middleware";

const queryClient = new QueryClient();

const AllTheProviders = ({ children }: PropsWithChildren<Record<string, unknown>>) => {
  return (
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <NativeBaseProvider initialWindowMetrics={inset}>{children}</NativeBaseProvider>
      </QueryClientProvider>
    </HashRouter>
  );
};

export function setupUser(usingFakeTimers = false) {
  if (!usingFakeTimers) {
    return userEvent.setup();
  }

  return userEvent.setup({
    advanceTimers: jest.advanceTimersByTime,
  });
}

const customRender = (
  ui: ReactElement<unknown, string | JSXElementConstructor<unknown>>,
  options?: RenderOptions,
) => {
  window.electronAPI = {
    launchBo: jest.fn(),
    launchCt: jest.fn(),
    deeplink: jest.fn(),
    getSerialNumber: jest.fn(),
    saveLoginDetails: jest.fn(),
    logger: jest.fn(),
    onResume: jest.fn(),
    clearData: jest.fn(),
    requestPresignedUrls: jest.fn(),
    sendPresignedUrls: jest.fn(),
    restartApp: jest.fn(),
  };
  return render(ui, { wrapper: AllTheProviders, ...options });
};

type ReduxOptions = RenderOptions & {
  preloadedState: RootState;
};

export const renderWithRedux = (
  ui: ReactElement<unknown, string | JSXElementConstructor<unknown>>,
  preloadedState?: Partial<RootState>,
  renderOptions?: ReduxOptions,
) => {
  return renderWithReduxAndStore(ui, preloadedState, renderOptions).rendered;
};

export const renderWithReduxAndStore = (
  ui: ReactElement<unknown, string | JSXElementConstructor<unknown>>,
  preloadedState?: Partial<RootState>,
  renderOptions?: ReduxOptions,
) => {
  const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).prepend(crashReporter, listenerMiddleware.middleware),
    preloadedState: {
      ...preloadedState,
    },
  });

  const Wrapper = ({ children }: { children: ReactNode }) => {
    return (
      <AllTheProviders>
        <Provider store={store}>{children}</Provider>
      </AllTheProviders>
    );
  };

  return { rendered: render(ui, { wrapper: Wrapper, ...renderOptions }), store };
};

export function renderHookWithRedux<TProps, TResult>(
  hook: (props: TProps) => TResult,
  preloadedState?: Partial<RootState>,
  options?: RenderHookOptions<TProps>,
) {
  return renderHookWithReduxAndStore(hook, preloadedState, options).rendered;
}

export function renderHookWithReduxAndStore<TProps, TResult>(
  hook: (props: TProps) => TResult,
  preloadedState?: Partial<RootState>,
  options?: RenderHookOptions<TProps>,
) {
  const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).prepend(crashReporter, listenerMiddleware.middleware),
    preloadedState: {
      ...preloadedState,
    },
  });

  const Wrapper = ({ children }: { children?: ReactNode }) => (
    <AllTheProviders>
      <Provider store={store}>{children}</Provider>
    </AllTheProviders>
  );

  return { rendered: renderHook<TResult, TProps>(hook, { wrapper: Wrapper, ...options }), store };
}

export { act, fireEvent, waitFor } from "@testing-library/react";
export { customRender as render, renderHook };
