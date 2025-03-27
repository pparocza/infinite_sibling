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
    // TODO: optimize (no reason you need this specifically,
    //  so changing to something that takes less memory would
    //  be good at some point
    get uuid() { return this._uuid; };
}
