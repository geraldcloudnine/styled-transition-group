import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import pkg from "./package.json" assert { type: "json" };
import { babel } from "@rollup/plugin-babel";

const include = ["src/**"];

const deps = Object.keys(pkg.dependencies).concat(
  Object.keys(pkg.peerDependencies)
);

const EXTERNALS = new RegExp(`^(${deps.join("|")})|node_modules`);

export default {
  input: "src/index.js",
  output: [
    { file: "dist/bundle.js", format: "cjs" },
    { file: "dist/bundle.es.js", format: "es" },
  ],
  external: (name) => EXTERNALS.test(name),
  plugins: [
    nodeResolve({ extensions: [".js", ".jsx"] }),
    commonjs({
      exclude: include,
    }),
    babel({
      include,
      babelHelpers: "bundled",
    }),
  ],
};
