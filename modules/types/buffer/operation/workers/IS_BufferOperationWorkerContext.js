import wasmInit, { is_wasm_buffer_operation } from "../../../../../pkg/wasm_sibling.js";
const rustWasm = await wasmInit("../../../../../pkg/wasm_sibling_bg.wasm");
import { IS_WASMOperationData } from "./IS_WASMOperationData.js";

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
//  https://rustwasm.github.io/wasm-bindgen/examples/import-js.html <- importing custom classes to WASM from JS
function DO_WORK(operationWASMRequestMessage)
{
	// TODO: Suspended Operations -> should be fairly manageable in WASM by creating a temporary array
	//  that gets folded back in when it processes a "Supsended Operations" function
	// TODO: Buffer function type -> this will actually have to wait until that buffer is ready,
	//  which will likely need to be handled by one IS_Buffer putting in a request to another, the former
	//  of which doesn't attempt any of it's operations until the other has been completed

	let operationRequests = operationWASMRequestMessage.operationRequests;
	let WASMOperationData = [];

	for(let operationIndex = 0; operationIndex < operationRequests.length; operationIndex++)
	{
		let operationData = operationRequests[operationIndex];
		let wasmOperationData = new IS_WASMOperationData(operationData);
		WASMOperationData.push(wasmOperationData);
	}

	operationWASMRequestMessage.completedOperationArray = is_wasm_buffer_operation
	(
		operationWASMRequestMessage.bufferLength,
		WASMOperationData
	);

	return operationWASMRequestMessage;
}