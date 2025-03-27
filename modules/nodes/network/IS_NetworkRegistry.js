import { IS_Network } from "./IS_Network.js";

// TODO: This and the NodeRegistry should maybe be optional imports?
//  They are pretty useful Utilities, so maybe not, but at the very least
//  you should make sure that no core functionalities depend on them
export const IS_NetworkRegistry =
{
	_registry: [],

	CreateNetwork(audioNode)
	{
		let network = new IS_Network(audioNode);
		this[network.uuid] = network;

		return network.uuid;
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

		let networkSize1 = IS_NetworkRegistry[networkId1].size;
		let networkSize2 = IS_NetworkRegistry[networkId2].size;

		// If they're equal, network1 is just considered bigger
		let oneIsBigger = networkSize1 >= networkSize2;
		let biggerNetwork = oneIsBigger ? this._registry[networkId1] : this._registry[networkId2];
		let smallerNetwork = !oneIsBigger ? this._registry[networkId1] : this._registry[networkId2];

		biggerNetwork.consume(smallerNetwork.nodes);

		this._registry.delete(smallerNetwork.networkId);
	}
}