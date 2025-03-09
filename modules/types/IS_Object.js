import { Utilities } from "../utilities/Utilities.js";

export class IS_Object
{
    constructor(iSType)
    // TODO: type hierarchy
    {
        this._iSType = iSType;
        this._uuid = Utilities._private.GenerateUUID();
    }

    isISObject = true;

    // TODO: .isType properties (eg. IS_BiquadFilter.isBiquadFilter = true; b/c undefined will act as false in an if statement
    get iSType() { return this._iSType; };
    get uuid() { return this._uuid; };
}
