import { IS_BufferOperationWorkerBridge } from "../workers/IS_BufferOperationWorkerBridge.js";
import { IS_BufferFunctionType } from "../function/IS_BufferFunctionType.js";
import { IS_BufferFunctionData } from "../function/IS_BufferFunctionData.js";
import { IS_BufferOperationQueueBufferRegistry } from "./IS_BufferOperationQueueBufferRegistry.js";

export const IS_BufferOperationQueue =
{
	_operationRequestQueue: [],
	get operationRequestQueue() { return this._operationRequestQueue; },

	_isOperating: false,
	get isOperating() { return this._isOperating; },

	_progress: 0,
	_progressIncrement: 0,
	_queueLength: 0,
	_progressListeners: [],

	_waiters : [],

	get Progress() { return this._progress; },

	// TODO: batch operations for a single buffer into a single piece of data that gets sent to WASM
	//  OR, every time WASM completes an operation, it pings back to JS for the next one <- this is
	//  exactly what you're trying to reduce tho <- the biggest issue is that you don't know when
	//  to consider a batch done, though since this is currently all offline, you can just have that
	//  happen on load (no bueno for real time buffer generation on the fly tho)
	requestOperation(iSAudioBuffer, bufferOperationRequestData)
	{
		this._isOperating = true;
		IS_BufferOperationQueueBufferRegistry.addOperationRequest(iSAudioBuffer);
		this._enqueueBufferOperation(bufferOperationRequestData);
	},

	_enqueueBufferOperation(bufferOperationRequestData)
	{
		this.operationRequestQueue.push(bufferOperationRequestData);

		if(this.operationRequestQueue.length === 1)
		{
			this._nextOperation();
		}
	},

	_nextOperation()
	{
		let currentRequest = this.operationRequestQueue[0];
		let requestData = this._ensureCurrentData(currentRequest);

		IS_BufferOperationWorkerBridge.requestOperation(requestData);
	},

	_ensureCurrentData(requestData)
	{
		let functionType = requestData.functionData.functionType;

		switch(functionType)
		{
			case(IS_BufferFunctionType.Buffer):
				requestData = this._handleBufferFunctionType(requestData);
				break;
			case(IS_BufferFunctionType.SuspendedOperations):
				requestData = this._handleSuspendedOperationsFunctionType(requestData);
				break;
		}

		if (requestData.isSuspendedOperation)
		{
			requestData.currentBufferArray =
				IS_BufferOperationQueueBufferRegistry
					.getCurrentSuspendedOperationsArray(requestData.bufferUuid);
		}

		return requestData;
	},

	_handleBufferFunctionType(bufferOperationRequestData)
	{
		let otherBuffer = bufferOperationRequestData.functionData.functionArgs[0];

		let functionBuffer = otherBuffer.isISBuffer ? otherBuffer.buffer : otherBuffer;
		let functionArray = new Float32Array(functionBuffer.length);
		functionBuffer.copyFromChannel(functionArray, 0);

		bufferOperationRequestData.functionData = new IS_BufferFunctionData
		(
			IS_BufferFunctionType.Buffer, null
		);

		/*
		 Right now, WASM needs to receive this array DIRECTLY, not this array as the first
		 member of an ...args array
		 */
		bufferOperationRequestData.functionData.functionArgs = functionArray;

		return bufferOperationRequestData;
	},

	_handleSuspendedOperationsFunctionType(bufferOperationRequestData)
	{
		let currentSuspendedOperationsArray = IS_BufferOperationQueueBufferRegistry
		.getCurrentSuspendedOperationsArray
		(
			bufferOperationRequestData.bufferUuid
		);

		bufferOperationRequestData.functionData = new IS_BufferFunctionData
		(
			IS_BufferFunctionType.SuspendedOperations, null
		);

		/*
		 Right now, WASM needs to receive this array DIRECTLY, not this array as the first
		 member of an ...args array
		 */
		bufferOperationRequestData.functionData.functionArgs = currentSuspendedOperationsArray;

		return bufferOperationRequestData;
	},

	CompleteOperation(completedOperationData)
	{
		let bufferUuid = completedOperationData.bufferUuid;

		IS_BufferOperationQueueBufferRegistry.completeOperationRequest(completedOperationData);

		this._handleOperationComplete(bufferUuid);
	},

	_handleOperationComplete(uuid)
	{
		this.operationRequestQueue.shift();

		this._updateProgress();

		if(this.operationRequestQueue.length > 0)
		{
			this._nextOperation();
		}
		else
		{
			this._handleQueueComplete();
		}
	},

	_handleQueueComplete()
	{
		this._isOperating = false;

		this._endWaits();
		this._resetProgress();
	},

	_updateProgress()
	{
		if(this._queueLength === 0)
		{
			let currentOperationRequestQueueLength = this._operationRequestQueue.length;
			this._queueLength = Math.max(1, currentOperationRequestQueueLength);
		}

		this._progress = this._progressIncrement++ / this._queueLength;

		this._updateProgressListeners();
	},

	_resetProgress()
	{
		this._progressIncrement = 0;
		this._queueLength = 0;
	},

	set progressListener(listener)
	{
		this._progressListeners.push(listener);
	},

	_updateProgressListeners()
	{
		for(let listenerIndex = 0; listenerIndex < this._progressListeners.length; listenerIndex++)
		{
			let listener = this._progressListeners[listenerIndex];
			listener.getValue(this.Progress);
		}
	},

	registerWaiter(waiter)
	{
		this._waiters.push(waiter);
	},

	_endWaits()
	{
		while(this._waiters.length > 0)
		{
			this._waiters.shift().endWait(this);
		}
	}
}