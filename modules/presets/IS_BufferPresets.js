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