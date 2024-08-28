## How to use

If your project doesn't have package.json, create one: `npm init -y`

Install vite and uupVite
```
npm add -D vite uup-vite-plugin sass
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

Create a `vite.config.js`:
```
import uupVite from 'uup-vite-plugin';
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

## Setup in WordPress PHP

Require the composer package: `composer require 2crt/uup-assets-loader`

```php
require __DIR__ . '/vendor/autoload.php';

$asset_loader = new \Uup\ViteAssetsLoader(
    __DIR__ . '/dist/manifest.json',
    get_stylesheet_directory_uri() . '/dist/manifest.json'
);

$asset_loader->enqueue_script(
    'theme-js', // handle
    'js/main.js' // source file
);

$asset_loader->enqueue_style(
    'theme-styles', // handle
    'resources/css/theme.scss' // source file
);
```
