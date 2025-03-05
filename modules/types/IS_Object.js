export class IS_Object
{
    // TODO: type hierarchy
    constructor(iSType)
    {
        this._iSType = iSType;
    }

    isISObject = true;

    // TODO: .isType properties (eg. IS_BiquadFilter.isBiquadFilter = true; b/c undefined will act as false in an if statement
    get iSType() { return this._iSType; };
}
