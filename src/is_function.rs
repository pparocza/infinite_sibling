use crate::is_buffer_function::*;

enum ISBufferFunctionType
{
    AmplitudeModulatedSine, Buffer, Constant, FrequencyModulatedSine, Impulse, InverseSawtooth,
    Noise, NoiseBand, Pulse, QuantizedArrayBuffer, Ramp, RampBand, Sawtooth, Sine, Square,
    SuspendedOperations, Triangle, UnipolarNoise, UnipolarSine, Undefined
}

pub fn is_wasm_buffer_function
(
    function_type_as_string: &str, function_arguments: &[f32]
) -> impl BufferFunction
{
    let function_type = function_type_string_to_enum(function_type_as_string);

    match function_type
    {
        /*
        ISBufferFunctionType::AmplitudeModulatedSine => {
            ISAmplitudeModulation::new(function_arguments)
        },
        */
        ISBufferFunctionType::FrequencyModulatedSine => {
            ISFrequencyModulation::new(function_arguments)
        },
        _ => { ISFrequencyModulation::new(function_arguments) }
        /*
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
         */
    }
}

fn function_type_string_to_enum(function_type: &str) -> ISBufferFunctionType
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

