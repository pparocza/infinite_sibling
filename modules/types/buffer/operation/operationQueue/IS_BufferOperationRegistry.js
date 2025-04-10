import { IS_BufferOperationRegistryData } from "./IS_BufferOperationRegistryData.js";

const BufferRegistryData = IS_BufferOperationRegistryData;

export const IS_BufferOperationRegistry =
{
	_registry: {},
	get registry() { return this._registry; },

	get isEmpty() { return Object.keys(this._registry).length === 0; },

	addOperationRequest(iSAudioBuffer, bufferOperationRequestData)
	{
		this._addOperationRequestToRegistry(iSAudioBuffer, bufferOperationRequestData);
	},

	fulfillOperationRequest(completedOperationData)
	{
		let bufferUuid = completedOperationData.bufferUUID;
		let completedOperationArray = completedOperationData.completedOperationArray;

		let registryData = this._registry[bufferUuid];
		registryData.completeOperation(completedOperationArray);

		this._removeFinishedBuffersFromRegistry(bufferUuid);
	},

	getCurrentSuspendedOperationsArray(bufferUuid)
	{
		let bufferData = this._registry[bufferUuid];
		return bufferData.buffer._suspendedOperationsArray;
	},

	_registerBuffer(iSAudioBuffer)
	{
		this._registry[iSAudioBuffer.uuid] = new BufferRegistryData(iSAudioBuffer);
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

	_removeFinishedBuffersFromRegistry(uuid)
	{
		delete this._registry[uuid];
	},
}