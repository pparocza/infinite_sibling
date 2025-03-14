import { IS_BufferOperationWorkerBridge } from "../workers/IS_BufferOperationWorkerBridge.js";
import { IS_BufferFunctionType } from "../function/IS_BufferFunctionType.js";
import { IS_BufferFunctionData } from "../function/IS_BufferFunctionData.js";
import { IS_BufferOperationQueueBufferRegistry } from "./IS_BufferOperationQueueBufferRegistry.js";

const BufferRegistry = IS_BufferOperationQueueBufferRegistry;

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

	requestOperation(iSAudioBuffer, bufferOperationRequestData)
	{
		this._isOperating = true;
		BufferRegistry.addOperationRequest(iSAudioBuffer);
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
			// TODO: investigate the fact that buffer.getChannelData() returns a reference,
			//  so you don't have to update currentBuffer when you aren't suspending
			requestData.currentBufferArray = BufferRegistry.getCurrentSuspendedOperationsArray(requestData.bufferUuid);
		}

		return requestData;
	},

	_handleBufferFunctionType(bufferOperationRequestData)
	{
		// TODO: another reason why each "args" should be its own data type
		let otherBuffer = bufferOperationRequestData.functionData.functionArgs[0];

		let functionBuffer = otherBuffer.isISBuffer ? otherBuffer.buffer : otherBuffer;
		let functionArray = new Float32Array(functionBuffer.length);
		functionBuffer.copyFromChannel(functionArray, 0);

		bufferOperationRequestData.functionData = new IS_BufferFunctionData
		(
			IS_BufferFunctionType.Buffer, functionArray
		);

		return bufferOperationRequestData;
	},

	_handleSuspendedOperationsFunctionType(bufferOperationRequestData)
	{
		let currentSuspendedOperationsArray = BufferRegistry.getCurrentSuspendedOperationsArray
		(
			bufferOperationRequestData.bufferUuid
		);

		bufferOperationRequestData.functionData = new IS_BufferFunctionData
		(
			IS_BufferFunctionType.SuspendedOperations, currentSuspendedOperationsArray
		);

		return bufferOperationRequestData;
	},

	CompleteOperation(completedOperationData)
	{
		let bufferUuid = completedOperationData.bufferUuid;

		BufferRegistry.completeOperationRequest(completedOperationData);

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
			this._queueLength = this._operationRequestQueue.length;
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