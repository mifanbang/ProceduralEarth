# ProceduralEarth
WebGL-based renderer for procedural generation of Earth-like planets and surrounding celestial bodies.

Project site: <https://debug.tw/proc_earth>


## Introduction

Procedural Earth renders most of its objects with textures generated from Perlin noise-based fractals. Therefore it does not require pre-authored images (with the exception of a pre-computed look-up table) which greatly reduces loading time.

Many of the 3D graphics features were implemented with their equivalents in modern high-end video games in mind. Some important features are:

- HDR rendering pipeline
- Auto exposure (eye adaption)
- Physically-based atmospheric scattering
- Cook-Torrance BRDF
- Procedural Milky Way

The performance goal is on average >50fps for iPhone 6S-level phones and 60fps for mid-range desktops/notebooks in FullHD resolution. It works well with Chrome, Firefox, and Safari but may cause errors in Internet Explorer, which is mostly because floating-point textures are not supported by it.


## Directory Contents

- build/ - Target directory for tool scripts (these scripts generate source files into the directory src/ts/Generated/)
- dist/ - Target directory
- src/buildtools/ - Source directory for tool scripts in the directory build/
- src/shaders/ - Source directory of shader fragments
- src/ts/ - Source directory of TypeScript source files


## Build

The source code is written in TypeScript and requires global installation of the following dependencies:

- [Node.js and NPM](https://nodejs.org)
- [TypeScript](https://www.typescriptlang.org/index.html#download-links)
- [Gulp](https://gulpjs.com) (installing just *gulp-cli* globally will suffice)

Before building the project for the very first time, run `npm install` inside the project directory to install other required Node modules. If all went well, there are two ways available to run Gulp:

1. Run `gulp` to rebuild all scripts at once. This may take a short while to finish.
2. Run `gulp watch` to enter monitor mode until a Ctrl-C signal being sent. With this mode running, file modification will trigger Gulp to automatically build and only to build for those target scripts affected by the modified source files.


## Copyright

Copyright (C) 2017-2018 Mifan Bang <https://debug.tw>

Should there not be many great works already well done, this project would not exist. This project is distributed with various parts of the following works:

- [dat.gui](https://github.com/dataarts/dat.gui)
- [stats.js](https://github.com/mrdoob/stats.js)
- [three.js](https://github.com/mrdoob/three.js)

Their individual copyright notices and licenses are listed in the file `LICENCE.md`.

SPECIAL NOTICE: The part from *dat.gui* distributed with this project is a modified version of the original work. Details on the modification can be found at the top of the file `dist/dep/dat.gui-0.6.3.js`.
