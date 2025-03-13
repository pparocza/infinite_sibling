import { IS_BufferOperationWorkerBridge } from "./IS_BufferOperationWorkerBridge.js";
import { IS_BufferFunctionType } from "./function/IS_BufferFunctionType.js";
import { IS_BufferFunctionData } from "./function/IS_BufferFunctionData.js";

export const IS_BufferOperationQueue =
{
	_operationRequestQueue: [],
	_bufferRegistry: {},
	_isOperating: false,
	_waitingContext: null,

	requestOperation(iSAudioBuffer, bufferOperationRequestData)
	{
		this._isOperating = true;
		this._addOperationRequestToRegistry(iSAudioBuffer);
		this._enqueueBufferOperation(bufferOperationRequestData);
	},

	_registerBuffer(iSAudioBuffer)
	{
		this._bufferRegistry[iSAudioBuffer.uuid] = new BufferRegistryData(iSAudioBuffer);
	},

	_addOperationRequestToRegistry(iSAudioBuffer)
	{
		let uuid = iSAudioBuffer.uuid;

		if(!this._bufferRegistry[uuid])
		{
			this._registerBuffer(iSAudioBuffer);
		}

		let registryData = this._bufferRegistry[uuid];
		registryData.addOperationRequest();
	},

	_removeFinishedBuffersFromRegistry(uuid)
	{
		let registryData = this._bufferRegistry[uuid];

		if(registryData.isDone)
		{
			delete this._bufferRegistry[uuid];
		}
	},

	_enqueueBufferOperation(bufferOperationRequestData)
	{
		this._operationRequestQueue.push(bufferOperationRequestData);

		if(this._operationRequestQueue.length === 1)
		{
			this._nextOperation();
		}
	},

	_nextOperation()
	{
		let currentRequest = this._operationRequestQueue[0];
		let requestData = this._ensureCurrentData(currentRequest);

		IS_BufferOperationWorkerBridge.requestOperation(requestData);
	},

	_ensureCurrentData(requestData)
	{
		let functionType = requestData._functionData._type;

		switch(functionType)
		{
			case(IS_BufferFunctionType.Buffer):
				requestData = this._handleBufferFunctionType(requestData);
				break;
			case(IS_BufferFunctionType.SuspendedOperations):
				requestData = this._handleSuspendedOperationsFunctionType(requestData);
				break;
		}

		if (requestData._isSuspendedOperation)
		{
			// TODO: investigate the fact that buffer.getChannelData() returns a reference,
			//  so you don't have to update currentBuffer when you aren't suspending
			requestData.currentBufferArray = this._getCurrentSuspendedOperationsArray(requestData.bufferUuid);
		}

		return requestData;
	},

	_handleBufferFunctionType(bufferOperationRequestData)
	{
		// TODO: another reason why each "args" should be its own data type
		let otherBuffer = bufferOperationRequestData.functionData.args[0];

		let functionBuffer = otherBuffer.isBuffer ? otherBuffer.buffer : otherBuffer;
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
		let currentSuspendedOperationsArray = this._getCurrentSuspendedOperationsArray
		(
			bufferOperationRequestData.bufferUuid
		);

		bufferOperationRequestData.functionData = new IS_BufferFunctionData
		(
			IS_BufferFunctionType.SuspendedOperations, currentSuspendedOperationsArray
		);

		return bufferOperationRequestData;
	},

	_getCurrentSuspendedOperationsArray(bufferUuid)
	{
		let bufferData = this._bufferRegistry[bufferUuid];
		return bufferData.buffer._suspendedOperationsArray;
	},

	CompleteOperation(completedOperationData)
	{
		let bufferUuid = completedOperationData._bufferUuid;
		let registryData = this._bufferRegistry[bufferUuid];

		registryData.completeOperation(completedOperationData);

		this._handleOperationComplete(bufferUuid);
	},

	_handleOperationComplete(uuid)
	{
		this._removeFinishedBuffersFromRegistry(uuid);

		this._operationRequestQueue.shift();

		if(this._operationRequestQueue.length > 0)
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

class BufferRegistryData
{
	constructor(buffer)
	{
		this._buffer = buffer;
		this._operationRequestCount = 0;
		this._isDone = null;
	}

	get buffer() { return this._buffer; }
	get isDone() { return this._isDone; }

	completeOperation(completedOperationData)
	{
		this._buffer.completeOperation(completedOperationData);
		this.removeOperationRequest();
	}

	addOperationRequest()
	{
		this._operationRequestCount++;
		this._isDone = false;
	}

	removeOperationRequest()
	{
		this._operationRequestCount--;
		this._isDone = this._operationRequestCount === 0;

		if(this._isDone)
		{
			this._buffer.operationsComplete();
		}
	}
}