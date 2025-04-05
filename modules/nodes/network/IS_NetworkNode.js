import { IS_Object } from "../../types/IS_Object.js";
import { IS_Type } from "../../enums/IS_Type.js";

export class IS_NetworkNode extends IS_Object
{
	constructor(audioNode)
	{
		super(IS_Type.IS_Network.Node);

		this._networkUUID = null;

		this._audioNodeType = audioNode.iSType;
		this._audioNodeRegistryHash = audioNode.hash;

		/*
		 	TODO: indicates this nodes relationship to ONE OTHER node when a connection is
		 	 made, for the purposes of sorting in an IS_NetworkConnectionMatrix
		 	 ... probably not the best but good for now
	 	*/
		this._isFrom = false;
	}

	get networkUUID() { return this._networkUUID; }
	set networkUUID(value) { this._networkUUID = value; }

	get audioNodeType() { return this._audioNodeType; }
	get audioNodeRegistryHash() { return this._audioNodeRegistryHash; }

	get isFrom() { return this._isFrom; }
	set isFrom(value) { this._isFrom = value; }


}