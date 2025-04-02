export class IS_NetworkConnectionMatrixRow
{
	constructor(number)
	{
		this._number = number;
		this._networkMatrixNodeData = [];
	}

	get length() { return this._networkMatrixNodeData.length; }

	set number(value) { this._number = value; }
	get number() { return this._number; }

	getNodePosition(networkConnectionMatrixNodeData)
	{
		return this._networkMatrixNodeData.indexOf(networkConnectionMatrixNodeData);
	}

	addNetworkMatrixNodeData(networkMatrixNodeData)
	{
		this._networkMatrixNodeData.push(networkMatrixNodeData);
		networkMatrixNodeData.row = this;
	}

	removeNetworkMatrixNodeData(networkMatrixNodeData)
	{
		this._networkMatrixNodeData.splice(networkMatrixNodeData.rowPosition, 1);
		networkMatrixNodeData.row = null;
	}

	concat(networkConnectionMatrixRow)
	{
		let networkMatrixRowData = networkConnectionMatrixRow._networkMatrixNodeData;

		for(let nodeIndex = 0; nodeIndex < networkMatrixRowData.length; nodeIndex++)
		{
			let nodeData = networkMatrixRowData[nodeIndex];
			nodeData.row = this;
		}

		this._networkMatrixNodeData = this._networkMatrixNodeData.concat
		(
			networkMatrixRowData
		);
	}
}