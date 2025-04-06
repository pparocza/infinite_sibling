import { IS_NetworkNode } from "./IS_NetworkNode.js";
import { IS_NetworkNodeAudioParameter } from "./IS_NetworkNodeAudioParameter.js";
import { IS_Network } from "./IS_Network.js";

export const IS_NetworkRegistry =
{
	_registry: {},
	_idArray: [],

	get nNetworks() { return this._idArray.length; },
	getNetwork(index)
	{
		let networkUUID = this._idArray[index];
		return this._registry[networkUUID];
	},

	HandleNodeCreated(audioNode)
	{
		let networkNode = new IS_NetworkNode(audioNode.registryData.hash);

		let network = new IS_Network(networkNode);

		this._registry[network.uuid] = network;
		this._idArray.push(network.uuid);

		return networkNode;
	},

	// TODO: might be worth pushing this into a worker, as networks
	// 	could eventually get pretty big to have to run the resolution loop
	//  would have to be a pretty huge network though, so not critical
	//  given how many problems will likely arise from putting this on its
	//  own thread
	ResolveNetworkMembership(fromNode, toNode)
	{
		// TODO: IS_NodeConnection class?
		let fromNetworkNode = fromNode._getNetworkNode();
		let toNetworkNode = toNode._getNetworkNode();

		fromNetworkNode.isFrom = true;
		toNetworkNode.isFrom = false;

		if(toNode.isISAudioParameter)
		{
			// probably going to have to do something about this
		}
		else
		{
			// probably going to have to do something about this
		}

		let fromNetworkUUID = fromNetworkNode.networkUUID;
		let toNetworkUUID = toNetworkNode.networkUUID;

		// If the node is already in the network (ex: node1.connect(node2) ... node2.connect(node1))
		if(fromNetworkUUID === toNetworkUUID)
		{
			this._registry[toNetworkUUID].handleNewInternalConnection(fromNetworkNode, toNetworkNode);
			return;
		}

		let fromNetworkSize = this._registry[fromNetworkUUID].size;
		let toNetworkSize = this._registry[toNetworkUUID].size;

		// If they're equal, network1 is just considered bigger
		let fromIsBigger = fromNetworkSize >= toNetworkSize;
		let biggerNetwork = fromIsBigger ? this._registry[fromNetworkUUID] : this._registry[toNetworkUUID];
		let smallerNetwork = !fromIsBigger ? this._registry[fromNetworkUUID] : this._registry[toNetworkUUID];

		let consumingNode = fromIsBigger ? fromNetworkNode : toNetworkNode;
		let consumedNode = fromIsBigger ? toNetworkNode : fromNetworkNode;

		biggerNetwork.consume(smallerNetwork, consumingNode, consumedNode);

		let smallerNetworkID = smallerNetwork.id;
		let smallerIdIndex = this._idArray.indexOf(smallerNetworkID);
		this._idArray.splice(smallerIdIndex, 1);

		delete this._registry[smallerNetwork.id];
	},

	printNetworks()
	{
		for(let networkIndex = 0; networkIndex < this._idArray.length; networkIndex++)
		{
			let id = this._idArray[networkIndex];
			let network = this._registry[id];

			network.print();
		}
	}
}