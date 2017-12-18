/**
 * ProceduralEarth - WebGL-based renderer to procedurally generate Earths
 * https://debug.tw/proc_earth
 *
 * Copyright (C) 2017 Mifan Bang <https://debug.tw>
 *
 * Licensed under the MIT License.
 */


namespace Rendering {



export class Manager {
	private frameCount: number;
	private renderTasks: Array<() => void>;

	public static instance: Manager = new Manager();


	constructor() {
		this.frameCount = 0;
		this.renderTasks = [];

		this.BookNextFrame();
	}

	GetFrameCount() : number {
		return this.frameCount;
	}

	RegisterTask(newTask: () => void) : void {
		this.renderTasks.push(newTask);
	}

	private Render() : void {
		this.renderTasks.forEach( (func) => func() );
		++this.frameCount;

		this.BookNextFrame();
	}

	private BookNextFrame() : void {
		requestAnimationFrame( () => this.Render() );
	}
}



} // namespace Rendering 

