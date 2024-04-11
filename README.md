## How to use

If your project doesn't have package.json, create one: `npm init -y`

Install vite and uupVite
```
npm add -D vite uupvite
```

Add these scripts to your `package.json`:

```
{
  ...
  "scripts": {
    "build": "vite build",
    "dev": "vite"
  }
  ...
}
```

Add this to package.json:

```
{
  ...
  "type": "module"
  ...
}
```

----

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





