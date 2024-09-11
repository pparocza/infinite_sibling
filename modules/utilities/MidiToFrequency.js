export function mToF(midiPitchNumber)
{
    return 440 * Math.pow(2, (midiPitchNumber - 69) / 12);
}
