import { Utilities } from "../utilities/Utilities.js";

export class IS_Object
{
    constructor(iSType)
    {
        this._iSType = iSType;
        this._uuid = Utilities._private.GenerateUUID();
    }

    isISObject = true;

    get iSType() { return this._iSType; };
    get uuid() { return this._uuid; };
}
