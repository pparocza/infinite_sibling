export class IS_NetworkConnectionMatrixNodeData
{
	constructor(networkNode, rowNumber)
	{
		this._networkNodeID = networkNode.id;
		this._audioNodeType = networkNode.audioNodeType;
		this._rowNumber = rowNumber;
		this._connectionDestinations = [];
		this._rowPosition = null;
	}

	get id() { return this._networkNodeID; }
	get audioNodeType() { return this._audioNodeType; }

	get rowNumber() { return this._rowNumber; }

	get rowPosition() { return this._rowPosition; }
	set rowPosition(value) { this._rowPosition = value; }

	get connectionDestinations() { return this._connectionDestinations }
	addConnectionDestination(connectionDestination) { this._connectionDestinations.push(connectionDestination) }
}