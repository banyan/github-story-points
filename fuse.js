const { FuseBox } = require("fuse-box");
const argv = require('yargs').argv;

const isWatch = argv.variant === 'watch';

const fuse = FuseBox.init({
  homeDir: "src",
  target: "browser@es6",
  output: "dist/$name.js",
});

const app = fuse.bundle("story-points").instructions("> [story-points.ts]");
isWatch && app.watch();

fuse.run();
