declare module "react-native-bluetooth-status" {
  type listenerFunction = (bluetoothOnline: boolean) => void;
  class BluetoothManager {
    subscription: any;
    inited?: boolean;
    bluetoothState?:
      | "unknown"
      | "resetting"
      | "unsupported"
      | "unauthorized"
      | "off"
      | "on"
      | "unknown";
    listener?: listenerFunction;
    constructor();
    addListener(listener: listenerFunction): void;
    removeListener(): void;
    state(): Promise<boolean>;
    manualInit(): void;
    enable(enabled?: boolean): void;
    disable(): Promise<void>;
  }
  export const BluetoothStatus: BluetoothManager;
  export const useBluetoothStatus: () => [
    boolean | undefined,
    boolean,
    (enable?: boolean | undefined) => void,
  ];
  export {};
}
