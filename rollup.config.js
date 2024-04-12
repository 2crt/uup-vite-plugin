import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default [
  {
    // ESM configuration
    input: 'index.js',
    output: {
      file: 'dist/esm/index.js',
      format: 'esm',
    },
    plugins: [
      resolve(),
      commonjs()
    ]
  },
  {
    // CJS configuration
    input: 'index.js',
    output: {
      file: 'dist/cjs/index.cjs',
      format: 'cjs',
    },
    plugins: [
      resolve(),
      commonjs()
    ]
  }
];