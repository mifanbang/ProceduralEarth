
let exec = require('child_process').exec;
let statSync = require('fs').statSync;
let existsSync = require('fs').existsSync;

let through = require('through2');

let gulp = require('gulp');
let ts = require('gulp-typescript');



// stream related --------------------------------------------------------------

function filter(funcEach, funcEnd) {
	let onChunk = function (file, enc, cb) {
		let newFile = funcEach(file);
		if (typeof newFile !== 'undefined')
			this.push(newFile);
		cb();
	};

	let onFlush = (cb) => {
		if (typeof funcEnd !== 'undefined')
			funcEnd();
		cb();
	};

	return new through.obj(onChunk, onFlush);
}

function hook(funcEach, funcEnd) {
	return filter(
		(file) => {
			funcEach(file);
			return file;
		},
		funcEnd
	);
}

// gather file names and pass as the parameter to func
function gatherNames(func) {
	let names = [];
	return hook(
		(file) => names.push(file.history[0]),
		() => func(names)
	);
}

function newer(targetFile) {
	return filter(
		(file) => {
			if (!existsSync(targetFile))
				return file;

			let targetStat = statSync(targetFile);
			if (targetStat.mtime.getTime() < file.stat.mtime.getTime())
				return file;
			// no return otherwise
		}
	);
}

function checkEmpty(funcSomethingExist, funcEmpty) {
	return gatherNames( (array) => {
		if (array.length > 0)
			funcSomethingExist();
		else if (typeof funcEmpty !== 'undefined')
			funcEmpty();
	} );
}



// task generators -------------------------------------------------------------

function genFuncToBuildTool(srcFiles, outFile) {
	let funcCompileTool = (resolve, reject) => {
		let hasError = false;
		let stream = gulp.src(srcFiles)
			.pipe( newer(outFile) )
			.pipe( ts({
				target: 'ES6',
				outFile: outFile
			}) )
			.on('error', () => {
				hasError = true;
				reject();
			} )
			.on('finish', () => {
				if (!hasError) {
					stream.pipe(gulp.dest('./'))
						.on('finish', () => resolve() );
				}
			} );
	};

	return function (callback) {
		new Promise(funcCompileTool)
			.then( () => callback() )
			.catch( () => callback(new Error('Failed to build tool ' + outFile)) );
	};
}


// $script: .js file to run
// $target: output file of $script to check timestamp
function genFuncToRunTool(script, target, inputs) {
	return function (callback) {
		let funcPackShader = () =>
			new Promise( (resolve, reject) => {
				exec('node ' + script, (error, stdout) => {
					if (error === null) {
						console.log(stdout.toString());
						resolve();
					}
					else {
						console.log(error.message);
						reject();
					}
				} );
			} )
			.then( () => callback() )
			.catch( () => callback(new Error('Failed to run tool ' + script)) ) ;

		if (typeof inputs !== 'undefined') {
			let stream = gulp.src(inputs)
				.pipe( newer(target) )
				.pipe( checkEmpty(funcPackShader, () => callback() ) )
				.resume();
		}
		else if (typeof target !== 'undefined') {
			let stream = gulp.src(script)
				.pipe( newer(target) )
				.pipe( checkEmpty(funcPackShader, () => callback() ) )
				.resume();
		}
	};
}



// export definition -----------------------------------------------------------

module.exports = {
	functionFactory: {
		buildTool: genFuncToBuildTool,
		runTool: genFuncToRunTool
	}
};

