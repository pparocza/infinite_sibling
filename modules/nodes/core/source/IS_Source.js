import { IS_Node } from "../IS_Node.js";
import { IS_Type } from "../../../enums/IS_Type.js";

export class IS_Source extends IS_Node
{
	constructor(siblingContext, iSSourceType = undefined)
	{
		super(siblingContext, IS_Type.IS_Source);

		this._sourceType = iSSourceType;
		this._preset = new IS_EffectPresets(this);

		this._isStartable = false;
	}

	get sourceType() { return this._sourceType; };
	get isStartable() { return this._isStartable; };
}