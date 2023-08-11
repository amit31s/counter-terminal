export const window = {};

Object.defineProperty(window, "electronAPI", {
  value: {
    logger: () => jest.fn(),
  },
});
