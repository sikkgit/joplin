import Plugin from '../Plugin';
import Joplin from './Joplin';
import Logger from 'lib/Logger';
const builtinModules = require('builtin-modules');
// const shim = require('lib/shim');

let requireWhiteList_:string[] = null;

function requireWhiteList():string[] {
	if (!requireWhiteList_) {
		requireWhiteList_ = builtinModules.slice();
		requireWhiteList_.push('fs-extra');
	}
	return requireWhiteList_;
}

export default class Global {

	private joplin_: Joplin;
	// private consoleWrapper_:any = null;

	constructor(logger:Logger, implementation:any, plugin: Plugin, store: any) {
		this.joplin_ = new Joplin(logger, implementation.joplin, plugin, store);
		// this.consoleWrapper_ = this.createConsoleWrapper(plugin.id);
	}

	// Wraps console calls to allow prefixing them with "Plugin PLUGIN_ID:"
	// private createConsoleWrapper(pluginId:string) {
	// 	const wrapper:any = {};

	// 	for (const n in console) {
	// 		if (!console.hasOwnProperty(n)) continue;
	// 		wrapper[n] = (...args:any[]) => {
	// 			const newArgs = args.slice();
	// 			newArgs.splice(0, 0, `Plugin "${pluginId}":`);
	// 			return (console as any)[n](...newArgs);
	// 		};
	// 	}

	// 	return wrapper;
	// }

	get joplin(): Joplin {
		return this.joplin_;
	}

	// get console(): any {
	// 	return this.consoleWrapper_;
	// }

	require(filePath:string):any {
		if (!requireWhiteList().includes(filePath)) throw new Error(`Path not allowed: ${filePath}`);
		return require(filePath);
	}

	// To get webpack to work with Node module we need to set the parameter `target: "node"`, however
	// when setting this, the code generated by webpack will try to access the `process` global variable,
	// which won't be defined in the sandbox. So here we simply forward the variable, which makes it all work.
	get process():any {
		return process;
	}

	// setTimeout(fn: Function, interval: number) {
	// 	return shim.setTimeout(() => {
	// 		fn();
	// 	}, interval);
	// }

	// setInterval(fn: Function, interval: number) {
	// 	return shim.setInterval(() => {
	// 		fn();
	// 	}, interval);
	// }

	// alert(message:string) {
	// 	return alert(message);
	// }

	// confirm(message:string) {
	// 	return confirm(message);
	// }

}
