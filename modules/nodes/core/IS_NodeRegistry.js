import { IS_NodeData } from "../../types/IS_NodeData.js";

export class IS_NodeRegistry
{
	constructor()
	{
		this._registry = [];
	}

	get nNodes()
	{
		return this._registry.length;
	}

	registerNode(nodeData)
	{
		nodeData._setHash(this.assignHash());
		this._registry.push(nodeData);
	}

	assignHash()
	{
		return this._registry.length;
	}
}