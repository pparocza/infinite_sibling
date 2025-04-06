import { IS_NodeRegistry } from "./IS_NodeRegistry.js";

export class IS_NodeRegistryData
{
	constructor(audioNode)
	{
		this._audioNode = audioNode;
		this._iSType = audioNode.iSType;

		this._hash = null;
	};

	get audioNode() { return this._audioNode; }
	get iSType() { return this._iSType; }
	get hash() { return IS_NodeRegistry._registry.indexOf(this); };

	setHash(hash) { this._hash = hash; }
}