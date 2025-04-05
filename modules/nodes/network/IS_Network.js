import { IS_Type } from "../../enums/IS_Type.js";
import { IS_Object } from "../../types/IS_Object.js";
import { IS_NetworkConnectionMatrix } from "./IS_NetworkConnectionMatrix.js";

export class IS_Network extends IS_Object
{
	constructor(networkNode)
	{
		super(IS_Type.IS_Network.Network);

		networkNode.networkUUID = this.uuid;
		this._networkNodes = [networkNode];

		this._connectionMatrix = new IS_NetworkConnectionMatrix(this, networkNode);
	}

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

	getConsumedNodeOriginalMatrixPosition(consumedNetwork, consumedNetworkNode)
	{
		return consumedNetwork.getConnectionMatrixData(consumedNetworkNode).matrixPosition;
	}

	consumeConnection(consumedNetwork, consumingNode, consumedNode)
	{
		consumedNode.networkUUID = this.uuid;
		this.networkNodes.push(consumedNode);

		let consumingMatrixNodeData = this.getConnectionMatrixData(consumingNode);
		let consumedMatrixNodeData = consumedNetwork.getConnectionMatrixData(consumedNode)

		this.connectionMatrix.consumeConnection(consumedNode, consumedMatrixNodeData, consumingMatrixNodeData);
	}

	consumeNetwork(consumedNetwork, consumedNode, consumedNodeOriginalMatrixPosition)
	{
		for(let nodeIndex = 0; nodeIndex < consumedNetwork.size; nodeIndex++)
		{
			let nodeToConsume = consumedNetwork.networkNodes[nodeIndex];
			nodeToConsume.networkUUID = this.uuid;
			this.networkNodes.push(nodeToConsume);
		}

		let consumedMatrix = consumedNetwork._connectionMatrix;
		this._connectionMatrix.consumeMatrix(consumedMatrix, consumedNode, consumedNodeOriginalMatrixPosition);
	}

	getConnectionMatrixData(networkNode)
	{
		let networkNodeID = networkNode.uuid;
		return this._connectionMatrix.nodeData[networkNodeID];
	}

	handleNewInternalConnection(fromNode, toNode)
	{
		this._connectionMatrix.handleNewInternalConnection(fromNode, toNode);
	}

	print()
	{
		this._printConnectionMatrix();
	}

	_printConnectionMatrix()
	{
		this._connectionMatrix.print();
	}
}