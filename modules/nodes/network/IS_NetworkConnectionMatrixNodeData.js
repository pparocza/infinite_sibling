export class IS_NetworkConnectionMatrixNodeData
{
	constructor(networkID, networkNode)
	{
		networkNode.networkID = networkID;

		// TODO: mmmmmeeeeeeeehhhhhhhhhh
		this._networkNode = networkNode;

		this._audioNodeType = networkNode.audioNodeType;

		this._row = null;

		this._connectedNodes =
		{
			from: [],
			to: []
		};
	}

	get networkNode() { return this._networkNode; }
	get networkNodeID() { return this._networkNode.id; }
	get audioNodeType() { return this._audioNodeType; }

	get row() { return this._row; }
	set row(networkConnectionMatrixRow) { this._row = networkConnectionMatrixRow; }

	get rowNumber() { return this._row.number; }
	get rowPosition() { return this._row.getNodePosition(this); }

	get connectedNodes() { return this._connectedNodes }

	// TODO: "add" helpers below maybe eliminate the need for this?
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

	get nFromNodes() { return this._connectedNodes.from.length; }
	get nToNodes() { return this._connectedNodes.to.length; }

	get fromNodes() { return this._connectedNodes.from; }
	get toNodes() { return this._connectedNodes.to; }

	addFromNode(networkConnectionMatrixNodeData)
	{
		this._connectedNodes.from.push(networkConnectionMatrixNodeData)
	}

	addToNode(networkConnectionMatrixNodeData)
	{
		this._connectedNodes.to.push(networkConnectionMatrixNodeData)
	}
}