import { IS_BufferOperator } from "../types/buffer/operation/operationQueue/IS_BufferOperator.js";

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
				set Progress(listener) { IS_BufferOperator.progressListener = listener; }
			}
	},
}