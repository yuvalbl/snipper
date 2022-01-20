#!/usr/bin/env node
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import minimist from 'minimist';
import { Plop, run } from 'plop';

const appDir = dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const argv = minimist(args);

Plop.prepare(
	{
		cwd: argv.cwd,
		configPath: path.join(appDir, 'plopfile.js'),
		preload: argv.preload || [],
		completion: argv.completion,
	},
	(env) =>
		Plop.execute(env, (env) => {
			const options = {
				...env,
				// this will make the destination path to be based on the cwd when calling the wrapper
				// see: https://plopjs.com/documentation/#wrapping-plop
				dest: process.cwd(),
			};
			return run(options, undefined, true);
		})
);
