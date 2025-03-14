import { IS_BufferOperationQueue } from "../types/buffer/operation/operationQueue/IS_BufferOperationQueue.js";

export const IS_MessageBus =
{
	get addListener()
	{
		return this.Broadcasters;
	},

	Broadcasters:
	{
		BufferOperationQueue:
			{
				set Progress(listener) { IS_BufferOperationQueue.progressListener = listener; }
			}
	},
}