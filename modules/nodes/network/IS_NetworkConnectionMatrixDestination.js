export class IS_NetworkConnectionMatrixDestination
{
	constructor(networkMatrixNodeData)
	{
		this._rowNumber = networkMatrixNodeData.rowNumber;
		this._rowPosition = networkMatrixNodeData.rowPosition;
	}

	get rowNumber() { return this._rowNumber; }
	get rowPosition() { return this._rowPosition; }
}