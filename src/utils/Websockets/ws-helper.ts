import { WEBSOCKET_URL } from "@ct/constants/WsConstants";
import WebSocketAsPromised from "websocket-as-promised";

export const wsp = new WebSocketAsPromised(WEBSOCKET_URL, {
  packMessage: (data) => JSON.stringify(data),
  unpackMessage: (data) => (typeof data === "string" ? JSON.parse(data) : data),
  attachRequestId: (data, requestId) => Object.assign({ id: requestId }, data),
  extractRequestId: (data) => data && data.id,
});
