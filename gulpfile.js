
let gulp = require('gulp');
let ts = require('gulp-typescript');

let funcFactory = require('./build/gulp_myutil.js').functionFactory;


const src = {
	proj: ['tsconfig.json'],
	tsAll: ['src/ts/*.ts', 'src/ts/*/*.ts'],
	tsGenerated: ['src/ts/Generated/*.ts'],
	glsl: ['src/shaders/*.glsl'],

	tlShaderBuilder: ['src/buildtools/build_shaders.ts'],
	tlAirMassBuilder: ['src/buildtools/build_airmass.ts']
};



// Gulp tasks ------------------------------------------------------------------

let taskBuildToolForShader = funcFactory.buildTool(src.tlShaderBuilder, 'build/build_shaders.js');
let taskBuildToolForAirmass = funcFactory.buildTool(src.tlAirMassBuilder, 'build/build_airmass.js');
let taskRunToolForShader = funcFactory.runTool('build/build_shaders.js', 'src/ts/Generated/ShaderArchive.ts', src.glsl);
let taskRunToolForAirmass = funcFactory.runTool('build/build_airmass.js', 'src/ts/Generated/AirMassData.ts');

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
taskBuildToolForShader.displayName = 'build_tool_shader';
taskBuildToolForAirmass.displayName = 'build_tool_airmass';
taskRunToolForShader.displayName = 'run_tool_shader';
taskRunToolForAirmass.displayName = 'run_tool_airmass';
TaskMain.displayName = 'main';


gulp.task('shader', gulp.series(taskBuildToolForShader, taskRunToolForShader));
gulp.task('airmass', gulp.series(taskBuildToolForAirmass, taskRunToolForAirmass));

let main = gulp.series(gulp.parallel('shader', 'airmass'), TaskMain);
gulp.task('default', main);


gulp.task('watch', function () {
	let watchList = [
		src.proj,
		src.tsAll.concat(src.tsGenerated.map( (item) => '!'+item )),  // exclude generated TS files
		src.glsl,
		src.tlShaderBuilder,
		src.tlAirMassBuilder
	];

	gulp.watch(watchList, main)
		.on('error', () => {} );  // capture error to continure running
} );

