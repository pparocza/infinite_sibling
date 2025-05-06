import { IS_BufferOperationWorkerBridge } from "../workers/IS_BufferOperationWorkerBridge.js";
import { IS_BufferOperationRegistry } from "./IS_BufferOperationRegistry.js";

export const IS_BufferOperator =
{
	_progress: 0,
	_progressIncrement: 0,
	_registryLength: 0,
	_progressListeners: [],

	_waiters : [],

	get Progress() { return this._progress; },
	get OperationsPending() { return IS_BufferOperationRegistry.length > 0; },

	Operate()
	{
		let operationRegistry = IS_BufferOperationRegistry.registry;

		this._updateProgress();

		for(const [bufferUUID, registryData] of Object.entries(operationRegistry))
		{
			if(registryData.awaitingBuffer)
			{
				this.registryDataAwaitingBuffers(registryData);
				continue;
			}

			IS_BufferOperationWorkerBridge.requestOperation(registryData);
		}
	},

	registryDataAwaitingBuffers(registryData)
	{
		registryData.operateWhenReady(this._registryDataReady);
	},

	_registryDataReady(registryData)
	{
		IS_BufferOperationWorkerBridge.requestOperation(registryData);
	},

	requestOperation(iSAudioBuffer, bufferOperationData)
	{
		IS_BufferOperationRegistry.addOperationRequest(iSAudioBuffer, bufferOperationData);
	},

	ReceiveCompletedOperation(completedOperationData)
	{
		IS_BufferOperationRegistry.fulfillOperationRequest(completedOperationData);

		this._updateProgress();

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

	// TODO: resolve this with new structure
	_updateProgress()
	{
		if(this._registryLength === 0)
		{
			let currentOperationRequestQueueLength = IS_BufferOperationRegistry.length - 1;
			this._registryLength = Math.max(1, currentOperationRequestQueueLength);
		}

		this._progress = this._progressIncrement++ / this._registryLength;

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