/**
 * Configure IS_BufferOperationRegistryData to be sent to WASM worker (hence
 * no getters/setters, or AudioBuffer)
 */
export class IS_BufferOperationWASMRequest
{
	constructor(operationRequests, bufferLength, bufferUUID)
	{
		this.operationRequests = operationRequests;
		this.bufferLength = bufferLength;
		this.bufferUUID = bufferUUID;
		this.completedOperationArray = null;
	}
}