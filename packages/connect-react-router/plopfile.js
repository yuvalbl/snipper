import fs from 'fs';
import path from 'path';

import { exec } from 'child_process';
import minimist from 'minimist';

// const PROJECT_ROOT = '../../';

function execute(cmd) {
	exec(cmd, (error, stdout, stderr) => {
		if (error) {
			console.error(`error: ${error.message}`);
			return;
		}
	});
}

function runPrettier(runPath) {
	const cmd = `npx prettier --write --single-quote ${runPath}`;
	console.log(cmd);
	execute(cmd);
}

function hasFile(checkPath, fileName) {
	return fs.existsSync(path.join(checkPath, fileName));
}

function isPackageIncludeReact(checkPath) {
	const rawData = fs.readFileSync(path.join(checkPath, 'package.json'));
	const packageJson = JSON.parse(rawData);
	return !!packageJson?.dependencies?.react;
}

export default function (plop) {

	const args = process.argv.slice(2);
	const argv = minimist(args);
	// if (argv.dev) {
	// 	console.log('dev mode');
	// 	dotenv.config({ path: `${PROJECT_ROOT}.env` });
	// 	process.argv = process.argv.filter(arg => arg !== '--dev')
	// console.log(process.argv);

		console.log(process.env); // remove this after you've confirmed it working
		// check if plop how to ignore passed args remove dev from process.argv?
	// }

	// const workDir = argv.dev ? `${PROJECT_ROOT}${process.env.CONNECT_REACT_ROUTER_DEV_PATH}` : process.cwd();
	const workDir = process.env.DEV_MODE ? process.env.DEV_PATH : process.cwd();
	console.log('========1111=======');
	console.log('process.cwd():', process.cwd());
	console.log('workdor:', workDir);

	if (!hasFile(workDir, 'package.json')) {
		console.log(
			'Current working directory is not a package (missing package.json)'
		);
		return;
	}
	console.log('===============');
	console.log(argv.dev);

	if (!isPackageIncludeReact(workDir)) {
		console.log('Not a react project');
		return;
	}

	const isTypeScript = hasFile(workDir, 'tsconfig.json');
	// plop.setGenerator('react-button', {
	// 	description: 'create a react button',
	// 	prompts: [
	// 		{
	// 			type: 'input',
	// 			name: 'name',
	// 			message: 'controller name please',
	// 		},
	// 	],
	// 	actions: [
	// 		{
	// 			type: 'add',
	// 			path: 'src/{{name}}.js',
	// 			templateFile: 'plop-templates/button.hbs',
	// 		},
	// 	],
	// });
	plop.setActionType('prettify', function (answers, config, plop) {
		runPrettier(config.path);
	});

	plop.setGenerator('connect-react-router', {
		description: 'create react-router-dom to a fresh create-react-app- project',
		prompts: [
			// {
			// 	type: 'confirm',
			// 	name: 'typescript',
			// 	message: 'using typescript?',
			// },
		],
		actions: function (data) {
			const actions = [];
			let ext = isTypeScript ? 'tsx' : 'js';

			// actions.push({
			//     type: 'add',
			//     path: `src/routes.const.${ext}`,
			//     templateFile: `plop-templates/routes.${ext}.hbs`
			// });
			const reactIndexFile = `src/index.${ext}`;

			actions.push({
				type: 'append',
				path: reactIndexFile,
				pattern: /(import.*react-dom.*)/, // add after line containing react-dom import
				template: `import { BrowserRouter } from 'react-router-dom';`,
			});
			actions.push({
				type: 'modify',
				path: reactIndexFile,
				pattern: /(<App.*\/>)/gi,
				template: '<BrowserRouter>\r\n\t$1\r\n</BrowserRouter>',
			});
			actions.push({
				type: 'prettify',
				path: reactIndexFile,
			});
			return actions;
		},
	});
}
