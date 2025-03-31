import { IS_NetworkNode } from "./IS_NetworkNode.js";
import { IS_NetworkNodeAudioParameter } from "./IS_NetworkNodeAudioParameter.js";
import { IS_Network } from "./IS_Network.js";

// TODO: This and the NodeRegistry should maybe be optional imports?
//  They are pretty useful Utilities, so maybe not, but at the very least
//  you should make sure that no core functionalities depend on them
export const IS_NetworkRegistry =
{
	_registry: {},
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
		networkNode.setNetworkId(network.id);

		this._registry[network.id] = network;
		this._idArray.push(network.id);

		return networkNode;
	},

	HandleAudioParameterConnection()
	{

	},

	// TODO: might be worth pushing this into a worker, as networks
	// 	could eventually get pretty big to have to run the resolution loop
	//  would have to be a pretty huge network though, so not critical
	//  given how many problems will likely arise from putting this on its
	//  own thread
	ResolveNetworkMembership(fromNode, toNode)
	{
		let fromNetworkNode = fromNode._getNetworkNode();
		// TODO: specific AudioParameter handling
		// -> a parameter is always a part of its parents network
		let toNetworkNode;

		if(toNode.isISAudioParameter)
		{
			toNetworkNode = toNode.parentNode._getNetworkNode();

			fromNetworkNode.addToParameter(new IS_NetworkNodeAudioParameter(toNode));
			toNetworkNode.addParameterInput(fromNetworkNode);
		}
		else
		{
			toNetworkNode = toNode._getNetworkNode();

			fromNetworkNode.addToNode(toNetworkNode);
			toNetworkNode.addFromNode(fromNetworkNode);
		}

		let networkId1 = fromNetworkNode.networkId;
		let networkId2 = toNetworkNode.networkId;

		// If the node is already in the network (ex: node1.connect(node2) ... node2.connect(node1))
		if(networkId1 === networkId2)
		{
			return;
		}

		let networkSize1 = this._registry[networkId1].size;
		let networkSize2 = this._registry[networkId2].size;

		// If they're equal, network1 is just considered bigger
		let oneIsBigger = networkSize1 >= networkSize2;
		let biggerNetwork = oneIsBigger ? this._registry[networkId1] : this._registry[networkId2];
		let smallerNetwork = !oneIsBigger ? this._registry[networkId1] : this._registry[networkId2];

		biggerNetwork.consume(smallerNetwork.nodes);

		let smallerNetworkID = smallerNetwork.id;
		let smallerIdIndex = this._idArray.indexOf(smallerNetworkID);
		this._idArray.splice(smallerIdIndex, 1);

		delete this._registry[smallerNetwork.id];
	},

	// TODO: Can this be ongoing? - as the nodes construct their to-and-from relationships, they're
	// added to a "represented" dictionary, and if a new node is not in the current representation, it's
	// representation is resolved
	// -> the representation is always created from the first node, and after the to and from nodes are
	// concatenated, the "current representation" which originates from the original node's to and froms
	// is checked - and if the new node is not represented, the representation is resolved
	generateNetworkRepresentations()
	{
		console.log(this._registry);
		/*
		for(let networkIndex = 0; networkIndex < this.nNetworks; networkIndex++)
		{
			let networkID = this._idArray[networkIndex];
			this._registry[networkID].generateRepresentation();
		}
		 */
	}
}