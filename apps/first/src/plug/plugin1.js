const plugin1 = {
  name: "plugin1",
  setup(build) {
    const options = build.initialOptions;
    console.log("plugin1 setup", options);
    options.define.PLUGIN1_TEXT = '"Value was provided at build time"';
    options.define.hashDir = '"my-hash"';
    build.onStart((args) => {
      console.log("build started", args);
    });
    build.onLoad({ filter: /./ }, async (args) => {
      console.log("plugin1 load", args);
      return {
        contents: 'export const plugin1 = "plugin1"',
      };
    });
  },
};

module.exports = plugin1;
