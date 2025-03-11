import { IS_BufferOperatorType } from "./IS_BufferOperatorType.js";
import { IS_EvaluateBufferFunction } from "./function/IS_EvaluateBufferFunction.js";

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
	let currentBufferArray = operationData._currentBufferArray;
	let operationArray = operationData._operationArray;

	let nSamples = operationArray.length;

	let operatorType = operationData._operatorType;
	let functionData = operationData._functionData;
	let functionArgs = functionData._args;
	let functionType = functionData._type;

	let sampleIncrement = 1 / nSamples;
	let currentIncrement = 0;

	for(let sampleIndex = 0; sampleIndex < nSamples; sampleIndex++)
	{
		let currentValue = currentBufferArray[sampleIndex];

		operationArray[sampleIndex] = _evaluateOperation
		(
			operatorType,
			IS_EvaluateBufferFunction.evaluate(currentIncrement, functionType, functionArgs),
			currentValue
		);

		currentIncrement += sampleIncrement;
	}

	return operationData;
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