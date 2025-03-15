import { IS_BufferOperatorType } from "../IS_BufferOperatorType.js";
import { IS_EvaluateBufferFunction } from "./IS_EvaluateBufferFunction.js";
import { Utilities } from "../../../../utilities/Utilities.js";

import wasmInit,
{
	wasm_sine,
	wasm_frequency_modulation
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
	let operationArray = new Float32Array(nSamples);

	let operatorType = operationData.operatorType;
	let functionData = operationData.functionData;
	let functionArgs = functionData.functionArgs;
	let functionType = functionData.functionType;

	let sampleIncrement = 1 / nSamples;
	let currentIncrement = 0;

	/*
	 move all evaluation and operation to WASM
	 -> pass over the function data, run the loop (ultimately the queue should be handled there as well,
	 so that you're making one call to WASM, and getting one buffer back
	 */
	let arg1 = functionData.functionArgs[0];
	let arg2 = functionData.functionArgs[1];
	let arg3 = functionData.functionArgs[2];

	/*
	 Interestingly, just adding these arguments to the function call triples the execution time, so you'll probably
	 want a way to pass everything over in one big batch/initialize values
	 --> For example, WASM is only ever passing back one buffer, so you should be able to pass the length of the buffer
	 		only once
	 */
	operationData.completedOperationArray = wasm_frequency_modulation(nSamples, arg1, arg2, arg3);

	return operationData;
}

function _evaluateOperation(iSOperatorType, functionValue, currentSampleValue)
{
	if(functionValue === null)
	{
		return currentSampleValue;
	}

	switch(iSOperatorType)
	{
		case(IS_BufferOperatorType.Add):
			return currentSampleValue + functionValue;
		case(IS_BufferOperatorType.Multiply):
			return currentSampleValue * functionValue;
		case(IS_BufferOperatorType.Divide):
			return currentSampleValue / functionValue;
		case(IS_BufferOperatorType.Subtract):
			return currentSampleValue - functionValue;
		default:
			break;
	}
}