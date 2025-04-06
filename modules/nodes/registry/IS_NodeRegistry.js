import { IS_NodeRegistryData } from "./IS_NodeRegistryData.js";

export const IS_NodeRegistry =
{
	_registry: [],

	get nNodes()
	{
		return this._registry.length;
	},

	registerNode(audioNode)
	{
		let nodeData = new IS_NodeRegistryData(audioNode);
		nodeData.setHash(this._assignHash());
		// TODO: This will create issues for references to the hash if the node ever moves
		//  in the registry - AKA if other nodes are added or removed in a way that moves
		//  this one so maybe this should be a dictionary with uuid keys
		this._registry.push(nodeData);
		return nodeData;
	},

	getNodeData(nodeHash) { return this._registry[nodeHash]; },

	_assignHash() { return this._registry.length; }
}