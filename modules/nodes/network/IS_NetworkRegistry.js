import { IS_NetworkNode } from "./IS_NetworkNode.js";
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

		HandleNodeCreated(audioNode)
		{
			let networkNode = new IS_NetworkNode(audioNode);

			let network = new IS_Network(networkNode);
			networkNode.setNetworkId(network.id);

			this._registry[network.id] = network;
			this._idArray.push(network.id);

			return networkNode;
		},

		// TODO: might be worth pushing this into a worker, as networks
		// 	could eventually get pretty big to have to run the resolution loop
		//  would have to be a pretty huge network though, so not critical
		//  given how many problems will likely arise from putting this on sits
		//  own thread
		ResolveNetworkMembership(audioNode1, audioNode2)
		{
			let networkId1 = audioNode1.networkId;
			let networkId2 = audioNode2.networkId;

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
		}
	}