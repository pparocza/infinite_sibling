import { IS_BufferOperator } from "../types/buffer/operation/operationQueue/IS_BufferOperator.js";

export const IS_LifeCycle =
{
	_loadCallbacks: [],
	_readyCallbacks: [],
	_beforeReadyCallbacks: [],
	_startCallbacks: [],
	_stopCallbacks: [],

	_start: 0,

	load()
	{
		this._doCallbacks(this._loadCallbacks);
		this._beforeReady();
	},

	_beforeReady()
	{
		IS_BufferOperator.registerWaiter(this);
		console.log("Starting Buffer Operations!");
		this._start = Date.now();
		IS_BufferOperator.Operate();
	},

	endWait(waitingOn)
	{
		if(waitingOn === IS_BufferOperator)
		{
			console.log("Operation Queue Finished!", Date.now() - this._start);
			this._ready();
		}
	},

	_ready()
	{
		this._doCallbacks(this._beforeReadyCallbacks);
		this._doCallbacks(this._readyCallbacks);
	},

	start()
	{
		this._doCallbacks(this._startCallbacks)
	},

	stop()
	{
		this._doCallbacks(this._stopCallbacks);
	},

	onLoad(callback)
	{
		this._loadCallbacks.push(callback);
	},

	onReady(callback)
	{
		this._readyCallbacks.push(callback);
	},

	onStart(callback)
	{
		this._startCallbacks.push(callback);
	},

	onStop(callback)
	{
		this._stopCallbacks.push(callback);
	},

	_doCallbacks(callbacks)
	{
		while(callbacks.length > 0)
		{
			callbacks.shift()();
		}
	}
}