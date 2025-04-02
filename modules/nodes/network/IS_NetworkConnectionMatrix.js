import { IS_NetworkConnectionMatrixRow } from "./IS_NetworkConnectionMatrixRow.js"
import { IS_NetworkConnectionMatrixNodeData } from "./IS_NetworkConnectionMatrixNodeData.js";
import { IS_PrintNetworkConnectionMatrix } from "./IS_PrintNetworkConnectionMatrix.js";

export class IS_NetworkConnectionMatrix
{
	constructor(networkID, firstNetworkNode)
	{
		let firstRowNumber = 0;
		this._highestRowNumber = 0;
		this._lowestRowNumber = 0;
		this._rows = {};
		this._emptyRowNumbers = [];

		let firstNodeMatrixData = new IS_NetworkConnectionMatrixNodeData
		(
			networkID, firstNetworkNode
		);

		this._addNodeToRow(firstNodeMatrixData, firstRowNumber);

		this._connectionMatrixNodeData = {};
		this._addToConnectionMatrixNodeData(firstNodeMatrixData);

		this._networkID = networkID;
	}

	get networkID() { return this._networkID; }

	get nNodes() { return Object.keys(this._connectionMatrixNodeData).length; }
	get nRows() { return 1 + (this._highestRowNumber - this._lowestRowNumber); }

	get connectionMatrixNodeData() { return this._connectionMatrixNodeData; }

	_addToConnectionMatrixNodeData(networkConnectionMatrixNodeData)
	{
		this.connectionMatrixNodeData[networkConnectionMatrixNodeData.networkNodeID]
			= networkConnectionMatrixNodeData;
	}

	handleNetworkConsumed(consumedNetwork, consumingNetworkNode, consumedNetworkNode)
	{
		let consumedNodeCoordinateBeforeConsumption =
			this._getPreConsumptionCoordinate(consumedNetwork, consumedNetworkNode);

		this._consumeConnectingNetworkNode(consumedNetwork, consumingNetworkNode, consumedNetworkNode);
		this._handleConsumedMatrix(consumedNetwork, consumedNetworkNode, consumedNodeCoordinateBeforeConsumption);

		this._assignNetworkIds(consumedNetwork.connectionMatrix.connectionMatrixNodeData);
	}

	_assignNetworkIds(consumedConnectionMatrixNodeData)
	{
		// TODO: This is so sketch -> the data is indexed by the id of the IS_NetworkNode, but the data itself
		//  contains the IS_NetworkNode, and changes its values within the loop
		for(const [networkNodeID, connectionMatrixNodeData] of Object.entries(consumedConnectionMatrixNodeData))
		{
			connectionMatrixNodeData.networkNode.networkID = this.networkID;
		}
	}

	_consumeConnectingNetworkNode(consumedNetwork, consumingNetworkNode, consumedNetworkNode)
	{
		let consumingConnectionMatrixNodeData = this._connectionMatrixNodeData[consumingNetworkNode.id];
		let consumingRowNumber = consumingConnectionMatrixNodeData.rowNumber;

		let consumedRowNumber = consumedNetworkNode.isFrom ?
			consumingRowNumber - 1 : consumingRowNumber + 1;

		let consumedConnectionMatrixNodeData =
			consumedNetwork.connectionMatrix.connectionMatrixNodeData[consumedNetworkNode.id];

		this._addNodeToRow(consumedConnectionMatrixNodeData, consumedRowNumber);

		consumedConnectionMatrixNodeData.addConnectedNode(consumingConnectionMatrixNodeData, consumingNetworkNode.isFrom);
		consumingConnectionMatrixNodeData.addConnectedNode(consumedConnectionMatrixNodeData, consumedNetworkNode.isFrom);

		this._addToConnectionMatrixNodeData(consumedConnectionMatrixNodeData);
	}

	_handleConsumedMatrix(consumedNetwork, consumedNode, consumedNodeCoordinateBeforeConsumption)
	{
		let consumedMatrix = consumedNetwork.connectionMatrix;

		if(consumedMatrix.nNodes <= 1)
		{
			return;
		}

		this._concatenateConsumedRows(consumedMatrix, consumedNode, consumedNodeCoordinateBeforeConsumption);
		this._updateCurrentNodes(consumedNetwork);
	}

	_concatenateConsumedRows(consumedMatrix, consumedNode, consumedNodeCoordinateBeforeConsumption)
	{
		let currentConsumedNodeData = this._connectionMatrixNodeData[consumedNode.id];

		let previousCoordinate = consumedNodeCoordinateBeforeConsumption;
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

			// remove the already consumed row from its old row
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

	_updateCurrentNodes(consumedNetwork)
	{
		let consumedMatrix = consumedNetwork.connectionMatrix;
		let consumedConnectionMatrixNodeData = consumedMatrix.connectionMatrixNodeData;

		for(const [networkNodeID, connectionMatrixNodeData] of Object.entries(consumedConnectionMatrixNodeData))
		{
			this._connectionMatrixNodeData[networkNodeID] = connectionMatrixNodeData;
		}
	}

	_getPreConsumptionCoordinate(consumedNetwork, consumedNetworkNode)
	{
		let consumedConnectionMatrixNodeData = consumedNetwork.connectionMatrix.connectionMatrixNodeData;
		let preConsumptionNode = consumedConnectionMatrixNodeData[consumedNetworkNode.id];

		let preConsumptionRowNumber = preConsumptionNode.rowNumber;
		let preConsumptionRowPosition = preConsumptionNode.rowPosition;

		if(preConsumptionRowNumber)
		{
			return [preConsumptionRowNumber, preConsumptionRowPosition];
		}
	}

	handleNewInternalConnection(fromNode, toNode)
	{
		let fromNodeData = this._connectionMatrixNodeData[fromNode.uuid];
		let toNodeData = this._connectionMatrixNodeData[toNode.uuid];

		fromNodeData.addConnectedNode(toNodeData, false);
		toNodeData.addConnectedNode(fromNodeData, true);

		let toNodeAboveFromNode = toNodeData.rowNumber < fromNodeData.rowNumber;
		let nodesInSameRow = toNodeData.rowNumber === fromNodeData.rowNumber;
		let toNodeHasToNodes = toNodeData.connectedNodes.to.length > 0;

		/*
			TODO: if nodes are in the same row, AND this toNode (toNode1) has a toNode in the
			 next row (toNode2), create and insert new row into which to put toNode1
	 	*/

		if(toNodeAboveFromNode || nodesInSameRow)
		{
			if(!toNodeHasToNodes)
			{
				this._moveNodeToRow(toNodeData, fromNodeData.rowNumber + 1);
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

	_updateLongestRow(rowNumber)
	{

	}

	_getRowLength(rowNumber)
	{
		return this._rows[rowNumber].length;
	}

	print()
	{
		IS_PrintNetworkConnectionMatrix.PrintMatrix(this);
	}
}