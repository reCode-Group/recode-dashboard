import fs from 'node:fs';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, transformWithEsbuild } from 'vite';

const srcDir = path.resolve(__dirname, 'src');

const isSensitiveFileRequest = (url = '') => {
	let pathname;

	try {
		pathname = decodeURIComponent(url.split('?', 1)[0]);
	} catch {
		return true;
	}

	return /(?:^|\/)\.(?:env(?:\.[^/]*)?|git)(?:\/|$)/i.test(pathname);
};

const blockSensitiveFileRequests = {
	name: 'block-sensitive-file-requests',
	configureServer(server) {
		server.middlewares.use((request, response, next) => {
			if (!isSensitiveFileRequest(request.url)) {
				return next();
			}

			response.statusCode = 404;
			response.end('Not found');
		});
	},
};

const srcAliases = fs.readdirSync(srcDir, { withFileTypes: true }).flatMap((entry) => {
	const absolutePath = path.resolve(srcDir, entry.name);

	if (entry.isDirectory()) {
		return {
			find: entry.name,
			replacement: absolutePath,
		};
	}

	const extension = path.extname(entry.name);
	const basename = path.basename(entry.name, extension);

	return [
		{
			find: entry.name,
			replacement: absolutePath,
		},
		{
			find: basename,
			replacement: absolutePath,
		},
	];
});

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const apiProxyTarget = env.VITE_API_PROXY_TARGET || env.VITE_API_BASE_URL || 'http://localhost:8080';

	return {
		plugins: [
			blockSensitiveFileRequests,
			{
				name: 'jsx-in-js',
				enforce: 'pre',
				async transform(code, id) {
					if (!id.includes('/src/') || !/\.[jt]sx?$/.test(id)) {
						return null;
					}

					return transformWithEsbuild(code, id, {
						loader: 'jsx',
						jsx: 'automatic',
					});
				},
			},
			react(),
		],
		resolve: {
			alias: srcAliases,
		},
		server: {
			proxy: {
				'/api': {
					target: apiProxyTarget,
					changeOrigin: true,
				},
			},
		},
		build: {
			outDir: 'build',
			target: 'esnext',
		},
	};
});
