import { IS_BufferOperationQueueBufferRegistryData } from "./IS_BufferOperationQueueBufferRegistryData.js";

const BufferRegistryData = IS_BufferOperationQueueBufferRegistryData;

export const IS_BufferOperationQueueBufferRegistry =
{
	_bufferRegistry: {},
	get bufferRegistry() { return this._bufferRegistry; },

	addOperationRequest(iSAudioBuffer)
	{
		this._addOperationRequestToRegistry(iSAudioBuffer);
	},

	completeOperationRequest(completedOperationData)
	{
		let bufferUuid = completedOperationData.bufferUuid;

		let registryData = this.bufferRegistry[bufferUuid];
		registryData.completeOperation(completedOperationData);

		this._removeFinishedBuffersFromRegistry(bufferUuid);
	},

	getCurrentSuspendedOperationsArray(bufferUuid)
	{
		let bufferData = this.bufferRegistry[bufferUuid];
		return bufferData.buffer._suspendedOperationsArray;
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
}