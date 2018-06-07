/**
 * This file is a part of ProceduralEarth.
 *
 * ProceduralEarth - WebGL-based renderer to procedurally generate Earths
 * https://debug.tw/proc_earth
 *
 * Copyright (C) 2017-2018 Mifan Bang <https://debug.tw>
 *
 * Licensed under the MIT License.
 */

/// <reference path="FBMTexture.ts" />



namespace Noise {



export class AnimatedFBMTextureParam {
	public resolution: number = 512;
	public type: FBMType = FBMType.BasicAndTerrain;
	public numIncreDraw: number = 16;  // must be 2^even_num
	public displace: THREE.Vector3 = new THREE.Vector3(1.68, 54.38, 3.14);
	public freqScaler: number = 1;
	public step: THREE.Vector3 = new THREE.Vector3(1, -1, 1).multiplyScalar(0.03);
	public keyFrameLength: number = 5;  // in seconds


	Clone() : AnimatedFBMTextureParam {
		let result = new AnimatedFBMTextureParam();
		result.resolution = this.resolution;
		result.type = this.type;
		result.numIncreDraw = this.numIncreDraw;
		result.displace = this.displace.clone();
		result.freqScaler = this.freqScaler;
		result.step = this.step.clone();
		result.keyFrameLength = this.keyFrameLength;
		return result;
	}
}



export abstract class AnimatedCubeTexture {
	abstract IsReady() : boolean;
	abstract GetFrontTexture() : THREE.CubeTexture;
	abstract GetBlendingFactor() : number;
}



export class AnimatedFBMTexture implements AnimatedCubeTexture {
	private texFront: FBMTexture;
	private texBack: FBMTexture;
	private param: AnimatedFBMTextureParam;
	private lastUpdateTime: number;
	private numStep: number;  // used to calc new displace during swap
	private blendFactor: number;


	constructor(param: AnimatedFBMTextureParam, geoRepo: Resource.GeometryRepo, texGradient?: GradientTexture) {
		this.param = param.Clone();
		let fbmParams = AnimatedFBMTexture.BuildFBMParamList(param);

		this.texFront = new FBMTexture(fbmParams[0], geoRepo, texGradient);
		this.texBack = new FBMTexture(fbmParams[1], geoRepo, texGradient);
		this.texFront.SetPrevFBMTex(this.texBack);
		this.texBack.SetPrevFBMTex(this.texFront);

		this.lastUpdateTime = new Date().getTime();
		this.numStep = 2;
		this.blendFactor = 0;
	}

	UpdateFrame(renderer: THREE.WebGLRenderer) : void {
		let texToUpdate: FBMTexture | undefined;
		if ((texToUpdate = this.GetFirstNotReady()) !== undefined)
			texToUpdate.UpdateFrame(renderer);
		else if (this.ShouldSwap()) {
			this.SwapBuffers();

			let displace = this.param.displace.clone();
			let step = this.param.step.clone().multiplyScalar(this.numStep);
			this.texBack.SetDisplace(0, this.texFront.GetDisplace(1));
			this.texBack.SetDisplace(1, displace.add(step));

			this.texBack.Regenerate(renderer);  // back buffer
		}

		let newUpdateTime = new Date().getTime();
		if (this.IsReady()) {
			let deltaTime = newUpdateTime - this.lastUpdateTime;
			this.blendFactor = Math.min(this.blendFactor + deltaTime / this.param.keyFrameLength * 1e-3, 1);
		}
		this.lastUpdateTime = new Date().getTime();
	}

	IsReady() : boolean {
		return this.texFront.IsReady();
	}

	GetFrontTexture() : THREE.CubeTexture {
		return this.texFront.GetTexture();
	}

	GetBlendingFactor() : number {
		return this.blendFactor;
	}

	// return undefined if all ready
	private GetFirstNotReady() : FBMTexture | undefined {
		return [ this.texFront, this.texBack ].find( (tex) => !tex.IsReady() );
	}

	private ShouldSwap() : boolean {
		return this.texFront.IsReady()
			&& this.texBack.IsReady()
			&& this.blendFactor === 1;
	}

	private SwapBuffers() : void {
		let tmp = this.texFront;
		this.texFront = this.texBack;
		this.texBack = tmp;

		this.numStep += this.blendFactor;
		this.blendFactor = 0;
	}

	private static BuildFBMParamList(animParam: AnimatedFBMTextureParam) : Array<FBMTextureParam> {
		let temp = new FBMTextureParam();
		temp.resolution = animParam.resolution;
		temp.type = animParam.type;
		temp.numIncreDraw = animParam.numIncreDraw;
		temp.displace1 = animParam.displace.clone();
		temp.displace2 = animParam.displace.clone().add(animParam.step);
		temp.freqScaler = animParam.freqScaler;

		let result = Array<FBMTextureParam>(2);
		result[0] = temp.Clone();

		temp.displace1.copy(temp.displace2);
		temp.displace2.add(animParam.step);
		result[1] = temp.Clone();

		return result;
	}
}


	
}  // namespace Noise

