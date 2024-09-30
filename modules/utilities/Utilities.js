export const Utilities =
{
    /**
     * convert a MIDI pitch number to a frequency in Hertz
     * @param midiPitchNumber
     * @returns {number}
     */
    MidiToFrequency(midiPitchNumber)
    {
        return 440 * Math.pow(2, (midiPitchNumber - 69) / 12);
    },

    /**
     * Convert a number of seconds to a number of samples based on the current sample rate
     * @param nSeconds
     * @param sampleRate
     * @constructor
     */
    SecondsToSamples(nSeconds, sampleRate)
    {
        return nSeconds * sampleRate;
    },

    /**
     * Convert an amplitude value to a dB value
     * @param amplitudeValue
     * @constructor
     */
    AmplitudeToDecibels(amplitudeValue)
    {
        return 20.0 * Math.log10(amplitudeValue);
    },

    /**
     * Convert a dB value to an amplitude value
     * @param decibelValue
     * @constructor
     */
    DecibelsToAmplitude(decibelValue)
    {
        return Math.pow(10.0, decibelValue / 20.0)
    }
}

