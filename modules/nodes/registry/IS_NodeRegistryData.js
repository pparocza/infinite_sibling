export class IS_NodeRegistryData
{
	constructor(audioNode)
	{
		this._iSType = audioNode.iSType;

		this._hash = null;
	};

	get iSType() { return this._iSType; }
	get hash() { return this._hash; };

	setHash(hash) { this._hash = hash; }
}