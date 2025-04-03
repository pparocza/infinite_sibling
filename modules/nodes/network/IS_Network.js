import { IS_Type } from "../../enums/IS_Type.js";
import { IS_Object } from "../../types/IS_Object.js";
import { IS_NetworkConnectionMatrix } from "./IS_NetworkConnectionMatrix.js";

export class IS_Network extends IS_Object
{
	constructor(networkNode)
	{
		super(IS_Type.IS_Network.Network);

		networkNode.networkID = this.id;
		this._networkNodes = [networkNode];

		this._connectionMatrix = new IS_NetworkConnectionMatrix(this, networkNode);
	}

	get id() { return this.uuid; }
	get networkNodes() { return this._networkNodes; }
	get size() { return this.networkNodes.length; }
	get connectionMatrix() { return this._connectionMatrix; }

	consume(consumedNetwork, consumingNode, consumedNode)
	{
		let consumedNodeOriginalMatrixPosition = this.getConsumedNodeOriginalMatrixPosition
		(
			consumedNetwork, consumedNode
		);

		this.consumeConnection(consumedNetwork, consumingNode, consumedNode);

		if(consumedNetwork.size > 1)
		{
			this.consumeNetwork(consumedNetwork, consumedNode, consumedNodeOriginalMatrixPosition);
		}
	}

	getConsumedNodeOriginalMatrixPosition(consumedNetwork, consumedNode)
	{
		return consumedNetwork.getConnectionMatrixData(consumedNode).matrixPosition;
	}

	consumeConnection(consumedNetwork, consumingNode, consumedNode)
	{
		consumedNode.networkID = this.id;
		this.networkNodes.push(consumedNode);

		let consumingMatrixNodeData = this.getConnectionMatrixData(consumingNode);

		this.connectionMatrix.consumeConnection(consumedNode, consumingMatrixNodeData);
	}

	consumeNetwork(consumedNetwork, consumedNode, consumedNodeOriginalMatrixPosition)
	{
		for(let nodeIndex = 0; nodeIndex < consumedNetwork.size; nodeIndex++)
		{
			let nodeToConsume = consumedNetwork.networkNodes[nodeIndex];
			nodeToConsume.networkID = this.id;
			this.networkNodes.push(nodeToConsume);
		}

		let consumedMatrix = consumedNetwork.connectionMatrix;
		this.connectionMatrix.consumeMatrix(consumedMatrix, consumedNode, consumedNodeOriginalMatrixPosition);
	}

	getConnectionMatrixData(networkNode)
	{
		let networkNodeID = networkNode.id;
		return this.connectionMatrix.connectionMatrixNodeData[networkNodeID];
	}

	handleNewInternalConnection(fromNode, toNode)
	{
		this.connectionMatrix.handleNewInternalConnection(fromNode, toNode);
	}

	print()
	{
		this._printConnectionMatrix();
	}

	_printConnectionMatrix()
	{
		this.connectionMatrix.print();
	}
}