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
		if(!this._awaiting[iSBuffer.uuid])
		{
			this._awaiting[iSBuffer.uuid] = [];
		}

		this._awaiting[iSBuffer.uuid].push(bufferOperationData);
	}

	completeOperation(completedOperationData)
	{
		this._buffer.completedOperationDataToBuffer(completedOperationData);
	}

	addOperationData(bufferOperationData)
	{
		let functionData = bufferOperationData.functionData;

		switch(functionData.functionType)
		{
			case IS_BufferFunctionType.Buffer:
			case IS_BufferFunctionType.Splice:
				// TODO: magic number [0] here and below not great
				let iSBuffer = functionData.functionArgs[0];
				iSBuffer.requestBuffer(this);
				this.awaitBuffer(iSBuffer, bufferOperationData);
				break;
			default:
				break;
		}

		this._operationRequests.push(bufferOperationData);
	}

	getAwaitedBuffer(iSAudioBuffer)
	{
		let bufferUUID = iSAudioBuffer.uuid;
		let bufferArray = new Float32Array(iSAudioBuffer.length);


		// TODO: This needs to go back to each channel
		iSAudioBuffer.buffer.copyFromChannel(bufferArray, 0);

		let awaiting = this._awaiting[bufferUUID];

		if(awaiting)
		{
			for(let awaitingIndex = 0; awaitingIndex < awaiting.length; awaitingIndex++)
			{
				let functionData = awaiting[awaitingIndex].functionData;
				functionData.functionArgs[0] = bufferArray;
				functionData.otherBuffer = bufferArray;
			}
		}

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