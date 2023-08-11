jest.mock("react-redux/lib/utils/batch.js", () => ({
  setBatch: jest.fn(),
  getBatch: () => (fn) => fn(),
}));

