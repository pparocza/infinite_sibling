import { IS_Effect } from "../core/effect/IS_Effect.js";
import { IS_Type } from "../../enums/IS_Type.js";

class StartableNodeData
{
	constructor(node, channel)
	{
		this._node = node;
		this._channel = channel;
	}

	get node() { return this._node; }
	get channel() { return this._channel; }
}

class ChannelData
{
	constructor(nodes = [], index, name = null)
	{
		this._nodes = nodes;
		this._index = index;
		this._name = name;
	}

	get nodes() { return this._nodes }
	get index() { return this._index; }
	get name() { return this._name }
}

export class IS_NodeMatrix extends IS_Effect
{
	constructor(siblingContext)
	{
		super(siblingContext, IS_Type.IS_EffectType.IS_NodeMatrix);

		this._startableNodes = [];
		this._channels = {};
		this._nChannels = 0;
	}

	connectNodeToChannel(audioNode, channel)
	{
		let channelInput = this._channels[channel.toString()].nodes[0];
		audioNode.connect(channelInput);
	}

	createChannel(audioNodes = [], channelName = null)
	{
		let channelData = new ChannelData
		(
			audioNodes, ++this._nChannels, channelName
		)

		if(channelName === null)
		{
			this._channels[channelData.index.toString()] = channelData;
		}
		else
		{
			this._channels[channelName] = channelData;
		}


		this.registerStartableNodes(audioNodes, this._channels.length - 1);

		// TODO: maybe time for a hasInput property?
		if(audioNodes[0].iSType === IS_Type.IS_Effect)
		{
			this.configureInput(audioNodes[0]);
		}

		this.configureOutput(audioNodes[audioNodes.length - 1]);

		if(audioNodes.length === 1)
		{
			return;
		}

		for(let nodeIndex = 1; nodeIndex < audioNodes.length; nodeIndex++)
		{
			audioNodes[nodeIndex - 1].connect(audioNodes[nodeIndex]);
		}
	}

	registerStartableNodes(audioNodes, channel)
	{
		for(let nodeIndex = 0; nodeIndex < audioNodes.length; nodeIndex++)
		{
			let node = audioNodes[nodeIndex];
			let nodeData = new StartableNodeData(node, channel)

			if(node.iSType === IS_Type.IS_StartableNode)
			{
				this._startableNodes.push(nodeData);
			}
		}
	}

	scheduleStart(time = 0, duration = null, channel = null)
	{
		for(let startableNodeIndex = 0; startableNodeIndex < this._startableNodes.length; startableNodeIndex++)
		{
			let startableNodeData = this._startableNodes[startableNodeIndex];

			if(channel === null || startableNodeData.channel === channel)
			{
				startableNodeData.node.scheduleStart(time, duration);
			}
		}
	}

	scheduleStop(time = 0, channel = null)
	{
		for(let startableNodeIndex = 0; startableNodeIndex < this._startableNodes.length; startableNodeIndex++)
		{
			let startableNodeData = this._startableNodes[startableNodeIndex];

			if(channel === null || startableNodeData.channel === channel)
			{
				startableNodeData.node.scheduleStart(time);
			}
		}
	}
}