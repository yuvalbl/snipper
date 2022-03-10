import fs from 'fs';
import path from 'path';

import { exec } from 'child_process';

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
	const workDir = process.env.DEV_MODE ? process.env.DEV_PATH : process.cwd();
	
	console.log('workdir:', workDir);

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

	const isTypeScript = hasFile(workDir, 'tsconfig.json');
	console.log(`Is typescript project? ${isTypeScript}`);

	plop.setActionType('prettify', function (answers, config, plop) {
		runPrettier(config.path);
	});

	plop.setGenerator('connect-react-router', {
		description: 'add react-router-dom to a fresh create-react-app- project',
		actions: function (data) {
			const actions = [];
			const ext = isTypeScript ? 'tsx' : 'js';
			const reactIndexFile = path.join(workDir, `src/index.${ext}`);

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
