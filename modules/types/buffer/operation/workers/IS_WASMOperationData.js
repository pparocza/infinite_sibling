export class IS_WASMOperationData
{
    constructor(iSBufferOperationData)
    {
        let functionData = iSBufferOperationData.functionData;
        this._functionType = functionData.functionType.toLowerCase();
        this._functionArgs = functionData.functionArgs;

        this._operatorType = iSBufferOperationData.operatorType.toLowerCase();

        this._isSuspendedOperation = iSBufferOperationData.isSuspendedOperation;
    }

    get operatorType() { return this._operatorType; }
    get functionType() { return this._functionType; }
    get functionArgs() { return this._functionArgs; }
    get isSuspendedOperation() { return this._isSuspendedOperation; }
}