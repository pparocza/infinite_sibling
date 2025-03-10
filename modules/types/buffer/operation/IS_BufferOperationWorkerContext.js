import { IS_BufferOperatorType } from "./IS_BufferOperatorType.js";
import { IS_EvaluateBufferFunction } from "./function/IS_EvaluateBufferFunction.js";

function INITIALIZE_LISTENER()
{
	// console.log("Listener Initialized!");
	addEventListener("message", (message) => { LISTENER_CALLBACK(message); });
}

INITIALIZE_LISTENER();

function LISTENER_CALLBACK(message)
{
	// console.log("Worker Context heard: " + message + " with request: " + message.data.request);
	if (message.data.request === "operate")
	{
		WORKER(message.data.operationData);
	}
}

function WORKER(operationData)
{
	// console.log("Worker has received: ", operationData);

	let buffer = DO_WORK(operationData);

	// TODO: this should be a data type
	postMessage( { buffer: buffer } );
}

// TODO: should the operation manager just pass a buffer? (probably not if you want to have multiple parallel workers)
let BUFFER_ARRAY;

function DO_WORK(operationData)
{
	let sampleRate = operationData._sampleRate;

	BUFFER_ARRAY = new Float32Array(sampleRate);

	// console.log("Worker is " + operationData._operatorType + "-ing a " + operationData._functionData._type);

	let operatorType = operationData._operatorType;
	let functionData = operationData._functionData;

	let sampleIncrement = 1 / sampleRate;
	let currentIncrement = 0;

	for(let sampleIndex = 0; sampleIndex < sampleRate; sampleIndex++)
	{
		BUFFER_ARRAY[sampleIndex] = _evaluateOperation
		(
			operatorType,
			IS_EvaluateBufferFunction.evaluate(currentIncrement, functionData),
			0
		);

		currentIncrement += sampleIncrement;
	}

	return BUFFER_ARRAY;
}

function _evaluateOperation(iSOperatorType, functionValue, currentSampleValue)
{
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