import { IS_Object } from "../types/IS_Object.js";
import { IS_Type } from "../enums/IS_Type.js";

export const IS_BufferPresets =
{
    _currentBuffer: null,

    _setBuffer(iSAudioBuffer)
    {
        this._currentBuffer = iSAudioBuffer;
        return this;
    },

    sineWave()
    {
        this._currentBuffer.sine(1).add();
    }
}