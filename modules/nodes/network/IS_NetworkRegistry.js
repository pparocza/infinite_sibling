import { IS_NetworkNode } from "./IS_NetworkNode.js";
import { IS_NetworkNodeAudioParameter } from "./IS_NetworkNodeAudioParameter.js";
import { IS_Network } from "./IS_Network.js";

// TODO: This and the NodeRegistry should maybe be optional imports?
//  They are pretty useful Utilities, so maybe not, but at the very least
//  you should make sure that no core functionalities depend on them
export const IS_NetworkRegistry =
{
	_registry: {},
	// For now, this makes the registry easily iterable, so...
	// TODO: helper function to iterate _registry
	_idArray: [],

	get nNetworks() { return this._idArray.length; },
	getNetwork(index)
	{
		let networkId = this._idArray[index];
		return this._registry[networkId];
	},

	HandleNodeCreated(audioNodeType)
	{
		let networkNode = new IS_NetworkNode(audioNodeType);

		let network = new IS_Network(networkNode);
		networkNode.setNetworkID(network.id);

		this._registry[network.id] = network;
		this._idArray.push(network.id);

		return networkNode;
	},

	// TODO: might be worth pushing this into a worker, as networks
	// 	could eventually get pretty big to have to run the resolution loop
	//  would have to be a pretty huge network though, so not critical
	//  given how many problems will likely arise from putting this on its
	//  own thread
	ResolveNetworkMembership(fromNode, toNode)
	{
		let fromNetworkNode = fromNode._getNetworkNode();
		let toNetworkNode = toNode._getNetworkNode();

		fromNetworkNode.isReceiving = true;

		if(toNode.isISAudioParameter)
		{
			// probably going to have to do something about this
		}
		else
		{
			// probably going to have to do something about this
		}

		let fromNetworkID = fromNetworkNode.networkID;
		let toNetworkID = toNetworkNode.networkID;

		// If the node is already in the network (ex: node1.connect(node2) ... node2.connect(node1))
		if(fromNetworkID === toNetworkID)
		{
			this._registry[toNetworkID].handleNewInternalConnection(fromNetworkNode, toNetworkNode);
			return;
		}

		let fromNetworkSize = this._registry[fromNetworkID].size;
		let toNetworkSize = this._registry[toNetworkID].size;

		// If they're equal, network1 is just considered bigger
		let fromIsBigger = fromNetworkSize >= toNetworkSize;
		let biggerNetwork = fromIsBigger ? this._registry[fromNetworkID] : this._registry[toNetworkID];
		let smallerNetwork = !fromIsBigger ? this._registry[fromNetworkID] : this._registry[toNetworkID];

		let consumingNode = fromIsBigger ? fromNetworkNode : toNetworkNode;
		let consumedNode = fromIsBigger ? toNetworkNode : fromNetworkNode;

		biggerNetwork.consume(smallerNetwork, consumingNode, consumedNode);

		let smallerNetworkID = smallerNetwork.id;
		let smallerIdIndex = this._idArray.indexOf(smallerNetworkID);
		this._idArray.splice(smallerIdIndex, 1);

		delete this._registry[smallerNetwork.id];
	}
}