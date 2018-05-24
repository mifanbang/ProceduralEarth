
let gulp = require('gulp');
let ts = require('gulp-typescript');

let funcFactory = require('./build/gulp_myutil.js').FunctionFactory;


const src = {
	proj: ['tsconfig.json'],
	tsAll: ['src/ts/*.ts', 'src/ts/*/*.ts'],
	tsGenerated: ['src/ts/Generated/*.ts'],
	glsl: ['src/shaders/*.glsl'],

	tlShaderBuilder: ['src/buildtools/build_shaders.ts'],
	tlAirMassBuilder: ['src/buildtools/build_airmass.ts']
};



// Gulp tasks ------------------------------------------------------------------

let buildtl_shader = funcFactory.BuildTool(src.tlShaderBuilder, 'build/build_shaders.js');
let buildtl_airmass = funcFactory.BuildTool(src.tlAirMassBuilder, 'build/build_airmass.js');
let runtl_shader = funcFactory.RunTool('build/build_shaders.js', 'src/ts/Generated/ShaderArchive.ts', src.glsl);
let runtl_airmass = funcFactory.RunTool('build/build_airmass.js', 'src/ts/Generated/AirMassData.ts');

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

