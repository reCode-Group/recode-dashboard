import fs from 'node:fs';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, transformWithEsbuild } from 'vite';

const srcDir = path.resolve(__dirname, 'src');

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
