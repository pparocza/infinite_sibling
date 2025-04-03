import { IS_NetworkConnectionMatrixRow } from "./IS_NetworkConnectionMatrixRow.js"
import { IS_NetworkConnectionMatrixNodeData } from "./IS_NetworkConnectionMatrixNodeData.js";
import { IS_PrintNetworkConnectionMatrix } from "./IS_PrintNetworkConnectionMatrix.js";

export class IS_NetworkConnectionMatrix
{
	constructor(network, networkNode)
	{
		this._network = network;

		this._highestRowNumber = 0;
		this._lowestRowNumber = 0;
		this._rows = {};
		this._emptyRowNumbers = [];

		// key: IS_NetworkNode.id, value: IS_NetworkConnectionMatrixNodeData
		this._connectionMatrixNodeData = {};

		this._createFirstConnectionMatrixNodeData(networkNode);
	}

	get network() { return this._network; }
	get networkID() { return this._network.id; }

	get nNodes() { return Object.keys(this.connectionMatrixNodeData).length; }
	get nRows() { return 1 + (this._highestRowNumber - this._lowestRowNumber); }

	get connectionMatrixNodeData() { return this._connectionMatrixNodeData; }

	_createFirstConnectionMatrixNodeData(networkNode)
	{
		let connectionMatrixNodeData =
			this._createConnectionMatrixNodeData(networkNode);

		this._addNodeToRow(connectionMatrixNodeData, 0);
	}

	_createConnectionMatrixNodeData(networkNode)
	{
		let connectionMatrixNodeData = new IS_NetworkConnectionMatrixNodeData
		(
			networkNode.audioNodeType
		);

		this.connectionMatrixNodeData[networkNode.id] = connectionMatrixNodeData;

		return connectionMatrixNodeData;
	}

	consumeConnection(consumedNode, consumingMatrixNodeData)
	{
		let consumedMatrixNodeData = this._createConnectionMatrixNodeData(consumedNode);

		let consumingRowNumber = consumingMatrixNodeData.rowNumber;
		let consumedRowNumber = consumedNode.isFrom ? consumingRowNumber - 1 : consumingRowNumber + 1;

		this._addNodeToRow(consumedMatrixNodeData, consumedRowNumber);

		if(consumedNode.isFrom)
		{
			consumedMatrixNodeData.addToNode(consumingMatrixNodeData);
			consumingMatrixNodeData.addFromNode(consumedMatrixNodeData);
		}
		else
		{
			consumedMatrixNodeData.addFromNode(consumingMatrixNodeData);
			consumingMatrixNodeData.addToNode(consumedMatrixNodeData);
		}
	}

	consumeMatrix(consumedMatrix, consumedNetworkNode, consumedNodeOriginalMatrixPosition)
	{
		this._concatenateConsumedRows(consumedMatrix, consumedNetworkNode, consumedNodeOriginalMatrixPosition);
		this._consumeConnectionMatrixNodeData(consumedMatrix.connectionMatrixNodeData);
	}

	_concatenateConsumedRows(consumedMatrix, consumedNetworkNode, consumedNodeOriginalMatrixPosition)
	{
		let currentConsumedNodeData = this.network.getConnectionMatrixData(consumedNetworkNode);

		let previousCoordinate = consumedNodeOriginalMatrixPosition;
		let consumedNodePreviousRowNumber = previousCoordinate[0];
		let consumedNodePreviousRowPosition = previousCoordinate[1];

		let consumedNodeCurrentRowNumber = currentConsumedNodeData.rowNumber;

		let consumedMatrixHighestRowNumber = consumedMatrix._highestRowNumber;
		let consumedMatrixLowestRowNumber = consumedMatrix._lowestRowNumber;

		for(let rowIndex = consumedMatrixLowestRowNumber; rowIndex < consumedMatrixHighestRowNumber + 1; rowIndex++)
		{
			let row = consumedMatrix._rows[rowIndex];
			let oldRowNumber = row.number;
			let distanceFromConsumedNodePreviousRow = oldRowNumber - consumedNodePreviousRowNumber;
			let newRowNumber = consumedNodeCurrentRowNumber + distanceFromConsumedNodePreviousRow;

			// remove the already-consumed node from its old row
			if(consumedNodePreviousRowNumber === oldRowNumber)
			{
				row._networkMatrixNodeData.splice(consumedNodePreviousRowPosition, 1);
			}

			let correspondingRow = this._rows[newRowNumber];

			if(correspondingRow)
			{
				this._rows[newRowNumber].concat(row);
			}
			else
			{
				row.number = newRowNumber;
				this._rows[newRowNumber] = row;

				this._updateRowBounds(newRowNumber);
			}
		}
	}

	_consumeConnectionMatrixNodeData(consumedConnectionMatrixNodeData)
	{
		for(const [networkNodeID, connectionMatrixNodeData] of Object.entries(consumedConnectionMatrixNodeData))
		{
			this.connectionMatrixNodeData[networkNodeID] = connectionMatrixNodeData;
		}
	}

