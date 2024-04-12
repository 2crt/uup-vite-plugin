import path from 'path';
import os from 'os';
import fs from 'fs';
import colors from 'picocolors';

export default function uupVite(config) {
    const open = config.openUrl ?? false;
    const port = config.port ?? 1986;
    const input = config.input ?? [];

    return {
        name: "uupVite",
        config: () => ({
            root: './',
            base: './',
            build: {
                rollupOptions: {
                    input
                },
                outDir: './dist/',
                manifest: 'manifest.json',
            },

            server: {
                host: '127.0.0.1',
                port,
                open,
            }
        }),
        configureServer: (server) => {
            const hotFilePath = path.join(
                '.hotfile.json'
            );
                
            server.httpServer?.once('listening', () => {
                const httpServer = server.httpServer?.address();
                
                if ( ! httpServer ) {
                    throw new Error('Could not determine the address of the dev server');
                }
                
                const hotFileData = {
                    address: `http://${ httpServer.address }:${ httpServer.port }/`,
                    generatedOnHost: os.hostname(),
                };

                fs.writeFileSync(
                    hotFilePath,
                    JSON.stringify(hotFileData)
                );
            });
            setTimeout(() => {
                const wpUrl = open;

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
