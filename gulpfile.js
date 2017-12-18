

let exec = require('child_process').exec;
let statSync = require('fs').statSync;
let existsSync = require('fs').existsSync;

let through = require('through2');

let gulp = require('gulp');
let ts = require('gulp-typescript');


const src = {
	proj: ['tsconfig.json'],
	tsAll: ['src/ts/*.ts', 'src/ts/*/*.ts'],
	tsGenerated: ['src/ts/Generated/*.ts'],
	glsl: ['src/shaders/*.glsl'],

	tlShaderBuilder: ['src/buildtools/build_shaders.ts'],
	tlAirMassBuilder: ['src/buildtools/build_airmass.ts']
};



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
	)	
}

function check_empty(funcSomethingExist, funcEmpty) {
	return gatherNames( (array) => {
		if (array.length > 0)
			funcSomethingExist();
		else if (typeof funcEmpty !== 'undefined')
			funcEmpty();
	} );
}



// task generators -------------------------------------------------------------

function MakeFunc_BuildTool(srcFiles, outFile) {
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
					stream.pipe(gulp.dest(''))
						.on('finish', () => resolve() );
				}
			} );
	};

	return function (callback) {
		new Promise(funcCompileTool)
			.then( () => callback() )  // on success
			.catch( () => callback('Failed to build ' + outFile) );
	};
}


// $script: .js file to run
// $target: output file of $script to check timestamp
function MakeFunc_RunTool(script, target, inputs) {
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
			.catch( () => callback('Failed to run ' + script) ) ;

		if (typeof inputs !== 'undefined') {
			let stream = gulp.src(inputs)
				.pipe( newer(target) )
				.pipe( check_empty(funcPackShader, () => callback() ) )
				.resume();
		}
		else if (typeof target !== 'undefined') {
			let stream = gulp.src(script)
				.pipe( newer(target) )
				.pipe( check_empty(funcPackShader, () => callback() ) )
				.resume();
		}
	}
}



// tasks -----------------------------------------------------------------------

gulp.task('tool_shader', MakeFunc_BuildTool(src.tlShaderBuilder, 'build/build_shaders.js'));
gulp.task('tool_airmass', MakeFunc_BuildTool(src.tlAirMassBuilder, 'build/build_airmass.js'));


gulp.task('shader', ['tool_shader'], MakeFunc_RunTool('build/build_shaders.js', 'src/ts/Generated/ShaderArchive.ts', src.glsl));
gulp.task('airmass', ['tool_airmass'], MakeFunc_RunTool('build/build_airmass.js', 'src/ts/Generated/AirMassData.ts'));


gulp.task('main', ['shader', 'airmass'], function (callback) {
	let hasError = false;

	let tsProject = ts.createProject('tsconfig.json');
	tsProject.src()
		.pipe(tsProject())
		.on('error', () => {
			hasError = true;
			callback('Compilation error in main scripts');
		} )
		.pipe(gulp.dest(''))
		.on('finish', () => {
			if (!hasError)
				callback();
		} );
} );


gulp.task('default', ['main']);


gulp.task('watch', function () {
	gulp.watch(src.proj, ['main']);
	gulp.watch(src.tsAll.concat(src.tsGenerated.map( (item) => '!'+item )), ['main']);  // only authored TS files
	gulp.watch(src.glsl, ['main']);
	gulp.watch(src.tlShaderBuilder, ['main']);
	gulp.watch(src.tlAirMassBuilder, ['main']);
} );

