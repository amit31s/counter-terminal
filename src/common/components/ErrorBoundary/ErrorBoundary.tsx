import { StyledButton } from "@ct/components";
import { SCREENS, STRING_CONSTANTS } from "@ct/constants";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import React, { ErrorInfo, ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Link } from "react-router-dom";

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface Props {
  children: ReactNode;
}

const { ErrorBoundaryMessage } = STRING_CONSTANTS;

const logger = logManager(LOGGER_TYPE.applicationLogger);

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    ErrorBoundary.logErrorToService(error, errorInfo);
  }

  handleRestart = () => {
    window.electronAPI?.restartApp();
  };

  static logErrorToService(error: Error, errorInfo: ErrorInfo) {
    logger.error({ methodName: "errorBoundary", error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.header}>[ErrorBoundary]:</Text>
          {this.state.error?.message ? (
            <Text>{this.state.error.message}</Text>
          ) : (
            <Text>{ErrorBoundaryMessage.genericErrorMessage}</Text>
          )}

          {this.state.errorInfo?.componentStack ? (
            <>
              <Text>The stack trace is:</Text>
              <Text>{this.state.errorInfo?.componentStack}</Text>
            </>
          ) : (
            <Text>{ErrorBoundaryMessage.genericErrorInfo}</Text>
          )}
          <>
            <StyledButton onPress={this.handleRestart} label="Restart App" />
            <Link to={SCREENS.HOME}>
              <Text>Go to Home Page</Text>
            </Link>
          </>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    display: `flex`,
    padding: 20,
  },
  header: {
    fontWeight: "bold",
    fontSize: 24,
    padding: 10,
  },
});
