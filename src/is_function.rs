use crate::is_buffer_function::*;

pub fn is_wasm_buffer_function<'a>
(
    function_type_as_string: &str, function_arguments: &'a[f32]
) -> Box<dyn ISEvaluateFunction<'a> + 'a>
{
    let function_type = function_type_string_to_enum(function_type_as_string);

    match function_type
    {
        ISBufferFunctionType::AmplitudeModulatedSine =>
        {
            Box::new
            (
                ISAmplitudeModulatedSine
                {
                    carrier_frequency: function_arguments[0],
                    modulator_frequency: function_arguments[1],
                    modulator_gain: function_arguments[2],
                }
            )
        },

        ISBufferFunctionType::Buffer =>
        {
            Box::new(ISBufferAsFunction { buffer_function: function_arguments } )
        }

        ISBufferFunctionType::Constant =>
        {
            Box::new(ISConstant{ value: function_arguments[0] })
        }

        ISBufferFunctionType::FrequencyModulatedSine =>
        {
            Box::new
            (
                ISFrequencyModulatedSine
                {
                    carrier_frequency: function_arguments[0],
                    modulator_frequency: function_arguments[1],
                    modulator_gain: function_arguments[2],
                }
            )
        },

        ISBufferFunctionType::Impulse => { Box::new(ISImpulse {} ) }

        ISBufferFunctionType::InverseSawtooth =>
        {
            Box::new(ISInverseSawtooth{ exponent: function_arguments[0] } )
        },

        ISBufferFunctionType::Noise => { Box::new(ISNoise {} ) },

        ISBufferFunctionType::NoiseBand => { Box::new(ISNoiseBand {} ) },

        ISBufferFunctionType::Pulse =>
        {
            Box::new
            (
                ISPulse
                {
                    pulse_start_percent: function_arguments[0],
                    pulse_end_percent: function_arguments[1]
                }
            )
        },

        ISBufferFunctionType::QuantizedArrayBuffer =>
        {
            Box::new(ISQuantizedArrayBuffer { arguments: function_arguments } )
        },

        ISBufferFunctionType::Ramp =>
        {
            Box::new
            (
                ISRamp
                {
                    ramp_start: function_arguments[0],
                    ramp_end: function_arguments[1],
                    up_end: function_arguments[2],
                    up_length: function_arguments[3],
                    down_start: function_arguments[4],
                    down_length: function_arguments[5],
                    up_exponent: function_arguments[6],
                    down_exponent: function_arguments[7]
                }
            )
        },

        ISBufferFunctionType::RampBand => { Box::new(ISRampBand {} ) },

        ISBufferFunctionType::Sawtooth =>
        {
            Box::new
            (
                ISSawtooth
                {
                    exponent: function_arguments[0],
                }
            )
        },

        ISBufferFunctionType::Sine => { Box::new(ISSine { frequency: function_arguments[0] } ) },

        ISBufferFunctionType::Square =>
        {
            Box::new
            (
                ISSquare
                {
                    duty_cycle: function_arguments[0]
                }
            )
        },

        ISBufferFunctionType::SuspendedOperations =>
        {
            Box::new(ISSuspendedOperations { suspended_array: function_arguments } )
        }

        ISBufferFunctionType::Triangle =>
        {
            Box::new(ISTriangle { exponent: function_arguments[0] } )
        },

        ISBufferFunctionType::UnipolarNoise => { Box::new(ISUnipolarNoise {} ) },

        ISBufferFunctionType::UnipolarSine =>
        {
            Box::new(ISSine { frequency: function_arguments[0] })
        }

        _ => { Box::new(ISConstant { value: 0.0 }) }
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

