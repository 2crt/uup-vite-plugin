import path from 'path';
import os from 'os';
import fs from 'fs';
import colors from 'picocolors';
import { execSync } from 'child_process';

export default function uupVite() {
    return {
        name: "uupVite",
        config: (config) => {
            const port = config.port ?? 1986;
            const input = config.input ?? [];
            const open = config.openUrl ?? getWpInstanceHomeUrl();

            return {
                root: './',
                base: './',
                build: {
                    rollupOptions: {
                        input
                    },
                    outDir: './dist/',
                    assetsDir: '',
                    manifest: 'manifest.json',
                },

                server: {
                    host: '127.0.0.1',
                    cors: true,
                    port,
                    open,
                }
            }
        },
        configureServer: (server) => {
            const hotFilePath = path.join('dist', '.hotfile.json');
                
            server.httpServer?.once('listening', () => {
                const httpServer = server.httpServer?.address();
                
                if ( ! httpServer ) {
                    throw new Error('Could not determine the address of the dev server');
                }
                
                const hotFileData = {
                    address: `http://${ httpServer.address }:${ httpServer.port }/`,
                    generatedOnHost: os.hostname(),
                };

                if (!fs.existsSync(path.dirname(hotFilePath))){
                    fs.mkdirSync(path.dirname(hotFilePath));
                }

                fs.writeFileSync(
                    hotFilePath,
                    JSON.stringify(hotFileData)
                );
            });
            setTimeout(() => {
                const wpUrl = server.config.openUrl ?? getWpInstanceHomeUrl();

                if (wpUrl) {
                    server.config.logger.info(`${colors.green( `  ➜  [WP-vite]: WordPress URL: ${wpUrl}` ) }` );
                } else {
                    server.config.logger.warn(`${colors.yellow( `  ➜  [WP-vite] Could not determine WordPress URL` ) }` );
                }
                server.config.logger.info(`${colors.green( `  ➜  [WP-vite] Vite dev process running` ) }` );
            }, 1000);

            // Cleanup the lock file when the process is stopped
            const clean = () => {
                if (fs.existsSync(hotFilePath)) {
                    fs.rmSync(hotFilePath)
                }
            };
            process.on('exit', clean);
            process.on('SIGINT', () => process.exit())
            process.on('SIGTERM', () => process.exit())
            process.on('SIGHUP', () => process.exit())
        }
    };
}

function getWpInstanceHomeUrl() {
	const droneJsonPath = path.join(findWpRootDir(), 'drone.json');
	let homeUrl;

	// Try to get the home URL our from drone.json config file; this should
	// speed up the boot in local environment (compared to reading wp cli)
	if (fs.existsSync(droneJsonPath)) {
		const droneConfig = JSON.parse(fs.readFileSync(droneJsonPath));
		if (droneConfig && droneConfig.home_url) {
			homeUrl = droneConfig.home_url
		}
	} else {
		try {
			// Try to get the home url from wp-cli
			homeUrl = execSync('wp option get home', {
				encoding: 'utf8',
				timeout: 1000
			}).trim();
		} catch (e) {
			// give up ... in this case the user will need to
			// open the browser themselves
			return null
		}
	}

	// Validate the URL -- invalid address would break the whole dev
	// process, so it's better not to open a browser and keep the
	// `watch` process going. The vite plugin will provide a
	// warning message for the user in this case.
	if (homeUrl.match(/^https?:\/\/[\w\d\-.]+(\/.*$|$)/)) {
		return homeUrl;
	}

	return null;
}

/**
 * Try to find a directory in the parents that contain a 'wp-config.php' file
 *
 * @returns {string|null}
 */
function findWpRootDir() {
	let dir = process.cwd();
	const fsRoot = path.parse(dir).root;

	do {
		if (fs.existsSync(path.join(dir, 'wp-config.php'))) {
			return dir
		}
		dir = path.resolve(dir, '..');
	} while (dir !== fsRoot);

	return null;
}