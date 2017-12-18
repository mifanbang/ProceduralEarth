/**
 * ProceduralEarth - WebGL-based renderer to procedurally generate Earths
 * https://debug.tw/proc_earth
 *
 * Copyright (C) 2017 Mifan Bang <https://debug.tw>
 *
 * Licensed under the MIT License.
 */


namespace Util {



export type SimpleCallback = () => void;


export class Delegate {
	private funcList: Array<SimpleCallback>;

	constructor() {
		this.funcList = [];
	}

	Add(func: SimpleCallback) : void {
		this.funcList.push(func);
	}

	Invoke() : void {
		this.funcList.forEach( (func) => func() );
	}

	Clear() : void {
		this.funcList = [];
	}

	IsEmpty() : boolean {
		return this.funcList.length === 0;
	}

	Clone() : Delegate {
		return Object.create(this.funcList);
	}
}


export class DelegateSet<T> {
	private dummy: T;  // just to make it a type
	private delegates: { [index: number]: Delegate };


	constructor() {
		this.delegates = {};
		this.dummy;
	}

	private Get(index: number) : Delegate {
		let delegates = this.delegates;
		if (typeof delegates[index] === 'undefined')
			delegates[index] = new Delegate();
		return delegates[index];
	}

	Add(index: number, cb: SimpleCallback) : void {
		this.Get(index).Add(cb);
	}

	Invoke(index: number) : void {
		if (typeof this.delegates[index] !== 'undefined')
			this.delegates[index].Invoke();
	}

	IsEmpty(index: number) : boolean {
		return (typeof this.delegates[index] === 'undefined') || this.delegates[index].IsEmpty();
	}

	Clone() : DelegateSet<T> {
		let newInst = new DelegateSet<T>();
		Object.keys(this.delegates)
			.map( (val) => parseInt(val) )
			.forEach( (key) => newInst.delegates[key] = this.delegates[key].Clone() );
		return newInst;
	}
}



}  // namespace Util

