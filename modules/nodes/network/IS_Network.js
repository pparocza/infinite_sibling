import { IS_Type } from "../../enums/IS_Type.js";
import { IS_Object } from "../../types/IS_Object.js";
import { IS_NetworkConnectionMatrix } from "./IS_NetworkConnectionMatrix.js";

export class IS_Network extends IS_Object
{
	constructor(networkNode)
	{
		super(IS_Type.IS_Network.Network);

		// TODO: pushing the assignment of the network id to IS_NetworkConnectionMatrix
		//  seems really sloppy
		this._connectionMatrix = new IS_NetworkConnectionMatrix(this.id, networkNode);
	}

	get id() { return this.uuid; }
	get size() { return this.connectionMatrix.nNodes; }
	get connectionMatrix() { return this._connectionMatrix; }

	consume(networkToConsume, consumingNode, consumedNode)
	{
		this._connectionMatrix.handleNetworkConsumed(networkToConsume, consumingNode, consumedNode);
	}

	handleNewInternalConnection(fromNode, toNode)
	{
		this._connectionMatrix.handleNewInternalConnection(fromNode, toNode);
	}

	_printConnectionMatrix()
	{
		this._connectionMatrix.print();
	}

	print()
	{
		this._printConnectionMatrix();
	}
}