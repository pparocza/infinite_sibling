import { IS_Type } from "../../enums/IS_Type.js";
import { IS_Object } from "../../types/IS_Object.js";
import { IS_NetworkConnectionMatrix } from "./IS_NetworkConnectionMatrix.js";

export class IS_Network extends IS_Object
{
	constructor(networkNode)
	{
		super(IS_Type.IS_Network.Network);

		// TODO: this._matrix has enough functionality for this to be removed
		//  you actually really need to do this, there's a lot of sloppy crossover
		//  with stuff like this._matrix._updateCurrentNodes;
		this._nodes = [];
		this._nodes.push(networkNode);

		this._matrix = new IS_NetworkConnectionMatrix(networkNode, this);
	}

	get id() { return this.uuid; }
	get size() { return this._nodes.length; }
	get nodes() { return this._nodes; }
	get matrix() { return this._matrix; }

	consume(networkToConsume, consumingNode, consumedNode)
	{
		let nodesToConsume = networkToConsume.nodes;

		this._matrix.handleNodeConnected(networkToConsume, consumingNode, consumedNode);

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

	_printConnectionMatrix()
	{
		this._matrix.print();
	}

	print()
	{
		this._printConnectionMatrix();
	}
}