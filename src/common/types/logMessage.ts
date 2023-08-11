export interface LogMessage {
  (...message: object[]): void;
}

export interface ICommonLogMessage {
  (...message: ICommonLogs[]): void;
}

export interface IErrorLogMessage {
  (...message: IErrorLogs[]): void;
}

export interface IWarningLogMessage {
  (...message: IWarningLogs[]): void;
}
export interface ICommonLogs {
  methodName: string;
  message?: string;
  logData?: object;
  timestamp?: Date;
}

export interface IErrorLogs extends ICommonLogs {
  error: string | Error;
}
export interface IWarningLogs extends ICommonLogs {
  warn: string;
}
