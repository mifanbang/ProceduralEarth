const CONFIG = {
    inputDir: './src/shaders/',
    outputFile: './src/ts/Generated/ShaderArchive.ts',
    fileExt: '.glsl' // lower case
};
let fs = require('fs');
let path = require('path');
function GetFileListWithExt(dir, ext) {
    return fs.readdirSync(dir)
        .filter((name) => path.extname(name).toLowerCase() === ext.toLowerCase());
}
function GetFileContent(name) {
    return fs.readFileSync(name)
        .toString();
}
function ConvertToStringLiteral(str) {
    return str.replace(/^[\s]*\n/gm, '') // emtpy lines
        .replace(/\\/g, '\\\\')
        .replace(/\'/g, '\\\'')
        .replace(/\"/g, '\\\"')
        .replace(/\n/g, '\\n');
}
function Main() {
    let shaderFiles = GetFileListWithExt(CONFIG.inputDir, CONFIG.fileExt);
    let outputCode = ['class ShaderArchive {'];
    shaderFiles.forEach((name) => {
        let filePath = path.resolve(CONFIG.inputDir, name);
        let content = ConvertToStringLiteral(GetFileContent(filePath));
        let shaderName = path.basename(name, CONFIG.fileExt);
        outputCode.push(['\tstatic readonly ', shaderName, ': string = \'', content, '\';'].join(''));
    });
    outputCode.push('}');
    fs.writeFileSync(CONFIG.outputFile, outputCode.join('\n'));
    console.log('ShaderArchive.ts was built successfully.');
}
Main();
