import wasmInit,
{
	is_wasm_buffer_operation
} from "../../../../../pkg/wasm_sibling.js";

const rustWasm = await wasmInit("../../../../../pkg/wasm_sibling_bg.wasm");

function INITIALIZE_MESSAGE_LISTENER()
{
	addEventListener
	(
		"message",
		(operationWASMRequestMessage) =>
		{
			MESSAGE_LISTENER_CALLBACK(operationWASMRequestMessage);
		}
	);
}

INITIALIZE_MESSAGE_LISTENER();

function MESSAGE_LISTENER_CALLBACK(operationWASMRequestMessage)
{
	if (operationWASMRequestMessage.data.request === "operate")
	{
		WORKER(operationWASMRequestMessage.data.operationRequests);
	}
}

function WORKER(operationWASMRequestMessage)
{
	let completedOperationData = DO_WORK(operationWASMRequestMessage);
	postMessage( { operationData: completedOperationData } );
}

// TODO: Make this less terrible (but good job getting a proof of concept)
function DO_WORK(operationWASMRequestMessage)
{
	// TODO: Figure out a way to send all this as a single data type that WASM can just
	//  swallow wholesale and spit back a completed array
	let bufferLengthInSamples = operationWASMRequestMessage.bufferLength;
	let functionTypes = "";
	let operatorTypes = "";
	let argumentArray = [];
	let argumentSliceData = [];
	let argumentOffset = 0;

	let operationRequests = operationWASMRequestMessage.operationRequests;

	for(let operationIndex = 0; operationIndex < operationRequests.length; operationIndex++)
	{
		let operation = operationRequests[operationIndex];
		functionTypes += operation.functionData.functionType.toLowerCase() + "\n";
		operatorTypes += operation.operatorType.toLowerCase() + "\n" ;

		let functionArgs = operation.functionData.functionArgs;

		argumentArray.push(...functionArgs);
		argumentSliceData.push(argumentOffset, functionArgs.length);
		argumentOffset += functionArgs.length;
	}

	let argumentArrayAsFloatArray = new Float32Array(argumentArray);
	let argumentSliceDataAsUIntArray = new Uint32Array(argumentSliceData);

	operationWASMRequestMessage.completedOperationArray = is_wasm_buffer_operation
	(
		bufferLengthInSamples,
		functionTypes, operatorTypes,
		argumentArrayAsFloatArray, argumentSliceDataAsUIntArray
	);

	return operationWASMRequestMessage;
}