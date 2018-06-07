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

/// <reference path="DrawContext.ts" />



namespace Rendering {



export type UniformFulfillmentSetter = (uniform: THREE.IUniform, context: DrawContext) => void;


export class UniformFulfillment {
	public name: string;
	public setter: UniformFulfillmentSetter;


	constructor(name: string, setter: UniformFulfillmentSetter) {
		this.name = name;
		this.setter = setter;
	}
}

export type UniFulList = Array<UniformFulfillment>;



class UniformRequirement {
	public name: string;
	public uniform: THREE.IUniform;


	constructor(name: string, uniform: THREE.IUniform) {
		this.name = name;
		this.uniform = uniform;
	}
}

type UniReqList = Array<UniformRequirement>;



class UniformBindingItem {
	public name: string;
	public setter: UniformFulfillmentSetter;
	public uniform: THREE.IUniform;


	constructor(name: string, setter: UniformFulfillmentSetter, uniform: THREE.IUniform) {
		this.name = name;
		this.setter = setter;
		this.uniform = uniform;
	}

	Update(context: DrawContext) : void {
		this.setter(this.uniform, context);
	}
}



export class UniformBinding {
	private isValid: boolean;
	private bindings: Array<UniformBindingItem>;
	private missing: Array<string>;


	constructor(requirements: UniReqList, fulfillments: UniFulList) {
		this.isValid = false;
		this.bindings = [];
		this.missing = [];

		this.Bind(requirements, fulfillments);
	}

	GetMissing() : Array<string> {
		return this.missing;
	}

	IsValid() : boolean {
		return this.isValid;
	}

	Update(context: DrawContext) : void {
		this.bindings.forEach( (item) => item.Update(context) );
	}

	private Bind(requirements: UniReqList, fulfillments: UniFulList) : void {
		let bindings = requirements
			.map( (itemReq) => {
				let matched = fulfillments.find( (itemFul) => itemFul.name == itemReq.name );
				if (typeof matched !== 'undefined')
					return new UniformBindingItem(itemReq.name, matched.setter, itemReq.uniform);
				else
					this.missing.push(itemReq.name);
				return matched;  // undefined
			} )
			.filter( (item) => typeof item !== 'undefined' ); 

		if (bindings.length === requirements.length) {
			this.bindings = <Array<UniformBindingItem>>bindings;  // cast because we are sure it's not undefined
			this.isValid = true;
		}
	}
}



function BuildRequirements(material: THREE.ShaderMaterial) : UniReqList {
	let uniforms = material.uniforms;
	return Object.keys(uniforms).map( (name) => new UniformRequirement(name, uniforms[name]) );
}


export function BuildUniformSkeleton(names: Array<string>) : {[uniform: string]: THREE.IUniform} {
	let uniforms: { [uniform: string]: THREE.IUniform } = {};
	names.forEach( (name) => uniforms[name] = { value: 0 } );
	return uniforms;
}


export function ExtractUniformNames(code: string) : Array<string> {
	const regexp = /uniform[\s]+[\w]+[\s]+([\w]+)[\s]*;/g;
	let names: Array<string> = [];

	for (let regexpResult = regexp.exec(code); regexpResult !== null; regexpResult = regexp.exec(code))
		names.push(regexpResult[1]);

	const threeBuiltIns = [
		'modelMatrix',
		'modelViewMatrix',
		'projectionMatrix',
		'viewMatrix',
		'normalMatrix',
		'cameraPosition'
	];
	return names.filter( (name) => threeBuiltIns.indexOf(name) === -1 );
}


export function CreateBindingOrThrow(clsName: string, material: THREE.ShaderMaterial, fulfillments: UniFulList) : UniformBinding {
	let requirements = BuildRequirements(material);
	let binding = new UniformBinding(requirements, fulfillments);
	if (!binding.IsValid())
		throw new Error('Renderable=' + clsName + ', Shader=' + material.name + ' lacks fulfillments: ' + binding.GetMissing().join(', '));
	return binding;
}



}  // namespace Rendering

