export class IS_BufferFunctionData
{
	constructor(iSBufferFunctionType, ...functionArgs) {
		this.functionType = iSBufferFunctionType;
		this.functionArgs = functionArgs;
		// TODO: this is very janky, and needs to be revised
		this.otherBuffer = new Float32Array(1);
	}
}