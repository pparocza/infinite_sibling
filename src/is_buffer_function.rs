use crate::TWO_PI;

pub trait BufferFunction
{
    fn new(function_arguments: &[f32]) -> Self;
    fn evaluate(&self, current_increment: f32, current_sample: i32) -> f32;
}

// TODO: You might be able to gain some pretty substantial speed by operation on all of these as
//  ints/byte values instead of as floats


fn is_wasm_buffer(current_sample: i32, function_arguments: &[f32]) -> f32
{
    if current_sample <= function_arguments.len() as i32
    {
        function_arguments[current_sample as usize] as f32
    }
    else
    {
        0.0
    }
}

fn is_wasm_constant(function_arguments: &[f32]) -> f32
{
    // TODO: this can just create an array all initialized to that value instead of being
    //  part of the loop
    function_arguments[0]
}

fn is_wasm_impulse(current_sample: i32) -> f32
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

fn is_wasm_inverse_sawtooth(current_increment: f32, function_arguments: &[f32]) -> f32
{
    let exponent = function_arguments[0];

    f32::powf(1.0 - current_increment, exponent)
}

fn is_wasm_noise() -> f32
{
    let mut sample_value = js_sys::Math::random() as f32;
    (sample_value * 2.0) - 1.0
}

// TODO: The function arguments from JS contain arrays, and function_arguments is an array
//  of floats
fn is_wasm_noise_band(current_increment: f32, function_arguments: &[f32]) -> f32
{
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

fn is_wasm_pulse(current_increment: f32, function_arguments: &[f32]) -> f32
{
    let pulse_start_percent = function_arguments[0];
    let pulse_end_percent = function_arguments[1];
    let in_cycle_bounds = current_increment >= pulse_start_percent &&
        current_increment <= pulse_end_percent;

    if in_cycle_bounds
    {
        1.0
    }
    else
    {
        0.0
    }
}

// TODO: make this a bit less hacky (currently relies on the order of the arguments which
//  leads to a kinda clunky)
fn is_wasm_quantized_array_buffer(current_increment: f32, function_arguments: &[f32]) -> f32
{
    let quantization_value = function_arguments[0];
    let n_values = (function_arguments.len() - 1) as i32;

    let current_step = js_sys::Math::floor
        (
            current_increment as f64 * quantization_value as f64
        ) as i32;

    let index = 1 + (current_step % n_values);

    function_arguments[index as usize]
}

fn is_wasm_ramp(current_increment: f32, function_arguments: &[f32]) -> f32
{
    let ramp_start = function_arguments[0];
    let ramp_end = function_arguments[1];
    let up_end = function_arguments[2];
    let up_length = function_arguments[3];
    let down_start = function_arguments[4];
    let down_length = function_arguments[5];
    let up_exponent = function_arguments[6];
    let down_exponent = function_arguments[7];

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

// TODO: figure out what this even is
fn is_wasm_ramp_band(current_increment: f32) -> f32 { 1.0 + 0.0 }

fn is_wasm_sawtooth(current_increment: f32, function_arguments: &[f32]) -> f32
{
    let exponent = function_arguments[0];

    f32::powf(current_increment, exponent)
}

fn is_wasm_sine(current_increment: f32, function_arguments: &[f32]) -> f32
{
    let time = current_increment;
    let frequency = function_arguments[0];

    f32::sin(time * frequency * TWO_PI)
}

fn is_wasm_square(current_increment: f32, function_arguments: &[f32]) -> f32
{
    let duty_cycle = function_arguments[0];

    if current_increment < duty_cycle
    {
        1.0
    }
    else
    {
        0.0
    }
}

fn is_wasm_suspended_operations(current_sample: i32, function_arguments: &[f32]) -> f32
{
    if current_sample <= function_arguments.len() as i32
    {
        function_arguments[current_sample as usize] as f32
    }
    else
    {
        0.0
    }
}

fn is_wasm_triangle(current_increment: f32, function_arguments: &[f32]) -> f32
{
    let exponent = function_arguments[0];
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

    f32::powf(sample_value, exponent)
}

fn is_wasm_unipolar_noise() -> f32
{
    js_sys::Math::random() as f32
}

fn is_wasm_unipolar_sine(current_increment: f32, function_arguments: &[f32]) -> f32
{
    let time = current_increment;
    let frequency = function_arguments[0];
    let sample_value = f32::sin(time * frequency * TWO_PI);

    sample_value * 0.5 + 0.5
}

pub struct ISAmplitudeModulation
{
    carrier_frequency: f32,
    modulator_frequency: f32,
    modulator_gain: f32
}

impl BufferFunction for ISAmplitudeModulation
{
    fn new(function_arguments: &[f32]) -> Self
    {
        Self
        {
            carrier_frequency: function_arguments[0],
            modulator_frequency: function_arguments[1],
            modulator_gain: function_arguments[2]
        }
    }

    fn evaluate(&self, current_increment: f32, current_sample: i32) -> f32
    {
        let modulator_amplitude = self.modulator_gain *
            f32::sin(self.modulator_frequency * current_increment * TWO_PI);

        let carrier_amplitude =
            f32::sin(self.carrier_frequency * current_increment * TWO_PI);

        modulator_amplitude * carrier_amplitude
    }
}

pub struct ISFrequencyModulation
{
    carrier_frequency: f32,
    modulator_frequency: f32,
    modulator_gain: f32
}

impl BufferFunction for ISFrequencyModulation
{
    fn new(function_arguments: &[f32]) -> Self
    {
        Self
        {
            carrier_frequency: function_arguments[0],
            modulator_frequency: function_arguments[1],
            modulator_gain: function_arguments[2]
        }
    }

    fn evaluate(&self, current_increment: f32, current_sample: i32) -> f32
    {
        let modulation_value = self.modulator_gain *
            f32::sin(current_increment * self.modulator_frequency * TWO_PI);

        let modulated_frequency_value = self.carrier_frequency + modulation_value;
        let sample_value = f32::sin(current_increment * modulated_frequency_value * TWO_PI);

        sample_value
    }
}