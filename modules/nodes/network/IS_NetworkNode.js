export class IS_NetworkNode
{
	constructor()
	{
		this._networkId = null;
	}

	get networkId() { return this._networkId; }

	setNetworkId(networkId)
	{
		this._networkId = networkId;
	}
}