#!/usr/bin/env node
// import path, { dirname } from 'path';
// import { fileURLToPath } from 'url';
// import minimist from 'minimist';
// import { Plop, run } from 'plop';
// const chalk = require('chalk');
import fs from 'fs';
import { execSync } from 'child_process';
import chalk from 'chalk';

// const packageJson = require('./package.json');	// still experimental https://stackoverflow.com/questions/60205891/import-json-extension-in-es6-node-js-throws-an-error
// import packageJson from './package.json';
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

function execute(cmd) {
	// using stdio:inherit to keep getting process output
	execSync(cmd, {stdio: 'inherit'}, (error, stdout, stderr) => {
		if (error) {
			console.error(`error: ${error.message}`);
			return;
		}
	});
}

import { Command } from 'commander';

function init() {
	const program = new Command();

	let snipName;
	program
		.version(packageJson.version)
		.arguments('<snip-name>')
		.usage(`${chalk.green('<project-directory>')} [options]`)
		.action((name) => {
			snipName = name;
		})
		.option('--dev', 'run in dev mode');
	// program
	//   .option('-d, --debug', 'output extra debugging')
	//   .option('-s, --small', 'small pizza size')
	//   .option('-p, --pizza-type <type>', 'flavour of pizza');

	program.parse(process.argv);
	const options = program.opts();

	if (typeof snipName === 'undefined') {
		console.error('Please specify a snip name to run it. for example:');
		console.log(
			`  ${chalk.cyan(program.name())} ${chalk.green('connect-react-router')}`
		);
		return; // send envinfo?
	}
	if (options.dev) {
		const packageDir = `../${snipName}`;
		console.log(
			`${chalk.cyan('running in dev mode - logging for')} ${chalk.green(
				packageDir
			)}`
		);

		// process.chdir(packageDir);
		const cmd = `node . --dev`;
		console.log(cmd);

		execute(cmd);
	} else {
		execute(`npx ${snipName}`);
	}
}

init();
// const appDir = dirname(fileURLToPath(import.meta.url));

// const args = process.argv.slice(2);
// const argv = minimist(args);

// console.log('argv', argv);

// Plop.prepare(
// 	{
// 		cwd: argv.cwd,
// 		configPath: path.join(appDir, 'plopfile.js'),
// 		preload: argv.preload || [],
// 		completion: argv.completion,
// 	},
// 	(env) =>
// 		Plop.execute(env, (env) => {
// 			const options = {
// 				...env,
// 				// this will make the destination path to be based on the cwd when calling the wrapper
// 				// see: https://plopjs.com/documentation/#wrapping-plop
// 				dest: process.cwd(),
// 			};
// 			return run(options, undefined, true);
// 		})
// );
