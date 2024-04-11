Install vite and uupVite
```
npm add -D vite uupvite
```

Create vite.config.js:
```
import uupVite from 'uupVite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    uupVite({
      input: [
        'js/main.js',
      ]
    })
  ]
});
```

Add these scripts to your package.json:

```
{
  ...
  "scripts": {
    "build": "vite build",
    "dev": "vite"
  }
  ...
```
