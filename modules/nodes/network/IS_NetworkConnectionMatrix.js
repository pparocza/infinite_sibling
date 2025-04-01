import { IS_NetworkConnectionMatrixDestination } from "./IS_NetworkConnectionMatrixDestination.js";
import { IS_NetworkConnectionMatrixRow } from "./IS_NetworkConnectionMatrixRow.js"
import { IS_NetworkConnectionMatrixNodeData } from "./IS_NetworkConnectionMatrixNodeData.js";

export class IS_NetworkConnectionMatrix
{
	constructor(networkNode)
	{
		let firstRowNumber = 0;
		this._highestRowNumber = 0;
		this._lowestRowNumber = 0;
		this._rows = {};

		let firstNodeData = new IS_NetworkConnectionMatrixNodeData(networkNode, firstRowNumber);
		this._rows[firstRowNumber] = new IS_NetworkConnectionMatrixRow(firstNodeData);
		firstNodeData.rowPosition = this._getRowLength(firstRowNumber) - 1;

		this._existingNodes = {};
		this._existingNodes[firstNodeData.id] = firstNodeData;
	}

	get nRows() { return this._highestRowNumber - this._lowestRowNumber }
	// get width() { return this._widestRowLength; }

	update(networkToConsume, consumingNode, consumedNode)
	{
		let consumingNodeData = this._existingNodes[consumingNode.id];
		let consumingNodeRowNumber = consumingNodeData.rowNumber;

		let consumedNodeRowNumber = consumedNode.isReceiving ?
			consumingNodeRowNumber - 1 : consumingNodeRowNumber + 1;

		this._updateRowBounds(consumedNodeRowNumber);

		let consumedNodeData = new IS_NetworkConnectionMatrixNodeData
		(
			consumedNode, consumedNodeRowNumber
		);

		consumedNodeData.addConnectionDestination(new IS_NetworkConnectionMatrixDestination(consumingNodeData));

		this._addNodeToRow(consumedNodeData, consumingNodeData);

		this.iterateRows();
	}

	handleNewInternalConnection(fromNode, toNode)
	{
		let fromNodeData = this._existingNodes[fromNode.uuid];
		let toNodeData = this._existingNodes[toNode.uuid];

		fromNodeData.addConnectionDestination(new IS_NetworkConnectionMatrixDestination(toNodeData));
		toNodeData.addConnectionDestination(new IS_NetworkConnectionMatrixDestination(fromNodeData));
	}

	_addNodeToRow(consumedNodeData, consumingNodeData)
	{
		let consumedNodeRowNumber = consumedNodeData.rowNumber;

		let existingRow = this._rows[consumedNodeRowNumber];

		if(existingRow)
		{
			existingRow.addNetworkMatrixNodeData(consumedNodeData);
		}
		else
		{
			this._rows[consumedNodeRowNumber] = new IS_NetworkConnectionMatrixRow(consumedNodeData);
		}

		consumedNodeData.rowPosition = this._getRowLength(consumedNodeRowNumber) - 1;
		consumingNodeData.addConnectionDestination(new IS_NetworkConnectionMatrixDestination(consumedNodeData));
		this._addToExistingNodes(consumedNodeData);
	}

	_addToExistingNodes(consumedNodeData)
	{
		this._existingNodes[consumedNodeData.id] = consumedNodeData;
	}

	_updateRowBounds(newRowNumber)
	{
		if(newRowNumber > this._highestRowNumber)
		{
			this._highestRowNumber += 1;
		}
		else if(newRowNumber < this._highestRowNumber)
		{
			this._lowestRowNumber -= 1;
		}
	}

	_getRowLength(rowNumber)
	{
		return this._rows[rowNumber].length;
	}

	iterateRows()
	{
		for(let layerIndex = 0 ; layerIndex < this.nRows + 1; layerIndex++)
		{
			let currentLayer = layerIndex + this._lowestRowNumber;
			console.log("layer number:", currentLayer, this._rows[currentLayer]);
		}
	}
}