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

function WORKER(incomingOperationRequest)
{
	let completedOperationData = DO_WORK(incomingOperationRequest);
	postMessage( { operationData: completedOperationData } );
}

// TODO: Make this less terrible (but good job getting a proof of concept)
function DO_WORK(operationRequestData)
{
	let bufferLengthInSamples = operationRequestData.bufferLength;
	let functionTypes = "";
	let operatorTypes = "";
	let argumentArray = [];
	let argumentSliceData = [];
	let argumentOffset = 0;

	let operationData = operationRequestData.operationData;

	for(let operationIndex = 0; operationIndex < operationData.length; operationIndex++)
	{
		let operation = operationData[operationIndex];
		functionTypes += operation.functionData.functionType.toLowerCase() + "\n";
		operatorTypes += operation.operatorType.toLowerCase() + "\n" ;

		let functionArgs = operation.functionData.functionArgs;

		argumentArray.push(...functionArgs);
		argumentSliceData.push(argumentOffset, functionArgs.length);
		argumentOffset += functionArgs.length;
	}

	let argumentArrayAsFloatArray = new Float32Array(argumentArray);
	let argumentSliceDataAsUIntArray = new Uint32Array(argumentSliceData);

	operationRequestData.completedOperationArray = is_wasm_buffer_operation
	(
		bufferLengthInSamples, functionTypes, operatorTypes, argumentArrayAsFloatArray, argumentSliceDataAsUIntArray
	);

	return operationRequestData;
}