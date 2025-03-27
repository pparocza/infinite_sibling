import { IS_Type } from "../../enums/IS_Type.js";
import { IS_Object } from "../../types/IS_Object.js";

export class IS_Network extends IS_Object
{
	constructor(networkNode)
	{
		super(IS_Type.IS_Network.Network);

		this._nodes = [];
		this._nodes.push(networkNode);

		/*
		 each node is assigned a layer relative to the first node added (0)
			 - +1 = outputconnection
			 - -1 = inputconnection
		 -- feedback overrides 	node1 -> node2 -> node3
		 						 (0)      (1)      (2)
		 						node3 -> node1
		 						 (2)      (0)
		 						node2 -> node4
		 						 (1)      (2)
	 	*/

		this._layers = []; // IS_NetworkLayer?
	}

	get id() { return this.uuid; }
	get size() { return this._nodes.length; }
	get nodes() { return this._nodes; }

	consume(smallerNetworkNodesArray)
	{
		while(smallerNetworkNodesArray.length > 0)
		{
			let networkNode = smallerNetworkNodesArray.shift();
			networkNode.setNetworkId(this.id);
			this._nodes.push(networkNode);
		}
	}

	_representation()
	{

	}
}