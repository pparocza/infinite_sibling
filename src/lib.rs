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
    SuspendedOperations, Triangle, UnipolarNoise, UnipolarSine
}

enum ISBufferOperatorType
{
    Add, Subtract, Multiply, Divide
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

    while sample_index < buffer_length
    {
        value = is_wasm_buffer_function
        (
            /*function_type*/ FrequencyModulatedSine, time, sample_index, function_arguments
        );

        value = is_wasm_buffer_operator
        (
            /*operator_type*/ Add, value, function_buffer[sample_index as usize]
        );

        function_buffer[sample_index as usize] = value;
        time = time + time_increment;
        sample_index = sample_index + 1;
    }

    function_buffer
}

pub fn is_wasm_buffer_operator
(
    operator_type: ISBufferOperatorType, current_sample_value: f32, function_value: f32
) -> f32
{
    match operator_type
    {
        Add => current_sample_value + function_value,
        Subtract => current_sample_value - function_value,
        Multiply => current_sample_value * function_value,
        Divide => current_sample_value / function_value,
    }
}

pub fn is_wasm_buffer_function
(
    function_type: ISBufferFunctionType,
    current_increment: f32, current_sample: i32,
    function_arguments: &[f32]
) -> f32
{
    let mut value: f32 = 0.0;

    match function_type
    {
        AmplitudeModulatedSine =>
            value = is_wasm_amplitude_modulated_sine(current_increment),
        Buffer =>
            value = is_wasm_buffer(current_sample),
        Constant =>
            value = is_wasm_constant(),
        FrequencyModulatedSine =>
            value = is_wasm_frequency_modulated_sine
                (current_increment, function_arguments),
        Impulse =>
            value = is_wasm_impulse(),
        InverseSawtooth =>
            value = is_wasm_inverse_sawtooth(current_increment),
        Noise =>
            value = is_wasm_noise(),
        NoiseBand =>
            value = is_wasm_noise_band(current_increment),
        Pulse =>
            value = is_wasm_pulse(current_increment),
        QuantizedArrayBuffer =>
            value = is_wasm_quantized_array_buffer(current_increment),
        Ramp =>
            value = is_wasm_ramp(current_increment),
        RampBand =>
            value = is_wasm_ramp_band(current_increment),
        Sawtooth =>
            value = is_wasm_sawtooth(current_increment),
        Sine =>
            value = is_wasm_sine(current_increment),
        Square =>
            value = is_wasm_square(current_increment),
        SuspendedOperations =>
            value = is_wasm_suspended_operations(current_sample),
        Triangle =>
            value = is_wasm_triangle(current_increment),
        UnipolarNoise =>
            value = is_wasm_unipolar_noise(),
        UnipolarSine =>
            value = is_wasm_unipolar_sine(current_increment),
    }
    value
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

pub fn is_wasm_amplitude_modulated_sine(current_increment: f32) -> f32
{ 1.0 + 0.0 }
pub fn is_wasm_buffer(current_sample: i32) -> f32 { 1.0 + 0.0 }
pub fn is_wasm_constant() -> f32 { 1.0 + 0.0 }
pub fn is_wasm_impulse() -> f32 { 1.0 + 0.0 }
pub fn is_wasm_inverse_sawtooth(current_increment: f32) -> f32 { 1.0 + 0.0 }
pub fn is_wasm_noise() -> f32 { 1.0 + 0.0 }
pub fn is_wasm_noise_band(current_increment: f32) -> f32 { 1.0 + 0.0 }
pub fn is_wasm_pulse(current_increment: f32) -> f32 { 1.0 + 0.0 }
pub fn is_wasm_quantized_array_buffer(current_increment: f32) -> f32 { 1.0 + 0.0 }
pub fn is_wasm_ramp(current_increment: f32) -> f32 { 1.0 + 0.0 }
pub fn is_wasm_ramp_band(current_increment: f32) -> f32 { 1.0 + 0.0 }
pub fn is_wasm_sawtooth(current_increment: f32) -> f32 { 1.0 + 0.0 }
pub fn is_wasm_sine(current_increment: f32) -> f32 { 1.0 + 0.0 }
pub fn is_wasm_square(current_increment: f32) -> f32 { 1.0 + 0.0 }
pub fn is_wasm_suspended_operations(current_sample: i32) -> f32 { 1.0 + 0.0 }
pub fn is_wasm_triangle(current_increment: f32) -> f32 { 1.0 + 0.0 }
pub fn is_wasm_unipolar_noise() -> f32 { 1.0 + 0.0 }
pub fn is_wasm_unipolar_sine(current_increment: f32) -> f32 { 1.0 + 0.0 }


