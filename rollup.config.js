import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
    input: 'index.js',
    output: [
        {
            file: 'dist/bundle.cjs.js',
            format: 'cjs',
            exports: 'named',
        },
        {
            file: 'dist/bundle.esm.js',
            format: 'esm',
        },
    ],
    plugins: [
        commonjs(),
        nodeResolve()
    ]
};