

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



// Gulp tasks ------------------------------------------------------------------

var buildtl_shader = MakeFunc_BuildTool(src.tlShaderBuilder, 'build/build_shaders.js');
var buildtl_airmass = MakeFunc_BuildTool(src.tlAirMassBuilder, 'build/build_airmass.js');
var runtl_shader = MakeFunc_RunTool('build/build_shaders.js', 'src/ts/Generated/ShaderArchive.ts', src.glsl);
var runtl_airmass = MakeFunc_RunTool('build/build_airmass.js', 'src/ts/Generated/AirMassData.ts');

function TaskMain(callback) {
	let hasError = false;

	let tsProject = ts.createProject('tsconfig.json');
	tsProject.src()
		.pipe(tsProject())
		.on('error', () => {
			hasError = true;
			callback(new Error('Compilation error in main scripts'));
		} )
		.pipe(gulp.dest('./'))
		.on('finish', () => {
			if (!hasError)
				callback();
		} );
}

// setting display names
buildtl_shader.displayName = 'buildtl_shader';
buildtl_airmass.displayName = 'buildtl_airmass';
runtl_shader.displayName = 'runtl_shader';
runtl_airmass.displayName = 'runtl_airmass';
TaskMain.displayName = 'main';


gulp.task('shader', gulp.series(buildtl_shader, runtl_shader));
gulp.task('airmass', gulp.series(buildtl_airmass, runtl_airmass));

var main = gulp.series(gulp.parallel('shader', 'airmass'), TaskMain);
gulp.task('default', main);


gulp.task('watch', function () {
	var watchList = [
		src.proj,
		src.tsAll.concat(src.tsGenerated.map( (item) => '!'+item )),  // exclude generated TS files
		src.glsl,
		src.tlShaderBuilder,
		src.tlAirMassBuilder
	];

	gulp.watch(watchList, main)
		.on('error', () => {} );  // capture error to continure running
} );



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
			.catch( () => callback(new Error('Failed to run tool ' + script)) ) ;

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

