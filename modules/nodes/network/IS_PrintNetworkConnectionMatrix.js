export const IS_PrintNetworkConnectionMatrix =
{
	_currentMatrix: null,
	_lowestRowNumber: null,
	_highestRowNumber: null,
	_rows: null,
	_networkMatrixNodeData: null,

	PrintMatrix(isNetworkConnectionMatrix)
	{
		this._currentMatrix = isNetworkConnectionMatrix;

		this._lowestRowNumber = isNetworkConnectionMatrix._lowestRowNumber;
		this._highestRowNumber = isNetworkConnectionMatrix._highestRowNumber;
		this._rows = isNetworkConnectionMatrix._rows;
		this._networkMatrixNodeData = isNetworkConnectionMatrix._networkMatrixNodeData;

		this._printRows();
	},

	_printRows()
	{
		for(let rowIndex = this._lowestRowNumber; rowIndex < this._highestRowNumber + 1; rowIndex++)
		{
			let printRowOffset = -this._lowestRowNumber;
			console.log("ROW:", rowIndex + printRowOffset);
			let row = this._rows[rowIndex];
			this._printRow(printRowOffset, rowIndex, row);
		}
	},

	_printRow(printRowOffset, rowIndex, row)
	{
		for (let rowPosition = 0; rowPosition < row.length; rowPosition++)
		{
			let nodeData = row._networkMatrixNodeData[rowPosition];

			this._printCurrentNode(printRowOffset, nodeData);
			this._printFromNodes(printRowOffset, nodeData);
			this._printToNodes(rowIndex, printRowOffset, nodeData);
		}
	},

	_printCurrentNode(printRowOffset, nodeData)
	{
		console.log
		(
			"===",
			nodeData.audioNodeRegistryData.iSType, "At:", nodeData.rowNumber + printRowOffset, nodeData.rowPosition
		);
	},

	_printFromNodes(printRowOffset, nodeData)
	{
		let fromNodes = nodeData._connectedNodes.from;

		for(let connectionIndex = 0; connectionIndex < fromNodes.length; connectionIndex++)
		{
			let connection = fromNodes[connectionIndex];
			console.log
			(
				"=== === RECEIVING FROM:",
				connection.audioNodeRegistryData.iSType,
				"At:", connection.rowNumber + printRowOffset, connection.rowPosition
			)
		}
	},

	_printToNodes(rowIndex, printRowOffset, nodeData)
	{
		let toNodes = nodeData._connectedNodes.to;

		for(let connectionIndex = 0; connectionIndex < toNodes.length; connectionIndex++)
		{
			let connection = toNodes[connectionIndex];

			let feedbackMessage = this._feedBackMessage(rowIndex, nodeData, connection);

			if(feedbackMessage === null)
			{
				console.log
				(
					"=== === SENDING TO:",
					connection.audioNodeRegistryData.iSType,
					"At:", connection.rowNumber + printRowOffset, connection.rowPosition
				)
			}
			else
			{
				console.log
				(
					"=== === SENDING TO:",
					connection.audioNodeRegistryData.iSType,
					"At:", connection.rowNumber + printRowOffset, connection.rowPosition,
					feedbackMessage
				)
			}
		}
	},

	// TODO: More thorough feedback check
	_feedBackMessage(rowIndex, nodeData, connection)
	{
		let message = null;

		if
		(
			rowIndex > connection.rowNumber // this row is connected to a higher (lower index) row
			&&
			connection.connectedNodes.to.indexOf(nodeData) !== -1 // the connection is sending to this node
		)
		{
			message =
				"[FEEDBACK: "
				+ [rowIndex, nodeData.rowPosition].toString()
				+ " -> "
				+ [connection.rowNumber, connection.rowPosition].toString()
				+ "]";
		}

		return message;
	}
}