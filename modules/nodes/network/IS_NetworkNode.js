import { IS_Object } from "../../types/IS_Object.js";
import { IS_Type } from "../../enums/IS_Type.js";

export class IS_NetworkNode extends IS_Object
{
	constructor(audioNodeType)
	{
		super(IS_Type.IS_Network.Node);

		this._audioNodeType = audioNodeType;

		/*
		 	TODO: indicates this nodes relationship to ONE OTHER node when a connection is
		 	 made, for the purposes of sorting in an IS_NetworkConnectionMatrix
		 	 ... probably not the best but good for now
	 	*/
		this._isFrom = false;

		this._networkId = null;
	}

	get id () { return this._uuid; }
	get networkID() { return this._networkId; }
	set networkID(value) { this._networkId = value; }

	get audioNodeType() { return this._audioNodeType; }

	get isFrom() { return this._isFrom; }
	set isFrom(value) { this._isFrom = value; }


}