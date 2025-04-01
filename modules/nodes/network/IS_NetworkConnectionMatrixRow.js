export class IS_NetworkConnectionMatrixRow
{
	constructor(networkMatrixNodeData)
	{
		this._networkMatrixNodeData = [networkMatrixNodeData];
	}

	get length() { return this._networkMatrixNodeData.length; }

	addNetworkMatrixNodeData(networkMatrixNodeData)
	{
		this._networkMatrixNodeData.push(networkMatrixNodeData);
	}
}