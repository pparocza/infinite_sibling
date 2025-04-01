import { IS_Type } from "../../enums/IS_Type.js";
import { IS_Object } from "../../types/IS_Object.js";
import { IS_NetworkConnectionMatrix } from "./IS_NetworkConnectionMatrix.js";

export class IS_Network extends IS_Object
{
	constructor(networkNode)
	{
		super(IS_Type.IS_Network.Network);

		this._nodes = [];
		this._nodes.push(networkNode);

		this._layers = [];

		this._matrix = new IS_NetworkConnectionMatrix(networkNode, this);
	}

	get id() { return this.uuid; }
	get size() { return this._nodes.length; }
	get nodes() { return this._nodes; }

	consume(networkToConsume, consumingNode, consumedNode)
	{
		let nodesToConsume = networkToConsume.nodes;

		this._matrix.update(networkToConsume, consumingNode, consumedNode);

		while(nodesToConsume.length > 0)
		{
			let networkNode = nodesToConsume.shift();
			networkNode.setNetworkID(this.id);
			this._nodes.push(networkNode);
		}
	}

	handleNewInternalConnection(fromNode, toNode)
	{
		this._matrix.handleNewInternalConnection(fromNode, toNode);
	}

	generateRepresentation()
	{
		let firstNodeLayerNumber = 0;
		let firstNode = this._nodes[firstNodeLayerNumber];
		firstNode.representationLayerNumber = firstNodeLayerNumber;
		this._addNodeToLayer(firstNode, firstNodeLayerNumber)
		this._propagateFromNode(firstNode);

		console.log(this._layers);
	}

	_propagateFromNode(networkNode)
	{
		let toNodes = networkNode.toNodes;
		let fromLayer = networkNode.representationLayerNumber;
		let nextPropagation = [];

		for(let toNodeIndex = 0; toNodeIndex < toNodes.length; toNodeIndex++)
		{
			let toNode = toNodes[toNodeIndex];

			this._handleLayerPlacement(toNode, fromLayer);

			toNode.concatFromNodes(networkNode.fromNodes);

			if(!toNode.willPropagate && toNode.toNodes.length > 0 && !networkNode.isFeedback(toNode))
			{
				toNode.willPropagate = true;
				this._propagateFromNode(toNode);
			}
		}
	}

	_handleLayerPlacement(networkNode, fromLayerNumber)
	{
		let currentLayerNumber = networkNode.representationLayerNumber;

		if(currentLayerNumber === null)
		{
			this._handleNodeNotLayered(networkNode, fromLayerNumber);
		}
		else
		{
			this._handleNodeAlreadyLayered(networkNode, fromLayerNumber);
		}
	}

	_handleNodeNotLayered(networkNode, fromLayerNumber)
	{
		let layerNumber = fromLayerNumber + 1;
		networkNode.representationLayerNumber = layerNumber;

		this._addNodeToLayer(networkNode, layerNumber);
	}

	_handleNodeAlreadyLayered(networkNode, fromLayerNumber)
	{
		let propsedLayerNumber = fromLayerNumber + 1;
		let currentLayerNumber = networkNode.representationLayerNumber;

		let currentLayer = this._layers[currentLayerNumber];
		let indexAtCurrentLayer = currentLayer.indexOf(networkNode);

		if(currentLayerNumber < propsedLayerNumber)
		{
			currentLayer.splice(indexAtCurrentLayer, 1);
			this._addNodeToLayer(networkNode, propsedLayerNumber);
		}
	}
}