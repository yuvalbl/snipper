import fs from 'fs';
import { exec } from 'child_process';
import path from 'path';

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
	const workDir = process.cwd();

	if (!hasFile(workDir, 'package.json')) {
		console.log(
			'Current working directory is not a package (missing package.json)'
		);
		return;
	}

	if (!isPackageIncludeReact(workDir)) {
		console.log('Not a react project');
		return;
	}

	const isTypeScript = hasFile(workDir, 'tsconfig.json')
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
	plop.setGenerator('connect-react-router-dom', {
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
