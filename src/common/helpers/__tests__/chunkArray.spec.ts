import { chunkArray } from "../chunkArray";
test("data is correctly chunked", () => {
  const sampleData = [
    { item1: { item: "item1", id: 1 } },
    { item2: { item: "item2", id: 2 } },
    { item3: { item: "item3", id: 3 } },
    { item4: { item: "item4", id: 4 } },
    { item5: { item: "item5", id: 5 } },
    { item6: { item: "item6", id: 6 } },
    { item7: { item: "item7", id: 7 } },
  ];

  const expectedResult = [
    [{ item1: { item: "item1", id: 1 } }, { item2: { item: "item2", id: 2 } }],
    [{ item3: { item: "item3", id: 3 } }, { item4: { item: "item4", id: 4 } }],
    [{ item5: { item: "item5", id: 5 } }, { item6: { item: "item6", id: 6 } }],
    [{ item7: { item: "item7", id: 7 } }],
  ];
  expect(chunkArray(sampleData, 2)).toEqual(expectedResult);
});
