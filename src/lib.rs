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

// TODO: would be really nice to put this in a separate file (crate?)
#[wasm_bindgen(module ="/modules/types/buffer/operation/workers/IS_WASMOperationData.js")]
extern "C"
{
    type IS_WASMOperationData;

    #[wasm_bindgen(constructor)]
    fn new() -> IS_WASMOperationData;

    #[wasm_bindgen(method, getter)]
    fn operatorType(this: &IS_WASMOperationData) -> String;

    #[wasm_bindgen(method, getter)]
    fn functionType(this: &IS_WASMOperationData) -> String;

    #[wasm_bindgen(method, getter)]
    fn functionArgs(this: &IS_WASMOperationData) -> Vec<f32>;

    #[wasm_bindgen(method, getter)]
    fn isSuspendedOperation(this: &IS_WASMOperationData) -> bool;
}

#[wasm_bindgen]
pub fn is_wasm_buffer_operation
(
    buffer_length: u32, operations: Vec<IS_WASMOperationData>
) -> Vec<f32>
{
    let mut function_buffer: Vec<f32> = vec![0.0; buffer_length as usize];
    let n_operations = operations.len();

    for operation_index in 0..n_operations
    {
        let operation = &operations[operation_index];

        let operation_request = OperationRequestData::new
        (
            operation.functionType().as_str(),
            operation.operatorType().as_str(),
            operation.functionArgs()
        );

        operate(buffer_length, operation_request, &mut function_buffer);
    }

    function_buffer
}

fn operate
(
    buffer_length: u32,
    operation_request: OperationRequestData,
    function_buffer: &mut Vec<f32>
)
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

    while current_sample < buffer_length
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
    pub function_arguments: Vec<f32>
}

impl OperationRequest for OperationRequestData
{
    fn new
    (
        function_type_as_string: &str,
        operator_type_as_string: &str,
        function_arguments: Vec<f32>
    ) -> OperationRequestData
    {
        OperationRequestData
        {
            function_type: function_type_string_to_enum(function_type_as_string),
            operator_type: operator_type_string_to_enum(operator_type_as_string),
            function_arguments: function_arguments
        }
    }
}

pub trait OperationRequest
{
    fn new
    (
        function_type_as_string: &str,
        operator_type_as_string: &str,
        function_arguments: Vec<f32>
    ) -> OperationRequestData;
}

