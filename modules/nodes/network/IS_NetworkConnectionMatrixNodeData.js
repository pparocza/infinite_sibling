export class IS_NetworkConnectionMatrixNodeData
{
	constructor(networkNode)
	{
		this._networkNodeID = networkNode.id;
		this._audioNodeType = networkNode.audioNodeType;

		this._row = null;

		this._connectedNodes =
		{
			from: [],
			to: []
		};
	}

	get id() { return this._networkNodeID; }
	get audioNodeType() { return this._audioNodeType; }

	set row(networkConnectionMatrixRow) { this._row = networkConnectionMatrixRow; }

	get rowNumber() { return this._row.number; }
	get rowPosition() { return this._row.getNodePosition(this); }

	get connectedNodes() { return this._connectedNodes }
	addConnectedNode(networkConnectionMatrixNodeData, isReceiving)
	{
		if(isReceiving)
		{
			this._connectedNodes.from.push(networkConnectionMatrixNodeData);
		}
		else
		{
			this._connectedNodes.to.push(networkConnectionMatrixNodeData);
		}
	}
}