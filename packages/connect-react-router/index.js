#!/usr/bin/env node
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import minimist from 'minimist';
import { Plop, run } from 'plop';

console.log('========0000=======');

const appDir = dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const argv = minimist(args);


console.log('888 exist: ' + process.cwd());
console.log('9999 exist: ' + fs.existsSync('.env.local'));

if (fs.existsSync('.env.local')) {
	dotenv.config({ path: '.env.local' });
}
// console.log('***');
// console.log(argv.preload);
Plop.prepare(
	{
		cwd: argv.cwd,
		configPath: path.join(appDir, 'plopfile.js'),
		preload: argv.preload || [],
		completion: argv.completion,
	},
	(env) => {
		console.log('***22222');
		console.log(env);
		return Plop.execute(env, (env) => {
			const options = {
				...env,
				// this will make the destination path to be based on the cwd when calling the wrapper
				// see: https://plopjs.com/documentation/#wrapping-plop
				dest: process.cwd(),
			};
			return run(options, undefined, true);
		})
	}



);
