const IS_TWO_PI = Math.PI * 2;
import { IS_BufferOperatorType } from "./IS_BufferOperatorType.js";
import { IS_BufferFunctionType } from "./function/IS_BufferFunctionType.js";

function initializeListener()
{
	console.log("Listener Initialized!");
	addEventListener("message", (message) => { listenerCallback(message); });
}

initializeListener();

function listenerCallback(message)
{
	console.log("Worker Context heard: " + message + " with request: " + message.data.request);
	if (message.data.request === "operate")
	{
		worker(message.data.operationData);
	}
}

function worker(operationData)
{
	console.log("Worker has received: ", operationData);

	let buffer = doWork(operationData);

	// TODO: this should be a data type
	postMessage( { buffer: buffer } );
}

// TODO: should the operation manager just pass a buffer? (probably not if you want to have multiple parallel workers)
let BUFFER_ARRAY;

function doWork(operationData)
{
	let sampleRate = operationData._sampleRate;

	BUFFER_ARRAY = new Float32Array(sampleRate);

	console.log("Worker is " + operationData._operatorType + "-ing a " + operationData._functionData._type);

	let operatorData = operationData._functionData;
	let functionData = operationData._functionData;

	let sampleIncrement = 1 / sampleRate;
	let currentIncrement = 0;

	console.log(functionData._type, functionData._args);

	for(let sampleIndex = 0; sampleIndex < sampleRate; sampleIndex++)
	{
		BUFFER_ARRAY[sampleIndex] = _evaluateFunction(currentIncrement, functionData);
		currentIncrement += sampleIncrement;
	}

	return BUFFER_ARRAY;
}

function _evaluateOperation(iSOperatorType, functionValue, currentSampleValue)
{
	switch(iSOperatorType)
	{
		case(IS_BufferOperatorType.Add):
			return functionValue + currentSampleValue;
		case(IS_BufferOperatorType.Multiply):
			return functionValue * currentSampleValue;
		default:
			break;
	}
}

function _evaluateFunction(currentIncrement, functionData)
{
	let type = functionData._type;
	let args = functionData._args;

	switch (type)
	{
		case (IS_BufferFunctionType.Sine):
			return IS_EvaluateBufferFunction.Sine(currentIncrement, args[0]);
		case (IS_BufferFunctionType.FrequencyModulatedSine):
			return IS_EvaluateBufferFunction.FrequencyModulatedSine(currentIncrement, args[0], args[1], args[2]);
		case (IS_BufferFunctionType.Constant):
			return args[0];
		default:
			break;
	}
}

const IS_EvaluateBufferFunction =
{
	Sine(time, frequency)
	{
		return Math.sin(time * frequency * IS_TWO_PI);
	},

	FrequencyModulatedSine(time, carrierFrequency, modulatorFrequency, modulatorGain)
	{
		let modulatedFrequencyValue = carrierFrequency + (modulatorGain * Math.sin(modulatorFrequency * time * IS_TWO_PI));
		return Math.sin(modulatedFrequencyValue * IS_TWO_PI * time);
	}
}