import { IS_NodeData } from "../../types/IS_NodeData.js";

export class IS_NodeRegistry
{
	constructor()
	{
		this._registry = [];
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