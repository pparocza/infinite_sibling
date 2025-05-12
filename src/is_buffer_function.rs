use crate::TWO_PI;
use crate::is_log;

pub enum ISBufferFunctionType
{
    AmplitudeModulatedSine, Buffer, Constant, FrequencyModulatedSine, Impulse, InverseSawtooth,
    MovingAverage, Noise, NoiseBand, Normalize, Pulse, QuantizedArrayBuffer, Ramp, RampBand,
    Sawtooth, Sine, Splice, Square, SuspendedOperations, Triangle, UnipolarNoise,
    UnipolarSine, Undefined
}

pub trait ISEvaluateFunction<'a>
{
    fn evaluate
    (
        &self, current_increment: f32, current_sample: u32, current_sample_value: f32
    ) -> f32;
}

pub struct ISAmplitudeModulatedSine
{
    pub carrier_frequency: f32,
    pub modulator_frequency: f32,
    pub modulator_gain: f32
}

impl ISEvaluateFunction<'_> for ISAmplitudeModulatedSine
{
    fn evaluate
    (
        &self, current_increment: f32, current_sample: u32, current_sample_value: f32
    ) -> f32
    {
        let modulator_amplitude = self.modulator_gain *
            f32::sin(self.modulator_frequency * current_increment * TWO_PI);

        let carrier_amplitude =
            f32::sin(self.carrier_frequency * current_increment * TWO_PI);

        modulator_amplitude * carrier_amplitude
    }
}

pub struct ISBufferAsFunction<'a>
{
    pub buffer_function: &'a[f32]
}
impl ISEvaluateFunction<'_> for ISBufferAsFunction<'_>
{
    fn evaluate
    (
        &self, current_increment: f32, current_sample: u32, current_sample_value: f32
    ) -> f32
    {
        if current_sample <= self.buffer_function.len() as u32
        {
            self.buffer_function[current_sample as usize]
        }
        else
        {
            current_sample_value
        }
    }
}

// TODO: lib detects this type ahead of time, uses the value instantly
pub struct ISConstant
{
    pub value: f32,
}
impl ISEvaluateFunction<'_> for ISConstant
{
    fn evaluate
    (
        &self, current_increment: f32, current_sample: u32, current_sample_value: f32
    ) -> f32
    {
        self.value
    }
}

pub struct ISFrequencyModulatedSine
{
    pub carrier_frequency: f32,
    pub modulator_frequency: f32,
    pub modulator_gain: f32
}
impl ISEvaluateFunction<'_> for ISFrequencyModulatedSine
{
    fn evaluate
    (
        &self, current_increment: f32, current_sample: u32, current_sample_value: f32
    ) -> f32
    {
        let modulation_value = self.modulator_gain *
            f32::sin(current_increment * self.modulator_frequency * TWO_PI);

        let modulated_frequency_value = self.carrier_frequency + modulation_value;
        let sample_value = f32::sin(current_increment * modulated_frequency_value * TWO_PI);

        sample_value
    }
}

pub struct ISImpulse {}
impl ISEvaluateFunction<'_> for ISImpulse
{
    fn evaluate
    (
        &self, current_increment: f32, current_sample: u32, current_sample_value: f32
    ) -> f32
    {
        if current_sample == 0
        {
            1.0
        }
        else
        {
            0.0
        }
    }
}

pub struct ISInverseSawtooth
{
    pub exponent: f32,
}
impl ISEvaluateFunction<'_> for ISInverseSawtooth
{
    fn evaluate
    (
        &self, current_increment: f32, current_sample: u32, current_sample_value: f32
    ) -> f32
    {
        f32::powf(1.0 - current_increment, self.exponent)
    }
}

pub struct ISNoise {}
impl ISEvaluateFunction<'_> for ISNoise
{
    fn evaluate
    (
        &self, current_increment: f32, current_sample: u32, current_sample_value: f32
    ) -> f32
    {
        let mut sample_value = js_sys::Math::random() as f32;
        (sample_value * 2.0) - 1.0
    }
}

pub struct ISNoiseBand {}
impl ISEvaluateFunction<'_> for ISNoiseBand
{
    fn evaluate
    (
        &self, current_increment: f32, current_sample: u32, current_sample_value: f32
    ) -> f32
    {
        // TODO: The function arguments from JS contain arrays, and function_arguments is an array
        //  of floats
        /*
        let frequencyData = this.cachedRequestArgumentValues[0];

        let frequencies = frequencyData[0];
        let amplitudes = frequencyData[1];

        let nFrequencies = frequencies.length;

        let sampleValue = 0;

        for(let frequencyIndex= 0; frequencyIndex < nFrequencies; frequencyIndex++)
        {
            let amplitude = amplitudes[frequencyIndex];
            let frequency = frequencies[frequencyIndex];

            sampleValue += amplitude * Math.sin(frequency * currentIncrement * IS_TWO_PI);
        }

        return sampleValue;
        */
        1.0 + 0.0
    }
}

pub struct ISPulse
{
    pub pulse_start_percent: f32,
    pub pulse_end_percent: f32,
}
impl ISEvaluateFunction<'_> for ISPulse
{
    fn evaluate
    (
        &self, current_increment: f32, current_sample: u32, current_sample_value: f32
    ) -> f32
    {
        let in_cycle_bounds =
            current_increment >= self.pulse_start_percent &&
                current_increment <= self.pulse_end_percent;

        if in_cycle_bounds
        {
            1.0
        }
        else
        {
            0.0
        }
    }
}

