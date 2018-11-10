

const CONFIG = {
	texSize: 256,
	deltaSampleDistance: 0.1 * 1e3,  // one sample per 100m
	outputFileTS: './src/ts/Generated/AirMassData.ts',
	outputFileJS: './dist/airmass.js'
};


let fs = require('fs');
let path = require('path');



// with three.js-compatibility in mind
class Vector2 {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		[this.x, this.y] = [x, y];
	}

	clone() : Vector2 {
		return new Vector2(this.x, this.y);
	}

	multiplyScalar(scalar: number) : Vector2 {
		this.x *= scalar;
		this.y *= scalar;
		return this;
	}

	add(other: Vector2) : Vector2 {
		this.x += other.x;
		this.y += other.y;
		return this;
	}

	length() : number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
}


class Vector3 extends Vector2 {
	z: number;

	constructor(x: number, y: number, z: number) {
		super(x, y);
		this.z = z;
	}

	clone() : Vector3 {
		return new Vector3(this.x, this.y, this.z);
	}

	multiplyScalar(scalar: number) : Vector3 {
		super.multiplyScalar(scalar);
		this.z *= scalar;
		return this;
	}

	add(other: Vector3) : Vector3 {
		super.add(other);
		this.z += other.z;
		return this;
	}

	length() : number {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}
}



class AtmosphericParam {
	// all units in meters
	public thickness: number = 100 * 1e3;  // REF: Wikipedia. "Atmosphere of Earth"
	public scaleHeight: number = 8.4 * 1e3;  // REF: Wikipedia. "Atmosphere of Earth"
	public planetRadius: number = 6371 * 1e3;
	public airDensity: number = 1.2;  // kg/m^3

	// REF: Egor Yusov. "High Performance Outdoor Light Scattering using Epipolar Sampling". In GPU Pro 5, CRC Press, 2014.
	public coeffExtinction: Vector3 = new Vector3(5.8e-6, 13.5e-6, 33.1e-6);

	// REF: ftp://adk.asrc.cestm.albany.edu/pub/sergey/KiedSier/Bucholtz1995.pdf
	//public coeffExtinction: Vector3 = new Vector3(4.31e-6, 11.9e-6, 29.6e-6);


	// shortcuts
	GetAtmosphereRadius() : number	{ return this.planetRadius + this.thickness; }
	GetMaxViewAngle() : number		{ return Math.PI - Math.asin(this.planetRadius / this.GetAtmosphereRadius()); }
}



function PrecomputeTable(param: AtmosphericParam) : Float32Array {
	let maxAngle = param.GetMaxViewAngle();  // the max angle with non-zero transmittance viewed from the atmospheric top
	let texSize = CONFIG.texSize;
	let result = new Float32Array(texSize * texSize * 3);

	let GetHeight = (pos: Vector2) : number => pos.length() - param.planetRadius;

	let GetAirDistance = (height: number, cosChi: number) : number => {
		let rAirTop = param.GetAtmosphereRadius();
		let rAirNow = param.planetRadius + height;
		return Math.sqrt(rAirTop*rAirTop + rAirNow*rAirNow*(cosChi*cosChi - 1)) - rAirNow*cosChi;
	};

	let GetAirDensity = (height: number) : number => param.airDensity * Math.exp(-height / param.scaleHeight);

	let IntegrateAirMass = (pos: Vector2, dir: Vector2, nSample: number) : number => {
		let result = 0;

		let sampleDist = dir.length();
		let samplePos = dir.clone().multiplyScalar(0.5).add(pos);  // sample at the half-way point of the segment
		for (let i = 0; i < nSample; ++i) {
			let height = GetHeight(samplePos);
			if (height < -5e3)
				return Infinity;
			result += GetAirDensity(height) * sampleDist;
			samplePos.add(dir);
		}

		return result;
	}

	let CalcAirMass = (height: number, cosChi: number) : Vector3 => {
		let totalSampleDistance = GetAirDistance(height, cosChi);
		let airMass = IntegrateAirMass(
			new Vector2(0, param.planetRadius + height),
			new Vector2(Math.sqrt(1 - cosChi*cosChi), cosChi).multiplyScalar(CONFIG.deltaSampleDistance),
			Math.floor(totalSampleDistance / CONFIG.deltaSampleDistance)
		);
		return new Vector3(airMass, 0, 0);
	};


	for (let itHeight = 0; itHeight < texSize; ++itHeight) {
		for (let itZenithAngle = 0; itZenithAngle < texSize; ++itZenithAngle) {
			let index = (itHeight * texSize + itZenithAngle) * 3;
			let airmass = CalcAirMass(
				itHeight / (texSize - 1) * param.thickness,  // range [0, thickness]
				Math.cos(itZenithAngle / (texSize - 1) * maxAngle)  // range [cos_0, cos_maxAngle]
			);
			result[index] = airmass.x;
			result[index + 1] = airmass.y;
			result[index + 2] = airmass.z;
		}
	}

	return result;
}



// class AtmosphericParam and the stub for the texture content
function GenerateCodeTS() : string {
	let atmoParam = new AtmosphericParam();

	return [
		'\n',  // two empty lines
		'declare var __airMassData: Array<number>;',
		'class AirMassData {',
		'	public static readonly texSize = ' + CONFIG.texSize + ';',
		'	public static readonly texData = new Float32Array(__airMassData);',
		'}\n',
		'namespace Astro {',
		'	export class AtmosphericParam {',
		'		// all units in meters',
		'		public readonly thickness: number = ' + atmoParam.thickness + ';',
		'		public readonly planetRadius: number = ' + atmoParam.planetRadius + ';',
		'		public readonly maxAngle: number = ' + atmoParam.GetMaxViewAngle() + ';',
		'',
		'		public readonly betaRayleigh = new THREE.Vector3(' + [atmoParam.coeffExtinction.x, atmoParam.coeffExtinction.y, atmoParam.coeffExtinction.z].join(',') + ');',
		'	}',
		'}  // namespace Astro\n'  // empty line in the end
	].join('\n');
}


// the actual texture content is written to a JS file and is directly imported with a <script> tag in HTML page
function GenerateCodeJS(texData: Float32Array) : string {
	// replace 'Infinity' with '1/0' because, for unknown reasons, it will make WebKit crash on iPhone 6S.
	// also we can slightly reduce file size by doing this.
	let processedTexData: Array<string> = [];
	texData.forEach( (val) => processedTexData.push(val === Infinity ? '1/0' : val.toString()) );

	return [
		'var __airMassData = [',
		processedTexData.join(','),
		'];\n'
	].join('');
}



function Main() : void {
	let GetTimestamp = () : number => Date.now();
	let WriteFileCallback = (err) => { if (err) throw err; };

	fs.writeFile(CONFIG.outputFileTS, GenerateCodeTS(), WriteFileCallback);

	let timestampPre = GetTimestamp();
	let param = new AtmosphericParam();
	let texData = PrecomputeTable(param);
	let timestampPost = GetTimestamp();
	fs.writeFile(CONFIG.outputFileJS, GenerateCodeJS(texData), WriteFileCallback);

	console.log('TransmittanceData.ts was built successfully in ' + (timestampPost - timestampPre) * 1e-3 + ' s.');
}


Main();

