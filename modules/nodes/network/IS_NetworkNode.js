import { IS_Object } from "../../types/IS_Object.js";
import { IS_Type } from "../../enums/IS_Type.js";

export class IS_NetworkNode extends IS_Object
{
	constructor(audioNodeType)
	{
		super(IS_Type.IS_Network.Node);

		this._audioNodeType = audioNodeType;

		this._networkId = null;
		
		this._fromNodes = [];
		this._toNodes = [];
		this._toParameters = [];
		this._parameterInputs = [];

		this._representationLayerNumber = null;
		this._willPropagate = false;
	}

	get networkId() { return this._networkId; }
	get audioNodeType() { return this._audioNodeType; }

	get fromNodes() { return this._fromNodes; }
	get toNodes() { return this._toNodes; }

	get representationLayerNumber() { return this._representationLayerNumber; }
	set representationLayerNumber(value) { this._representationLayerNumber = value; }

	get willPropagate() { return this._willPropagate; }
	set willPropagate(value) { this._willPropagate = value; }

	setNetworkId(networkId)
	{
		this._networkId = networkId;
	}
	
	addFromNode(networkNode)
	{
		this._fromNodes.push(networkNode);

		// do not aquire froms if connection is feedback
		if(this._toNodes.includes(networkNode))
		{
			return;
		}

		let concatenatedFromNodes = this._fromNodes.concat(networkNode.fromNodes);
		// remove duplicates
		this._fromNodes = [...new Set(concatenatedFromNodes)];
	}
	
	addToNode(networkNode)
	{
		this._toNodes.push(networkNode)

		// do not aquire tos if connection is feedback
		if(this._fromNodes.includes(networkNode))
		{
			return;
		}

		let concatenatedToNodes = this._toNodes.concat(networkNode.toNodes);
		// remove duplicates
		this._toNodes = [...new Set(concatenatedToNodes)];
	}

	addToParameter(networkNode)
	{
		this._toParameters.push(networkNode);
	}

	addParameterInput(networkNode)
	{
		this._parameterInputs.push(networkNode);
	}

	isFeedback(networkNode)
	{
		return this._fromNodes.includes(networkNode);
	}
}