import { IS_Object } from "../../types/IS_Object.js";
import { IS_Type } from "../../enums/IS_Type.js";

export class IS_NetworkNode extends IS_Object
{
	constructor(audioNodeType)
	{
		super(IS_Type.IS_Network.Node);

		this._audioNodeType = audioNodeType;

		this._isReceiving = false;

		this._networkId = null;
	}

	get id () { return this._uuid; }
	get networkID() { return this._networkId; }
	get audioNodeType() { return this._audioNodeType; }

	get isReceiving() { return this._isRecieving; }
	set isReceiving(value) { this._isRecieving = value; }

	setNetworkID(networkId)
	{
		this._networkId = networkId;
	}
}