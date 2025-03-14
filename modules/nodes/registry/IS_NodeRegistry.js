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
		nodeData._setHash(this._assignHash());
		this._registry.push(nodeData);
		return nodeData;
	},

	getNodeData(nodeHash) { return this._registry[nodeHash]; },
	_assignHash() { return this._registry.length; }
}