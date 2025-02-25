export class IS_NodeData
{
	constructor(audioNode)
	{
		this._audioNode = audioNode;

		this._connections = [];
		this._hash = null;
	};

	get audioNode() { return this._audioNode; };
	get connections () { return this._connections };
	get hash() { return this._hash; };

	_setHash(hash) { this._hash = hash; }

	registerConnection(nodeData)
	{
		this._connections.push(nodeData);
	}
}