	handleNewInternalConnection(fromNode, toNode)
	{
		let fromNodeData = this.connectionMatrixNodeData[fromNode.uuid];
		let toNodeData = this.connectionMatrixNodeData[toNode.uuid];

		fromNodeData.addToNode(toNodeData);
		toNodeData.addFromNode(fromNodeData);

		this._handleRowMovement(toNodeData, fromNodeData);
	}

	_handleRowMovement(toNodeData, fromNodeData)
	{
		let toNodeAboveFromNode = toNodeData.rowNumber < fromNodeData.rowNumber;
		let nodesInSameRow = toNodeData.rowNumber === fromNodeData.rowNumber;
		let toNodeHasToNodes = toNodeData.connectedNodes.to.length > 0;

		if(toNodeAboveFromNode || nodesInSameRow)
		{
			if(!toNodeHasToNodes)
			{
				this._moveNodeToRow(toNodeData, fromNodeData.rowNumber + 1);
			}
			else if(nodesInSameRow && toNodeData.hasToNodesInNextRow)
			{
				// TODO: Figure out why this doesn't work
				/*
					If nodes are in the same row, AND this toNode (toNode1) has a toNode in the
					next row (toNode2), create and insert new row into which to put toNode1
				*/
				console.log(toNodeData.audioNodeType, toNodeData.hasToNodesInNextRow, toNodeData.nToNodesInNextRow)
				/*
					let newRow = this._createRowBelow(toNodeData.rowNumber);
					let currentRow = toNodeData.row;
					currentRow.removeNetworkMatrixNodeData(toNodeData);
					newRow.addNetworkMatrixNodeData(toNodeData);
					console.log(this._rows);
				*/
			}
		}
	}

	_addNodeToRow(networkConnectionMatrixNodeData, rowNumber)
	{
		let existingRow = this._rows[rowNumber];

		if(existingRow)
		{
			existingRow.addNetworkMatrixNodeData(networkConnectionMatrixNodeData);
		}
		else
		{
			let newRow = new IS_NetworkConnectionMatrixRow(rowNumber);
			this._rows[rowNumber] = newRow;
			newRow.addNetworkMatrixNodeData(networkConnectionMatrixNodeData);
		}

		this._updateRowBounds(rowNumber);
	}

	_removeNodeFromRow(nodeToRemove)
	{
		let currentRowNumber = nodeToRemove.rowNumber;
		let currentRow = this._rows[currentRowNumber];
		currentRow.removeNetworkMatrixNodeData(nodeToRemove);

		if(currentRow.length === 0)
		{
			this._emptyRowNumbers.push(currentRowNumber);
		}
	}

	_moveNodeToRow(nodeToMove, newRowNumber)
	{
		this._removeNodeFromRow(nodeToMove);
		this._addNodeToRow(nodeToMove, newRowNumber);
		this._handleEmptyRows();
	}

	_createRowBelow(rowNumber)
	{
		let newRowNumber = rowNumber + 1;
		let newRow = new IS_NetworkConnectionMatrixRow(newRowNumber);

		this._rows[newRowNumber] = newRow;

		for(let rowIndex = newRowNumber ; rowIndex < this._highestRowNumber + 1; rowIndex++)
		{
			let currentRowNumber = rowIndex + this._lowestRowNumber;
			let row = this._rows[currentRowNumber];
			let newRowNumber = row.number + 1;
			row.number = newRowNumber;
			this._rows[newRowNumber] = row;
		}

		return newRow;
	}

	_handleEmptyRows()
	{
		while(this._emptyRowNumbers.length > 0)
		{
			let emptyRowIndex = this._emptyRowNumbers.shift();
			this._removeEmptyRow(emptyRowIndex);
		}
	}

	_removeEmptyRow(emptyRowNumber)
	{
		let isOuterRow = emptyRowNumber === this._highestRowNumber || emptyRowNumber === this._lowestRowNumber;
		delete this._rows[emptyRowNumber];

		if(isOuterRow)
		{
			this._updateRowBounds(emptyRowNumber, true);
		}
		else
		{
			for(let rowIndex = emptyRowNumber + 1 ; rowIndex < this.nRows; rowIndex++)
			{
				let currentRowNumber = rowIndex + this._lowestRowNumber;
				let row = this._rows[currentRowNumber];
				let newRowNumber = row.number - 1;
				row.number = newRowNumber;
				this._rows[newRowNumber] = row;
			}

			delete this._rows[this._highestRowNumber];
			this._highestRowNumber -= 1;
		}
	}

	_updateRowBounds(rowNumber, rowWasRemoved = false)
	{
		if(rowWasRemoved)
		{
			if(rowNumber === this._highestRowNumber)
			{
				this._highestRowNumber -= 1;
			}
			if(rowNumber === this._lowestRowNumber)
			{
				this._lowestRowNumber += 1;
			}

			return;
		}

		if(rowNumber > this._highestRowNumber)
		{
			this._highestRowNumber += 1;
		}
		else if(rowNumber < this._lowestRowNumber)
		{
			this._lowestRowNumber -= 1;
		}
	}

	print()
	{
		IS_PrintNetworkConnectionMatrix.PrintMatrix(this);
	}
}