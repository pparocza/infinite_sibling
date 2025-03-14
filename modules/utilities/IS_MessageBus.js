import { IS_BufferOperationQueue } from "../types/buffer/operation/operationQueue/IS_BufferOperationQueue.js";

export const IS_MessageBus =
{
	addListener()
	{

	},

	addBufferQueueProgressListener(listener)
	{
		IS_BufferOperationQueue.addProgressListener(listener);
	}
}