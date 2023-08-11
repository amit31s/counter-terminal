export const setUrl = (url = ""): string => {
  let endpoint = "";
  switch (true) {
    case url === "/transaction":
      endpoint = "transfer/v1/transaction";
      break;
    case url.includes("/v1/association"):
    case url.includes("/v1/dissociation-counter"):
      endpoint = "/bm-accounting-location" + url;
      break;
    case url.includes("/pouch/list"):
    case url.includes("/acceptance/validate"):
    case url.includes("/acceptance/list"):
    case url.includes("/despatch/validate"):
    case url.includes("/despatch/list"):
      endpoint = "/bm-pouch-management" + url;
      break;
    case url.includes("/basket/"):
      endpoint = "transactions/v2" + url;
      break;
    case url.includes("/lastBasket"):
      endpoint = "/transactions/v3" + url;
      break;
    case url.includes("/branch/"):
      endpoint = "/transactionviewer/v1" + url;
      break;
    default:
      endpoint = url;
  }
  return endpoint;
};
