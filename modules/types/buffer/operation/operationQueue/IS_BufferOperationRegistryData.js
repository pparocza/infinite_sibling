import { IS_BufferFunctionType } from "../function/IS_BufferFunctionType.js";

/**
 * Ties an IS_Buffer to requested operations in IS_BufferOperationRegistry
 */
export class IS_BufferOperationRegistryData
{
	constructor(buffer)
	{
		this._buffer = buffer;
		this._operationRequests = [];

		this._awaiting = {};
		this._operatorCallback = null;
	}

	isISBufferRegistryData = true;

	get buffer() { return this._buffer; }
	get bufferLength () { return this._buffer.length; }
	get bufferUUID() { return this._buffer.uuid; }
	get operationRequests() { return this._operationRequests; }

	get nAwaiting() { return Object.keys(this._awaiting).length; }
	get awaitingBuffer() { return this.nAwaiting > 0; }

	awaitBuffer(iSBuffer, bufferOperationData)
	{
		this._awaiting[iSBuffer.uuid] = bufferOperationData;
	}

	completeOperation(completedOperationData)
	{
		this._buffer.completeOperation(completedOperationData);
	}

	addOperationData(bufferOperationData)
	{
		let functionData = bufferOperationData.functionData;

		if(functionData.functionType === IS_BufferFunctionType.Buffer)
		{
			let iSBuffer = functionData.functionArgs[0];
			iSBuffer.requestBuffer(this);
			this.awaitBuffer(iSBuffer, bufferOperationData);
		}

		this._operationRequests.push(bufferOperationData);
	}

	getAwaitedBuffer(iSAudioBuffer)
	{
		let bufferUUID = iSAudioBuffer.uuid;
		let bufferArray = new Float32Array(iSAudioBuffer.length);
		iSAudioBuffer.buffer.copyFromChannel(bufferArray, 0);

		this._awaiting[bufferUUID].functionData.functionArgs = bufferArray;

		delete this._awaiting[bufferUUID];

		if(!this.awaitingBuffer)
		{
			this._readyToOperate();
		}
	}

	operateWhenReady(operatorCallback)
	{
		this._operatorCallback = operatorCallback;
	}

	_readyToOperate()
	{
		this._operatorCallback(this);
	}
}