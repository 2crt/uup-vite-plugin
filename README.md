## How to use

If your project doesn't have package.json, create one: `npm init -y`

Install vite and uupVite
```
npm add -D vite uupvite sass
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

## Setup in WordPress PHP

Require the composer package: `composer require uupvite/vite-assets-loader`

```php
require __DIR__ . '/vendor/autoload.php';

$asset_loader = new \UupVite\ViteAssetsLoader(
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
