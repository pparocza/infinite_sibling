import { IS_BufferOperatorType } from "../IS_BufferOperatorType.js";
import { IS_EvaluateBufferFunction } from "./IS_EvaluateBufferFunction.js";

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
	let operationArray = new Float32Array(currentBufferArray.length);

	let nSamples = operationArray.length;

	let operatorType = operationData.operatorType;
	let functionData = operationData.functionData;
	let functionArgs = functionData.functionArgs;
	let functionType = functionData.functionType;

	let sampleIncrement = 1 / nSamples;
	let currentIncrement = 0;

	for(let sampleIndex = 0; sampleIndex < nSamples; sampleIndex++)
	{
		let currentValue = currentBufferArray[sampleIndex];
		let functionValue = IS_EvaluateBufferFunction.evaluate
		(
			functionType, functionArgs, currentIncrement, sampleIndex
		);

		operationArray[sampleIndex] = _evaluateOperation
		(
			operatorType, functionValue, currentValue
		);

		currentIncrement += sampleIncrement;
	}

	operationData.completedOperationArray = operationArray;

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