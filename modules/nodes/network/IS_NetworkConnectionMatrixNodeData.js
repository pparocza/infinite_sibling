import { IS_Type } from "../../enums/IS_Type.js";
import { IS_Object } from "../../types/IS_Object.js";

export class IS_NetworkConnectionMatrixNodeData extends IS_Object
{
	constructor(audioNodeType)
	{
		super(IS_Type);

		this._audioNodeType = audioNodeType;

		this._row = null;

		this._connectedNodes =
		{
			from: [],
			to: []
		};
	}

	get audioNodeType() { return this._audioNodeType; }

	get row() { return this._row; }
	set row(networkConnectionMatrixRow) { this._row = networkConnectionMatrixRow; }

	get rowNumber() { return this._row.number; }
	get rowPosition() { return this._row.getNodePosition(this); }
	get matrixPosition() { return [this.rowNumber, this.rowPosition]; }

	get connectedNodes() { return this._connectedNodes }

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

	get hasToNodesInNextRow()
	{
		for(let nodeIndex = 0; nodeIndex < this.toNodes.length; nodeIndex++)
		{
			let toNode = this.toNodes[nodeIndex];

			if(toNode.rowNumber === this.rowNumber + 1)
			{
				return true;
			}
		}

		return false;
	}

	get nToNodesInNextRow()
	{
		let connectionsInNextRow = 0;

		for(let nodeIndex = 0; nodeIndex < this.toNodes.length; nodeIndex++)
		{
			let toNode = this.toNodes[nodeIndex];

			if(toNode.rowNumber === this.rowNumber + 1)
			{
				connectionsInNextRow += 1;
			}
		}

		return connectionsInNextRow;
	}
}