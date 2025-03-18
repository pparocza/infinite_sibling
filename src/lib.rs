mod function_type;
mod operator_type;

use wasm_bindgen::prelude::*;
use crate::function_type::ISBufferFunctionType;
use crate::operator_type::ISBufferOperatorType;

const TWO_PI: f32 = std::f32::consts::PI * 2.0;

#[wasm_bindgen]
extern "C"
{
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

// TODO: Anti-aliasing (sawooth, square)
// TODO: Fast Sine

#[wasm_bindgen]
pub fn is_wasm_buffer_operation
(
    current_buffer_array: &[f32], function_type: &str, operator_type: &str, function_arguments: &[f32]
) -> Vec<f32>
{
    let buffer_length = current_buffer_array.len() as i32;
    let mut function_buffer: Vec<f32> = Vec::new();

    let time_increment: f32 = 1.0 / buffer_length as f32;
    let mut sample_index: i32 = 0;
    let mut time: f32 = 0.0;
    let mut function_value: f32 = 0.0;
    let mut sample_value: f32 = 0.0;
    let mut current_array_value: f32 = 0.0;
    let function_type_enum: ISBufferFunctionType = function_type_string_to_enum(function_type);
    let operator_type_enum: ISBufferOperatorType = operator_type_string_to_enum(operator_type);

    while sample_index < buffer_length
    {
        function_value = is_wasm_buffer_function
        (
            &function_type_enum, time, sample_index, function_arguments
        );

        current_array_value = current_buffer_array[sample_index as usize];

        sample_value = is_wasm_buffer_operator
        (
            &operator_type_enum, current_array_value, function_value
        );

        function_buffer.push(sample_value);
        time = time + time_increment;
        sample_index = sample_index + 1;
    }

    function_buffer
}

pub fn is_wasm_buffer_operator
(
    operator_type: &ISBufferOperatorType, current_sample_value: f32, function_value: f32
) -> f32
{
    match operator_type
    {
        ISBufferOperatorType::Add => current_sample_value + function_value,
        ISBufferOperatorType::Subtract => current_sample_value - function_value,
        ISBufferOperatorType::Multiply => current_sample_value * function_value,
        ISBufferOperatorType::Divide => current_sample_value / function_value,
        ISBufferOperatorType::Undefined => 0.0,
    }
}

pub fn is_wasm_buffer_function
(
    function_type: &ISBufferFunctionType,
    current_increment: f32, current_sample: i32,
    function_arguments: &[f32]
) -> f32
{
    let mut sample_value: f32 = 0.0;

    match function_type
    {
        ISBufferFunctionType::AmplitudeModulatedSine =>
            sample_value = is_wasm_amplitude_modulated_sine(current_increment, function_arguments),
        ISBufferFunctionType::Buffer =>
            sample_value = is_wasm_buffer(current_sample, function_arguments),
        ISBufferFunctionType::Constant =>
            sample_value = is_wasm_constant(function_arguments),
        ISBufferFunctionType::FrequencyModulatedSine =>
            sample_value = is_wasm_frequency_modulated_sine
                (current_increment, function_arguments),
        ISBufferFunctionType::Impulse =>
            sample_value = is_wasm_impulse(current_sample),
        ISBufferFunctionType::InverseSawtooth =>
            sample_value = is_wasm_inverse_sawtooth(current_increment, function_arguments),
        ISBufferFunctionType::Noise =>
            sample_value = is_wasm_noise(),
        ISBufferFunctionType::NoiseBand =>
            sample_value = is_wasm_noise_band(current_increment, function_arguments),
        ISBufferFunctionType::Pulse =>
            sample_value = is_wasm_pulse(current_increment, function_arguments),
        ISBufferFunctionType::QuantizedArrayBuffer =>
            sample_value = is_wasm_quantized_array_buffer(current_increment, function_arguments),
        ISBufferFunctionType::Ramp =>
            sample_value = is_wasm_ramp(current_increment, function_arguments),
        ISBufferFunctionType::RampBand =>
            sample_value = is_wasm_ramp_band(current_increment),
        ISBufferFunctionType::Sawtooth =>
            sample_value = is_wasm_sawtooth(current_increment, function_arguments),
        ISBufferFunctionType::Sine =>
            sample_value = is_wasm_sine(current_increment, function_arguments),
        ISBufferFunctionType::Square =>
            sample_value = is_wasm_square(current_increment, function_arguments),
        ISBufferFunctionType::SuspendedOperations =>
            sample_value = is_wasm_suspended_operations(current_sample, function_arguments),
        ISBufferFunctionType::Triangle =>
            sample_value = is_wasm_triangle(current_increment, function_arguments),
        ISBufferFunctionType::UnipolarNoise =>
            sample_value = is_wasm_unipolar_noise(),
        ISBufferFunctionType::UnipolarSine =>
            sample_value = is_wasm_unipolar_sine(current_increment, function_arguments),
        ISBufferFunctionType::Undefined => sample_value = 0.0,
    }
    sample_value
}

// TODO: You might be able to gain some pretty substantial speed by operation on all of these as
//  ints/byte values instead of as floats
pub fn is_wasm_amplitude_modulated_sine(current_increment: f32, function_arguments: &[f32]) -> f32
{
    let time = current_increment;

    let carrier_frequency = function_arguments[0];
    let modulator_frequency = function_arguments[1];
    let modulator_gain = function_arguments[2];

    let modulator_amplitude = modulator_gain * f32::sin(modulator_frequency * time * TWO_PI);
    let carrier_amplitude = f32::sin(carrier_frequency * time * TWO_PI);

    modulator_amplitude * carrier_amplitude
}

pub fn is_wasm_buffer(current_sample: i32, function_arguments: &[f32]) -> f32
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

pub fn is_wasm_constant(function_arguments: &[f32]) -> f32
{
    // TODO: this can just create an array all initialized to that value instead of being
    //  part of the loop
    function_arguments[0]
}

pub fn is_wasm_frequency_modulated_sine(current_increment: f32, function_arguments: &[f32]) -> f32
{
    let carrier_frequency = function_arguments[0];
    let modulator_frequency = function_arguments[1];
    let modulator_gain = function_arguments[2];

    let modulation_value = modulator_gain *
        f32::sin(current_increment * modulator_frequency * TWO_PI);

    let modulated_frequency_value = carrier_frequency + modulation_value;
    let sample_value = f32::sin(current_increment * modulated_frequency_value * TWO_PI);

    sample_value
}

pub fn is_wasm_impulse(current_sample: i32) -> f32
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

pub fn is_wasm_inverse_sawtooth(current_increment: f32, function_arguments: &[f32]) -> f32
{
    let exponent = function_arguments[0];

    f32::powf(1.0 - current_increment, exponent)
}

pub fn is_wasm_noise() -> f32
{
    let mut sample_value = js_sys::Math::random() as f32;
    (sample_value * 2.0) - 1.0
}

// TODO: The function arguments from JS contain arrays, and function_arguments is an array
//  of floats
pub fn is_wasm_noise_band(current_increment: f32, function_arguments: &[f32]) -> f32
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

pub fn is_wasm_pulse(current_increment: f32, function_arguments: &[f32]) -> f32
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
pub fn is_wasm_quantized_array_buffer(current_increment: f32, function_arguments: &[f32]) -> f32
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

pub fn is_wasm_ramp(current_increment: f32, function_arguments: &[f32]) -> f32
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

    if (current_increment < ramp_start || current_increment >= ramp_end)
    {
        sample_value = 0.0;
    }
    else if (current_increment >= ramp_start && current_increment <= up_end)
    {
        sample_value = (current_increment - ramp_start) / up_length;
        sample_value = f32::powf(sample_value, up_exponent);
    }
    else if (current_increment > up_end && current_increment < down_start)
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
pub fn is_wasm_ramp_band(current_increment: f32) -> f32 { 1.0 + 0.0 }

pub fn is_wasm_sawtooth(current_increment: f32, function_arguments: &[f32]) -> f32
{
    let exponent = function_arguments[0];

    f32::powf(current_increment, exponent)
}

pub fn is_wasm_sine(current_increment: f32, function_arguments: &[f32]) -> f32
{
    let time = current_increment;
    let frequency = function_arguments[0];

    f32::sin(time * frequency * TWO_PI)
}

pub fn is_wasm_square(current_increment: f32, function_arguments: &[f32]) -> f32
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

pub fn is_wasm_suspended_operations(current_sample: i32, function_arguments: &[f32]) -> f32
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

pub fn is_wasm_triangle(current_increment: f32, function_arguments: &[f32]) -> f32
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

pub fn is_wasm_unipolar_noise() -> f32
{
    js_sys::Math::random() as f32
}

pub fn is_wasm_unipolar_sine(current_increment: f32, function_arguments: &[f32]) -> f32
{
    let time = current_increment;
    let frequency = function_arguments[0];
    let sample_value = f32::sin(time * frequency * TWO_PI);

    sample_value * 0.5 + 0.5
}

pub fn function_type_string_to_enum(function_type: &str) -> ISBufferFunctionType
{
    match function_type
    {
        "amplitudemodulatedsine" => ISBufferFunctionType::AmplitudeModulatedSine,
        "buffer" => ISBufferFunctionType::Buffer,
        "constant" => ISBufferFunctionType::Constant,
        "frequencymodulatedsine" => ISBufferFunctionType::FrequencyModulatedSine,
        "impulse" => ISBufferFunctionType::Impulse,
        "inversesawtooth" => ISBufferFunctionType::InverseSawtooth,
        "noise" => ISBufferFunctionType::Noise,
        "noiseband" => ISBufferFunctionType::NoiseBand,
        "pulse" => ISBufferFunctionType::Pulse,
        "quantizedarraybuffer" => ISBufferFunctionType::QuantizedArrayBuffer,
        "ramp" => ISBufferFunctionType::Ramp,
        "rampband" => ISBufferFunctionType::RampBand,
        "sawtooth" => ISBufferFunctionType::Sawtooth,
        "sine" => ISBufferFunctionType::Sine,
        "square" => ISBufferFunctionType::Square,
        "suspendedoperations" => ISBufferFunctionType::SuspendedOperations,
        "triangle" => ISBufferFunctionType::Triangle,
        "unipolarnoise" => ISBufferFunctionType::UnipolarNoise,
        "unipolarsine" => ISBufferFunctionType::UnipolarSine,
        _ => {ISBufferFunctionType::Undefined}
    }
}

pub fn operator_type_string_to_enum(operator_type: &str) -> ISBufferOperatorType
{
    match operator_type
    {
        "add" => ISBufferOperatorType::Add,
        "divide" => ISBufferOperatorType::Divide,
        "multiply" => ISBufferOperatorType::Multiply,
        "subtract" => ISBufferOperatorType::Subtract,
        _ => {ISBufferOperatorType::Undefined}
    }
}


