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

	_waitingContext: null,

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

		if(this._waitingContext !== null)
		{
			this._waitingContext.endWait(this);
		}
	},

	waitingContext(siblingContext)
	{
		this._waitingContext = siblingContext;
	}
}