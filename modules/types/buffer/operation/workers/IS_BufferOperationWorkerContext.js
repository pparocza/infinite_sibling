import { IS_BufferOperatorType } from "../IS_BufferOperatorType.js";

import wasmInit,
{
	is_wasm_buffer_operation
} from "../../../../../pkg/wasm_sibling.js";

const rustWasm = await wasmInit("../../../../../pkg/wasm_sibling_bg.wasm");

function INITIALIZE_LISTENER()
{
	addEventListener("message", (message) => { LISTENER_CALLBACK(message); });
}

INITIALIZE_LISTENER();

function LISTENER_CALLBACK(message)
{
	if (message.data.request === "operate")
	{
		WORKER(message.data.operationData);
	}
}

function WORKER(incomingOperationData)
{
	let completedOperationData = DO_WORK(incomingOperationData);

	// TODO: this should be a data type
	postMessage( { operationData: completedOperationData } );
}

function DO_WORK(operationData)
{
	let currentBufferArray = operationData.currentBufferArray;
	let nSamples = currentBufferArray.length;

	let functionData = operationData.functionData;

	let operatorType = operationData.operatorType.toLowerCase();

	let functionArgs = functionData.functionArgs;
	let functionType = functionData.functionType.toLowerCase();

	operationData.completedOperationArray = is_wasm_buffer_operation
	(
		nSamples, functionType, operatorType, functionArgs
	);

	return operationData;
}