// TODO: make this a bit less hacky (currently relies on the order of the arguments which
//  leads to a kinda clunky)
pub struct ISQuantizedArrayBuffer<'a>
{
    pub arguments: &'a[f32],
}
impl ISEvaluateFunction<'_> for ISQuantizedArrayBuffer<'_>
{
    fn evaluate
    (
        &self, current_increment: f32, current_sample: u32, current_sample_value: f32
    ) -> f32
    {
        let quantization_value = self.arguments[0];
        let n_values = (self.arguments.len() - 1) as u32;

        let current_step = js_sys::Math::floor
        (
            current_increment as f64 * quantization_value as f64
        ) as u32;

        let index = 1 + (current_step % n_values);

        self.arguments[index as usize]
    }
}

pub struct ISRamp
{
    pub ramp_start: f32,
    pub ramp_end: f32,
    pub up_end: f32,
    pub up_length: f32,
    pub down_start: f32,
    pub down_length: f32,
    pub up_exponent: f32,
    pub down_exponent: f32
}
impl ISEvaluateFunction<'_> for ISRamp
{
    fn evaluate
    (
        &self, current_increment: f32, current_sample: u32, current_sample_value: f32
    ) -> f32
    {
        let ramp_start = self.ramp_start;
        let ramp_end = self.ramp_end;
        let up_end = self.up_end;
        let up_length = self.up_length;
        let down_start = self.down_start;
        let down_length = self.down_length;
        let up_exponent = self.up_exponent;
        let down_exponent = self.down_exponent;

        let mut sample_value: f32 = 0.0;

        if current_increment < ramp_start || current_increment >= ramp_end
        {
            sample_value = 0.0;
        }
        else if current_increment >= ramp_start && current_increment <= up_end
        {
            sample_value = (current_increment - ramp_start) / up_length;
            sample_value = f32::powf(sample_value, up_exponent);
        }
        else if current_increment > up_end && current_increment < down_start
        {
            sample_value = 1.0;
        }
        else
        {
            sample_value = 1.0 - ((current_increment - down_start) / down_length);
            sample_value = f32::powf(sample_value, down_exponent);
        }

        sample_value
    }
}

pub struct ISRampBand {}
impl ISEvaluateFunction<'_> for ISRampBand
{
    fn evaluate
    (
        &self, current_increment: f32, current_sample: u32, current_sample_value: f32
    ) -> f32
    {
        1.0
    }
}

pub struct ISSawtooth
{
    pub exponent: f32,
}
impl ISEvaluateFunction<'_> for ISSawtooth
{
    fn evaluate
    (
        &self, current_increment: f32, current_sample: u32, current_sample_value: f32
    ) -> f32
    {
        f32::powf(current_increment, self.exponent)
    }
}

pub struct ISSine
{
    pub frequency: f32,
}
impl ISEvaluateFunction<'_> for ISSine
{
    fn evaluate
    (
        &self, current_increment: f32, current_sample: u32, current_sample_value: f32
    ) -> f32
    {
        f32::sin(current_increment * self.frequency * TWO_PI)
    }
}

pub struct ISSplice<'a>
{
    pub splice_buffer: &'a[f32],
    pub crop_start_sample: u32,
    pub crop_end_sample: u32,
    pub insert_start_sample: u32
}

impl ISEvaluateFunction<'_> for ISSplice<'_>
{
    fn evaluate
    (
        &self, current_increment: f32, current_sample: u32, current_sample_value: f32
    ) -> f32
    {
        if current_sample >= self.insert_start_sample
            && current_sample <= self.crop_end_sample
            && current_sample <= (self.splice_buffer.len() - 1) as u32
        {
            self.splice_buffer[current_sample as usize]
        }
        else
        {
            current_sample_value
        }
    }
}

pub struct ISSquare
{
    pub duty_cycle: f32,
}
impl ISEvaluateFunction<'_> for ISSquare
{
    fn evaluate
    (
        &self, current_increment: f32, current_sample: u32, current_sample_value: f32
    ) -> f32
    {
        if current_increment < self.duty_cycle
        {
            1.0
        }
        else
        {
            0.0
        }
    }
}

pub struct ISSuspendedOperations<'a>
{
    pub suspended_array: &'a[f32]
}
impl ISEvaluateFunction<'_> for ISSuspendedOperations<'_>
{
    fn evaluate
    (
        &self, current_increment: f32, current_sample: u32, current_sample_value: f32
    ) -> f32
    {
        if current_sample <= self.suspended_array.len() as u32
        {
            self.suspended_array[current_sample as usize] as f32
        }
        else
        {
            current_sample_value
        }
    }
}

pub struct ISTriangle
{
    pub exponent: f32
}
impl ISEvaluateFunction<'_> for ISTriangle
{
    fn evaluate
    (
        &self, current_increment: f32, current_sample: u32, current_sample_value: f32
    ) -> f32
    {
        let mut sample_value = current_increment;

        let ascending = current_increment <= 0.5;
        if ascending
        {
            sample_value = current_increment;
        }
        else
        {
            sample_value = 1.0 - current_increment;
        }

        f32::powf(sample_value, self.exponent)
    }
}

pub struct ISUnipolarNoise {}
impl ISEvaluateFunction<'_> for ISUnipolarNoise
{
    fn evaluate
    (
        &self, current_increment: f32, current_sample: u32, current_sample_value: f32
    ) -> f32
    {
        js_sys::Math::random() as f32
    }
}

pub struct ISUnipolarSine
{
    pub frequency: f32
}
impl ISEvaluateFunction<'_> for ISUnipolarSine
{
    fn evaluate
    (
        &self, current_increment: f32, current_sample: u32, current_sample_value: f32
    ) -> f32
    {
        let sample_value = f32::sin(current_increment * self.frequency * TWO_PI);
        sample_value * 0.5 + 0.5
    }
}