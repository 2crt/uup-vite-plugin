const external = ['path', 'os', 'fs', 'child_process'];

export default {
  input: 'index.js',
  platform: 'node',
  external,
  output: [
    {
      file: 'dist/esm/index.js',
      format: 'esm',
    },
    {
      file: 'dist/cjs/index.cjs',
      format: 'cjs',
    },
  ],
};
