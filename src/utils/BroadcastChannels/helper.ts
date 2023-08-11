// Show Generate Pin component in simulator right next to CT Login page
export const loginPageBroadcast = () => {
  const loginPageBC: BroadcastChannel = new BroadcastChannel("LoginPage");
  loginPageBC.postMessage({ generatePin: true });
  loginPageBC.close();
};

// Hide Generate pin component on Home page of CT in Simulator
export const homePageBroadcast = () => {
  const homePageBC: BroadcastChannel = new BroadcastChannel("HomePage");
  homePageBC.postMessage({ generatePin: false });
  homePageBC.close();
};

export const printReceiptBroadCast = (base64Data: string) => {
  const peripheralSelectorBroadcast: BroadcastChannel = new BroadcastChannel("Peripherals");
  peripheralSelectorBroadcast.postMessage("RECIEPT");
  peripheralSelectorBroadcast.close();
  const broadcastChannel: BroadcastChannel = new BroadcastChannel("receipt");
  setTimeout(function () {
    broadcastChannel.postMessage(base64Data);
    broadcastChannel.close();
  }, 500);
};
