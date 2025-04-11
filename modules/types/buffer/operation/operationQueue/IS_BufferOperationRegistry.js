import { IS_BufferOperationRegistryData } from "./IS_BufferOperationRegistryData.js";

export const IS_BufferOperationRegistry =
{
	_registry: {},
	get registry() { return this._registry; },

	get length() { return Object.keys(this._registry).length; },
	get isEmpty() { return this.length === 0; },

	addOperationRequest(iSAudioBuffer, bufferOperationData)
	{
		this._addOperationRequestToRegistry(iSAudioBuffer, bufferOperationData);
	},

	_addOperationRequestToRegistry(iSAudioBuffer, bufferOperationData)
	{
		let bufferUUID = iSAudioBuffer.uuid;

		if(!this._registry[bufferUUID])
		{
			this._registerBuffer(iSAudioBuffer);
		}

		let registryData = this._registry[bufferUUID];
		registryData.addOperationData(bufferOperationData);
	},

	_registerBuffer(iSAudioBuffer)
	{
		this._registry[iSAudioBuffer.uuid] = new IS_BufferOperationRegistryData(iSAudioBuffer);
	},

	/**
	 * Return array from WASM to IS_Buffer
	 * @param completedOperationData
	 */
	fulfillOperationRequest(completedOperationData)
	{
		let bufferUuid = completedOperationData.bufferUUID;

		let registryData = this._registry[bufferUuid];
		registryData.completeOperation(completedOperationData);

		this._removeCompletedOperations(bufferUuid);
	},

	_removeCompletedOperations(uuid)
	{
		delete this._registry[uuid];
	}
}