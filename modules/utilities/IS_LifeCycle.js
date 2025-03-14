import { IS_BufferOperationQueue } from "../types/buffer/operation/operationQueue/IS_BufferOperationQueue.js";

export const IS_LifeCycle =
{
	_loadCallbacks: [],
	_readyCallbacks: [],
	_startCallbacks: [],
	_stopCallbacks: [],

	load()
	{
		this._doCallbacks(this._loadCallbacks);
		this._wait();
	},

	// TODO: this should be Promises and async awaits at some point
	_wait()
	{
		if(IS_BufferOperationQueue.isOperating)
		{
			console.log("Waiting on Buffer Operation Queue!");
			IS_BufferOperationQueue.registerWaiter(this);
		}
		else
		{
			this._ready();
		}
	},

	endWait(waitingOn)
	{
		if(waitingOn === IS_BufferOperationQueue)
		{
			console.log("Operation Queue Finished!");
			this._ready();
		}
	},

	_ready()
	{
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