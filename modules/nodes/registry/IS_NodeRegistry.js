export const IS_NodeRegistry =
{
	_registry: {},

	get nNodes() { return this._registry.length; },
	getAudioNodeFromUUID(audioNodeUUID) { return this._registry[audioNodeUUID]; },

	registerNode(audioNode)
	{
		this._registry[audioNode.uuid] = audioNode;
	}
}