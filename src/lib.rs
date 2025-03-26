use wasm_bindgen::prelude::*;
use crate::is_buffer_function::*;
use crate::is_function::*;
use crate::is_operator::*;

mod is_function;
mod is_operator;
mod is_buffer_function;

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
    function_type_as_string: &str, operator_type_as_string: &str,
    buffer_length: u32, buffer_id: u32, function_arguments: &[f32]
) -> Vec<f32>
{
    let operation_request = OperationRequestData::new
    (
        function_type_as_string, operator_type_as_string, buffer_length, function_arguments
    );

    let mut function_buffer: Vec<f32> = Vec::new();

    let time_increment: f32 = 1.0 / buffer_length as f32;
    let mut current_sample: u32 = 0;
    let mut current_increment: f32 = 0.0;
    let mut function_value: f32 = 0.0;
    let mut sample_value: f32 = 0.0;
    let mut current_array_value: f32 = 0.0;

    let buffer_function = &is_function::is_wasm_buffer_function
    (
        operation_request.function_type, &operation_request.function_arguments
    );

    let operator = &is_operator::is_wasm_buffer_operator
    (
        operation_request.operator_type
    );

    while current_sample < operation_request.buffer_length_in_samples
    {
        current_array_value = 0.0;
        // current_array_value = current_buffer_array[current_sample as usize];

        function_value = buffer_function.evaluate(current_increment, current_sample);
        sample_value = operator.operate(current_array_value, function_value);

        function_buffer.push(sample_value);
        current_increment = current_increment + time_increment;
        current_sample = current_sample + 1;
    }

    function_buffer
}

struct OperationRequestData
{
    pub function_type: ISBufferFunctionType,
    pub operator_type: ISBufferOperatorType,
    pub function_arguments: Vec<f32>,
    // Ultimately this should be in a hashtable with the buffer id
    pub buffer_length_in_samples: u32
}

impl OperationRequest for OperationRequestData
{
    fn new
    (
        function_type_as_string: &str, operator_type_as_string: &str,
        buffer_length_in_samples: u32, function_arguments: &[f32]
    ) -> OperationRequestData
    {
        OperationRequestData
        {
            function_type: function_type_string_to_enum(function_type_as_string),
            operator_type: operator_type_string_to_enum(operator_type_as_string),
            buffer_length_in_samples: buffer_length_in_samples,
            function_arguments: function_arguments.to_vec()
        }
    }
}

pub trait OperationRequest
{
    fn new
    (
        function_type_as_string: &str, operator_type_as_string: &str,
        buffer_length_in_samples: u32, function_arguments: &[f32]
    ) -> OperationRequestData;
}

