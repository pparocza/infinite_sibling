import { IS_Object } from "../../types/IS_Object.js";
import { IS_Type } from "../../enums/IS_Type.js";
import { IS_NodeRegistry } from "../registry/IS_NodeRegistry.js";

export class IS_NetworkNode extends IS_Object
{
	constructor(audioNodeRegistryHash)
	{
		super(IS_Type.IS_Network.Node);

		/*
		 Storing the registry hash here allows stuff that uses this data
		  to get additional data from IS_NodeRegistry if needed
	 	*/
		this._audioNodeRegistryHash = audioNodeRegistryHash;
		this._networkUUID = null;

		/*
		 	TODO: indicates this nodes relationship to ONE OTHER node when a connection is
		 	 made, for the purposes of sorting in an IS_NetworkConnectionMatrix
		 	 ... probably not the best but good for now
	 	*/
		this._isFrom = false;
	}

	get networkUUID() { return this._networkUUID; }
	set networkUUID(value) { this._networkUUID = value; }

	get audioNodeRegistryData()
	{
		return IS_NodeRegistry.getNodeData(this._audioNodeRegistryHash);
	};

	get isFrom() { return this._isFrom; }
	set isFrom(value) { this._isFrom = value; }
}