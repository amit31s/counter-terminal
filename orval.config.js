module.exports = {
  counterTerminal: {
    output: {
      mode: "tags-split",
      target: "./endpoints/counterTerminalFromFileSpec.ts",
      schemas: "./model",
      client: "react-query",
      workspace: "src/api/generator",
      override: {
        mutator: {
          path: "./mutator/useCustomInstance.ts",
          name: "useCustomInstance",
        },
        query: {
          useQuery: true,
        },
      },
    },
    input: {
      target: "./counterTerminal.yaml",
    },
  },
};
