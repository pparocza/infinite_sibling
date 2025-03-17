use wasm_bindgen::function_table;
use wasm_bindgen::prelude::*;
use crate::ISBufferFunctionType::
{
    AmplitudeModulatedSine, Buffer, Constant, FrequencyModulatedSine, Impulse, InverseSawtooth,
    Noise, NoiseBand, Pulse, QuantizedArrayBuffer, Ramp, RampBand, Sawtooth, Sine, Square,
    SuspendedOperations, Triangle, UnipolarNoise, UnipolarSine
};

use crate::ISBufferOperatorType::
{
    Add, Subtract, Multiply, Divide
};

enum ISBufferFunctionType
{
    AmplitudeModulatedSine, Buffer, Constant, FrequencyModulatedSine, Impulse, InverseSawtooth,
    Noise, NoiseBand, Pulse, QuantizedArrayBuffer, Ramp, RampBand, Sawtooth, Sine, Square,
    SuspendedOperations, Triangle, UnipolarNoise, UnipolarSine, Undefined
}

enum ISBufferOperatorType
{
    Add, Subtract, Multiply, Divide, Undefined
}

const TWO_PI: f32 = std::f32::consts::PI * 2.0;

#[wasm_bindgen]
extern "C"
{
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn is_wasm_buffer_operation
(
    buffer_length: i32, function_type: &str, operator_type: &str, function_arguments: &[f32]
) -> Vec<f32>
{
    let mut function_buffer: Vec<f32> = vec![0.0; buffer_length as usize];

    let time_increment: f32 = 1.0 / buffer_length as f32;
    let mut sample_index: i32 = 0;
    let mut time: f32 = 0.0;
    let mut value: f32 = 0.0;
    let function_type_enum: ISBufferFunctionType = function_type_string_to_enum(function_type);
    let operator_type_enum: ISBufferOperatorType = operator_type_string_to_enum(operator_type);

    while sample_index < buffer_length
    {
        value = is_wasm_buffer_function
        (
            &function_type_enum, time, sample_index, function_arguments
        );

        value = is_wasm_buffer_operator
        (
            &operator_type_enum, value, function_buffer[sample_index as usize]
        );

        function_buffer[sample_index as usize] = value;
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
        Add => current_sample_value + function_value,
        Subtract => current_sample_value - function_value,
        Multiply => current_sample_value * function_value,
        Divide => current_sample_value / function_value,
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
    let mut value: f32 = 0.0;

    match function_type
    {
        AmplitudeModulatedSine =>
            value = is_wasm_amplitude_modulated_sine(current_increment, function_arguments),
        Buffer =>
            value = is_wasm_buffer(current_sample, function_arguments),
        Constant =>
            value = is_wasm_constant(function_arguments),
        FrequencyModulatedSine =>
            value = is_wasm_frequency_modulated_sine
                (current_increment, function_arguments),
        Impulse =>
            value = is_wasm_impulse(current_sample),
        InverseSawtooth =>
            value = is_wasm_inverse_sawtooth(current_increment, function_arguments),
        Noise =>
            value = is_wasm_noise(),
        NoiseBand =>
            value = is_wasm_noise_band(current_increment),
        Pulse =>
            value = is_wasm_pulse(current_increment, function_arguments),
        QuantizedArrayBuffer =>
            value = is_wasm_quantized_array_buffer(current_increment, function_arguments),
        Ramp =>
            value = is_wasm_ramp(current_increment, function_arguments),
        RampBand =>
            value = is_wasm_ramp_band(current_increment),
        Sawtooth =>
            value = is_wasm_sawtooth(current_increment, function_arguments),
        Sine =>
            value = is_wasm_sine(current_increment, function_arguments),
        Square =>
            value = is_wasm_square(current_increment, function_arguments),
        SuspendedOperations =>
            value = is_wasm_suspended_operations(current_sample),
        Triangle =>
            value = is_wasm_triangle(current_increment, function_arguments),
        UnipolarNoise =>
            value = is_wasm_unipolar_noise(),
        UnipolarSine =>
            value = is_wasm_unipolar_sine(current_increment, function_arguments),
        ISBufferFunctionType::Undefined => value = 0.0,
    }
    value
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

// TODO: Figure this out
pub fn is_wasm_buffer(current_sample: i32, function_arguments: &[f32]) -> f32 { 1.0 + 0.0 }

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
    let value = f32::sin(current_increment * modulated_frequency_value * TWO_PI);

    value
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

// TODO: figure out random number generation
pub fn is_wasm_noise() -> f32 { 1.0 + 0.0 }
pub fn is_wasm_noise_band(current_increment: f32) -> f32 { 1.0 + 0.0 }

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

// TODO: function_arguments currently can hold only f32's, and this requires arbitrary arguments
pub fn is_wasm_quantized_array_buffer(current_increment: f32, function_arguments: &[f32]) -> f32
{
    /*
    let value_array = function_arguments[0];
    let quantization_value = function_arguments[1];

    let current_step = Math.floor(currentIncrement * quantizationValue);
    let index = current_step % value_array.length;

    valueArray[index]
     */

    1.0 + 0.0
}

pub fn is_wasm_ramp(current_increment: f32, function_arguments: &[f32]) -> f32
{
    1.0 + 0.0
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

    if (current_increment < duty_cycle)
    {
        1.0
    }
    else
    {
        0.0
    }
}

// TODO: figure this out
pub fn is_wasm_suspended_operations(current_sample: i32) -> f32 { 1.0 + 0.0 }

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

    f32::powf(current_increment, exponent)
}

// TODO: figure out rng
pub fn is_wasm_unipolar_noise() -> f32 { 1.0 + 0.0 }

pub fn is_wasm_unipolar_sine(current_increment: f32, function_arguments: &[f32]) -> f32
{
    let time = current_increment;
    let frequency = function_arguments[0];
    let value = f32::sin(time * frequency * TWO_PI);

    value * 0.5 + 0.5
}

pub fn function_type_string_to_enum(function_type: &str) -> ISBufferFunctionType
{
    match function_type
    {
        "amplitudemodulatedsine" => AmplitudeModulatedSine,
        "buffer" => Buffer,
        "constant" => Constant,
        "frequencymodulatedsine" => FrequencyModulatedSine,
        "impulse" => Impulse,
        "inversesawtooth" => InverseSawtooth,
        "noise" => Noise,
        "noiseband" => NoiseBand,
        "pulse" => Pulse,
        "quantizedarraybuffer" => QuantizedArrayBuffer,
        "ramp" => Ramp,
        "rampband" => RampBand,
        "sawtooth" => Sawtooth,
        "sine" => Sine,
        "square" => Square,
        "suspendedoperations" => SuspendedOperations,
        "triangle" => Triangle,
        "unipolarnoise" => UnipolarNoise,
        "unipolarsine" => UnipolarSine,
        _ => {ISBufferFunctionType::Undefined}
    }
}

pub fn operator_type_string_to_enum(operator_type: &str) -> ISBufferOperatorType
{
    match operator_type
    {
        "add" => Add,
        "divide" => Divide,
        "multiply" => Multiply,
        "subtract" => Subtract,
        _ => {ISBufferOperatorType::Undefined}
    }
}


