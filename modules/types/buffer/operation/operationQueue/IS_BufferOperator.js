import { IS_BufferOperationWorkerBridge } from "../workers/IS_BufferOperationWorkerBridge.js";
import { IS_BufferFunctionType } from "../function/IS_BufferFunctionType.js";
import { IS_BufferFunctionData } from "../function/IS_BufferFunctionData.js";
import { IS_BufferOperationRegistry } from "./IS_BufferOperationRegistry.js";


export const IS_BufferOperator =
{
	_progress: 0,
	_progressIncrement: 0,
	_queueLength: 0,
	_progressListeners: [],

	_waiters : [],

	get Progress() { return this._progress; },

	Operate()
	{
		let operationRegistry = IS_BufferOperationRegistry.registry;

		for(const [bufferUUID, registryData] of Object.entries(operationRegistry))
		{
			IS_BufferOperationWorkerBridge.requestOperation(registryData);
		}
	},

	requestOperation(iSAudioBuffer, bufferOperationData)
	{
		IS_BufferOperationRegistry.addOperationRequest
		(
			iSAudioBuffer, bufferOperationData
		);
	},

	_ensureCurrentData(operationData)
	{
		let functionType = operationData.functionData.functionType;

		switch(functionType)
		{
			case(IS_BufferFunctionType.Buffer):
				operationData = this._handleBufferFunctionType(operationData);
				break;
			case(IS_BufferFunctionType.SuspendedOperations):
				operationData = this._handleSuspendedOperationsFunctionType(operationData);
				break;
		}

		if (operationData.isSuspendedOperation)
		{
			operationData.currentBufferArray =
				IS_BufferOperationRegistry
					.getCurrentSuspendedOperationsArray(operationData.bufferUuid);
		}

		return operationData;
	},

	_handleBufferFunctionType(bufferOperationData)
	{
		let otherBuffer = bufferOperationData.functionData.functionArgs[0];

		let functionBuffer = otherBuffer.isISBuffer ? otherBuffer.buffer : otherBuffer;
		let functionArray = new Float32Array(functionBuffer.length);
		functionBuffer.copyFromChannel(functionArray, 0);

		bufferOperationData.functionData = new IS_BufferFunctionData
		(
			IS_BufferFunctionType.Buffer, null
		);

		/*
		 Right now, WASM needs to receive this array DIRECTLY, not this array as the first
		 member of an ...args array
		 */
		bufferOperationData.functionData.functionArgs = functionArray;

		return bufferOperationData;
	},

	_handleSuspendedOperationsFunctionType(bufferOperationData)
	{
		let currentSuspendedOperationsArray = IS_BufferOperationRegistry
		.getCurrentSuspendedOperationsArray
		(
			bufferOperationData.bufferUuid
		);

		bufferOperationData.functionData = new IS_BufferFunctionData
		(
			IS_BufferFunctionType.SuspendedOperations, null
		);

		/*
		 Right now, WASM needs to receive this array DIRECTLY, not this array as the first
		 member of an ...args array
		 */
		bufferOperationData.functionData.functionArgs = currentSuspendedOperationsArray;

		return bufferOperationData;
	},

	CompleteOperation(completedOperationData)
	{
		IS_BufferOperationRegistry.fulfillOperationRequest(completedOperationData);

		if(IS_BufferOperationRegistry.isEmpty)
		{
			this._handleQueueComplete();
		}
	},

	_handleQueueComplete()
	{
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