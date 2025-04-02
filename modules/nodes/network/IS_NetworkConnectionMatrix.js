import { IS_NetworkConnectionMatrixRow } from "./IS_NetworkConnectionMatrixRow.js"
import { IS_NetworkConnectionMatrixNodeData } from "./IS_NetworkConnectionMatrixNodeData.js";
import { IS_PrintNetworkConnectionMatrix } from "./IS_PrintNetworkConnectionMatrix.js";

export class IS_NetworkConnectionMatrix
{
	constructor(networkNode)
	{
		let firstRowNumber = 0;
		this._highestRowNumber = 0;
		this._lowestRowNumber = 0;
		this._rows = {};

		this._emptyRowNumbers = [];

		let firstNodeData = new IS_NetworkConnectionMatrixNodeData(networkNode);
		this._addNodeToRow(firstNodeData, firstRowNumber);

		this._currentNodes = {};
		this._currentNodes[firstNodeData.id] = firstNodeData;
	}

	get nNodes() { return Object.keys(this._currentNodes).length; }
	get nRows() { return 1 + (this._highestRowNumber - this._lowestRowNumber); }
	// get nColumns() { return this._widestRowLength; }

	get currentNodes() { return this._currentNodes; }

	handleNodeConnected(consumedNetwork, consumingNode, consumedNode)
	{
		let consumedNodeCoordinateBeforeConsumption =
			this._getPreConsumptionCoordinate(consumedNetwork, consumedNode);

		this._consumeConnectingNode(consumedNetwork, consumingNode, consumedNode);
		this._handleConsumedMatrix(consumedNetwork, consumedNode, consumedNodeCoordinateBeforeConsumption);
	}

	_consumeConnectingNode(consumedNetwork, consumingNode, consumedNode)
	{
		let consumingNodeData = this._currentNodes[consumingNode.id];
		let consumingNodeRowNumber = consumingNodeData.rowNumber;

		let consumedNodeRowNumber = consumedNode.isFrom ?
			consumingNodeRowNumber - 1 : consumingNodeRowNumber + 1;

		let consumedNodeData = consumedNetwork._matrix.currentNodes[consumedNode.id];

		this._addNodeToRow(consumedNodeData, consumedNodeRowNumber);

		consumedNodeData.addConnectedNode(consumingNodeData, consumingNode.isFrom);
		consumingNodeData.addConnectedNode(consumedNodeData, consumedNode.isFrom);

		this._addToExistingNodes(consumedNodeData);
	}

	_handleConsumedMatrix(consumedNetwork, consumedNode, consumedNodeCoordinateBeforeConsumption)
	{
		let consumedMatrix = consumedNetwork.matrix;

		if(consumedMatrix.nNodes <= 1)
		{
			return;
		}

		this._concatenateConsumedRows(consumedMatrix, consumedNode, consumedNodeCoordinateBeforeConsumption);
		this._updateCurrentNodes(consumedNetwork);
	}

	_concatenateConsumedRows(consumedMatrix, consumedNode, consumedNodeCoordinateBeforeConsumption)
	{
		let currentConsumedNodeData = this._currentNodes[consumedNode.id];

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

	// TODO: Resolve this with network._nodes (AKA get rid of network._nodes), cus it's really getting out of hand
	_updateCurrentNodes(consumedNetwork)
	{
		let consumedMatrix = consumedNetwork._matrix;
		let consumedNodes = consumedMatrix._currentNodes;

		for(const [id, nodeData] of Object.entries(consumedNodes))
		{
			this._currentNodes[nodeData.id] = nodeData;
		}
	}

	_getPreConsumptionCoordinate(consumedNetwork, consumedNode)
	{
		let preConsumptionNode = consumedNetwork.matrix._currentNodes[consumedNode.id];
		let preConsumptionRowNumber = preConsumptionNode.rowNumber;
		let preConsumptionRowPosition = preConsumptionNode.rowPosition;

		if(preConsumptionRowNumber)
		{
			return [preConsumptionRowNumber, preConsumptionRowPosition];
		}
	}

	handleNewInternalConnection(fromNode, toNode)
	{
		let fromNodeData = this._currentNodes[fromNode.uuid];
		let toNodeData = this._currentNodes[toNode.uuid];

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

	_addToExistingNodes(consumedNodeData)
	{
		this._currentNodes[consumedNodeData.id] = consumedNodeData;
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