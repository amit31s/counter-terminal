import { renderHookWithRedux } from "@ct/common/helpers";
import { authMock, updatePouchDispatchListMock } from "@ct/utils/MockData/reduxMock";
import { usePouchDispatchScanner } from "../usePouchDispatchScanner";

describe("usePouchDispatchScanner network tests", () => {
  it("makes a request to the correct URL", async () => {
    const params = {
      barcode: "test-barcode",
      transaction_id: updatePouchDispatchListMock.data.dispatch_txn_id,
      branch_id: authMock.device.branchID,
    };
    // TODO: need to write complete test case when will start on pouch dispatch
    // task : https://pol-jira.atlassian.net/browse/BM-6071
    renderHookWithRedux(() =>
      usePouchDispatchScanner({
        queryString: params.barcode,
      }),
    );
  });
});
