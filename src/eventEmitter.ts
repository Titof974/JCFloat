// Thanks to https://gist.github.com/mudge/5830382
// A proper js event emitter system for web browser

export class Emitter{

	events: any;
	
	constructor(){
		this.events = {};
	}

	_getEventListByName(eventName: string){
		if(typeof this.events[eventName] === 'undefined'){
			this.events[eventName] = new Set();
		}
		return this.events[eventName]
	}

	on(eventName: string, fn: Function){
		this._getEventListByName(eventName).add(fn);
	}

	once(eventName: string, fn: Function){

		const self = this;

		const onceFn = function(...args: any[]){
			self.removeListener(eventName, onceFn);
			fn.apply(self, args);
		};
		this.on(eventName, onceFn);

	}

	emit(eventName: string, ...args: any[]){
		const that = this;
		this._getEventListByName(eventName).forEach(function(that: Emitter, fn: Function,){
			fn.apply(that, args);
		}.bind(this as Emitter));

	}

	removeListener(eventName: string, fn: Function){
		this._getEventListByName(eventName).delete(fn);
	}
}
