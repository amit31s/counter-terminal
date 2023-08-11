import { stringConstants } from "../../constants";

export const alertModalButton = (success: () => void, cancel: () => void) => {
  return {
    success: {
      name: stringConstants.Button.Ok,
      enable: true,
      click: success,
    },
    cancel: {
      name: "",
      enable: false,
      click: cancel,
    },
  };
};

export const logOffModalButton = (success: () => void, cancel: () => void) => {
  return {
    success: {
      name: stringConstants.Button.BTN_YES,
      id: stringConstants.Button.HomeScreenLogout_Button,
      enable: true,
      click: success,
    },

    cancel: {
      name: stringConstants.Button.BTN_NO,
      id: stringConstants.Button.Cancel_Button,
      enable: true,
      click: cancel,
    },
  };
};

export const transDoneModalButton = (success: () => void, cancel: () => void) => {
  return {
    success: {
      name: stringConstants.Button.Close,
      id: stringConstants.Button.BTN_CLOSE,
      enable: true,
      click: success,
    },

    cancel: {
      name: stringConstants.Button.BTN_NO,
      id: stringConstants.Button.BTN_NO,
      enable: false,
      click: cancel,
    },
  };
};

export const voidBasketItemModalButtons = (success: () => void, cancel: () => void) => {
  return {
    success: {
      name: stringConstants.Button.BTN_YES,
      id: stringConstants.Button.BTN_YES,
      enable: true,
      click: success,
    },

    cancel: {
      name: stringConstants.Button.BTN_NO,
      id: stringConstants.Button.BTN_NO,
      enable: true,
      click: cancel,
    },
  };
};

export const printModalButton = (success: () => void, cancel: () => void) => {
  return {
    success: {
      name: stringConstants.Button.BTN_YES,
      id: stringConstants.Button.BTN_YES,
      enable: true,
      click: success,
    },

    cancel: {
      name: stringConstants.Button.BTN_NO,
      id: stringConstants.Button.BTN_NO,
      enable: true,
      click: cancel,
    },
  };
};

export const revPaymentModalButton = (success: () => void, cancel: () => void) => {
  return {
    success: {
      name: stringConstants.Button.BTN_YES,
      id: stringConstants.Button.BTN_YES,
      enable: true,
      click: success,
    },

    cancel: {
      name: stringConstants.Button.BTN_NO,
      id: stringConstants.Button.BTN_NO,
      enable: true,
      click: cancel,
    },
  };
};

export const alertModalPopupButton = (success: () => void) => {
  return {
    success: {
      name: stringConstants.Button.Close,
      id: stringConstants.Button.BTN_CLOSE,
      enable: true,
      click: success,
    },

    cancel: {
      name: stringConstants.Button.BTN_NO,
      id: stringConstants.Button.BTN_NO,
      enable: false,
    },
  };
};

export const quantityExceedModalButton = (success: () => void) => {
  return {
    success: {
      name: stringConstants.Button.Ok,
      enable: true,
      click: success,
    },
    cancel: {
      name: "",
      enable: false,
    },
  };
};

export const retryTransactionsButton = (success: () => void, cancel: () => void) => {
  return {
    success: {
      name: stringConstants.Button.Retry,
      id: stringConstants.Button.BTN_RETRY,
      enable: true,
      click: success,
    },

    cancel: {
      name: stringConstants.Button.Cancel_Button,
      id: stringConstants.Button.Cancel_Button,
      enable: true,
      click: cancel,
    },
  };
};

export const updateQuantityModalButton = (success: () => void, cancel: () => void) => {
  return {
    success: {
      name: stringConstants.Button.Update,
      id: stringConstants.Button.Update,
      enable: true,
      click: success,
    },

    cancel: {
      name: stringConstants.Button.Cancel_Button,
      id: stringConstants.Button.Cancel_Button,
      enable: true,
      click: cancel,
    },
  };
};

export const voidBasketModalButton = (success: () => void, cancel: () => void) => {
  return {
    success: {
      name: stringConstants.Button.BTN_YES,
      id: stringConstants.Button.BTN_YES,
      enable: true,
      click: success,
    },

    cancel: {
      name: stringConstants.Button.BTN_NO,
      id: stringConstants.Button.BTN_NO,
      enable: true,
      click: cancel,
    },
  };
};
