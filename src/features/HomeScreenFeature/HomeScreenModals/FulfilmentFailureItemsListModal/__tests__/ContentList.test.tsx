import { renderWithRedux } from "@ct/common";
import { CommitStatus } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { TEXT } from "@ct/constants";
import { EntryType } from "@ct/interfaces";
import { IbasketItem } from "@ct/interfaces/basket.interface";
import { ContentList } from "../ContentList";

describe("contentList", () => {
  it("renders", () => {
    const data: IbasketItem[] = [
      {
        id: "1",
        name: "Item 1",
        price: 1,
        quantity: 1,
        total: 1,
        type: EntryType.paymentMode,
        commitStatus: CommitStatus.fail,
        additionalItemsValue: 0,
        fulFillmentStatus: "failure",
        source: "nbit",
      },
      {
        id: "2",
        name: "Item 2",
        price: 2,
        quantity: 1,
        total: 2,
        source: "nbit",
        type: EntryType.paymentMode,
        commitStatus: CommitStatus.fail,
        additionalItemsValue: 0,
        fulFillmentStatus: "failure",
      },
    ];
    const { getByText } = renderWithRedux(<ContentList data={data} price={5} />);
    expect(getByText(TEXT.CTTXT0001)).toBeInTheDocument();
    expect(getByText("Item 1")).toBeInTheDocument();
    expect(getByText("£1.00")).toBeInTheDocument();
    expect(getByText("Item 2")).toBeInTheDocument();
    expect(getByText("£2.00")).toBeInTheDocument();
    expect(getByText("£5.00")).toBeInTheDocument();
  });
});
