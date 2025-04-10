use std::env::args;
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
    buffer_length: u32,
    function_type_as_string: &str, operator_type_as_string: &str,
    function_arguments: &[f32], argument_slice_data: &[u32]
) -> Vec<f32>
{
    let function_type_iter = function_type_as_string.lines();
    let operator_type_iter = operator_type_as_string.lines();

    let mut function_types: Vec<&str> = Vec::new();
    let mut operator_types: Vec<&str> = Vec::new();
    let mut argument_slices: Vec<Vec<f32>> = Vec::new();

    for function_type in function_type_iter
    {
        function_types.push(function_type);
    }

    for operator_type in operator_type_iter
    {
        operator_types.push(operator_type);
    }

    for argument_slice_index in 0..argument_slice_data.len() / 2
    {
        let index = argument_slice_index * 2;
        let slice_offset = argument_slice_data[index];
        let slice_length = argument_slice_data[index + 1];
        let slice_start = slice_offset;
        let slice_end = slice_offset + slice_length;

        let mut arg_vec: Vec<f32> = Vec::new();

        for argument_index in slice_start..slice_end
        {
            arg_vec.push(function_arguments[argument_index as usize]);
        }

        argument_slices.push(arg_vec);
    }

    let mut function_buffer: Vec<f32> = vec![0.0; buffer_length as usize];

    for operation_index in 0..function_types.len()
    {
        let operation_request = OperationRequestData::new
        (
            function_types[operation_index],
            operator_types[operation_index],
            buffer_length,
            &argument_slices[operation_index]
        );

        operate(operation_request, &mut function_buffer);
    }

    function_buffer
}

fn operate(operation_request: OperationRequestData, function_buffer: &mut Vec<f32>)
{
    let time_increment: f32 = 1.0 / function_buffer.len() as f32;
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
        current_array_value = function_buffer[current_sample as usize];

        function_value = buffer_function.evaluate(current_increment, current_sample);
        sample_value = operator.operate(current_array_value, function_value);

        function_buffer[current_sample as usize] = sample_value;
        current_increment = current_increment + time_increment;
        current_sample = current_sample + 1;
    }
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

