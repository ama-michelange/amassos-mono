const plugin2 = {
  name: "plugin2",
  setup(build) {
    const options = build.initialOptions;
    console.log("plugin2 setup", options);
    options.define.PLUGIN2_TEXT = '"My PATH"';
    build.onStart((args) => {
      console.log("build started", args);
    });
    build.onLoad({ filter: /./ }, async (args) => {
      console.log("plugin2 load", args);
      return {
        contents: 'export const plugin2 = "plugin2"',
      };
    });
  },
};

module.exports = plugin2;
