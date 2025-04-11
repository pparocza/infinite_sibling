use wasm_bindgen::prelude::*;
use crate::is_function::*;
use crate::is_operator::*;
use crate::is_buffer_function::*;
use crate::is_operation_request_data::*;
use crate::is_wasm_operation_data::*;
use crate::is_log::*;

mod is_function;
mod is_operator;
mod is_buffer_function;
mod is_operation_request_data;
mod is_wasm_operation_data;
mod is_log;

const TWO_PI: f32 = std::f32::consts::PI * 2.0;

#[wasm_bindgen]
pub fn is_wasm_buffer_operation
(
    buffer_length: u32, operations: Vec<IS_WASMOperationData>
) -> Vec<f32>
{
    let mut function_buffer: Vec<f32> = vec![0.0; buffer_length as usize];
    let mut suspension_buffer: Vec<f32> = vec![0.0; buffer_length as usize];

    let n_operations = operations.len();

    for operation_index in 0..n_operations
    {
        let operation = &operations[operation_index];

        let mut operation_request = OperationRequestData::new
        (
            operation.functionType().as_str(),
            operation.operatorType().as_str(),
            operation.functionArgs()
        );

        if operation.isSuspendedOperation()
        {
            operate(buffer_length, operation_request, &mut suspension_buffer);
        }
        else
        {
            if operation.functionType() == "suspendedoperations"
            {
                operation_request.function_arguments = suspension_buffer;

                operate(buffer_length, operation_request, &mut function_buffer);
                suspension_buffer = vec![0.0; buffer_length as usize];
            }
            else
            {
                operate(buffer_length, operation_request, &mut function_buffer);
            }
        }
    }

    function_buffer
}

fn operate
(
    buffer_length: u32,
    operation_request: OperationRequestData,
    buffer_to_operate_on: &mut Vec<f32>
)
{
    let time_increment: f32 = 1.0 / buffer_to_operate_on.len() as f32;
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
        current_array_value = buffer_to_operate_on[current_sample as usize];

        function_value = buffer_function.evaluate(current_increment, current_sample);
        sample_value = operator.operate(current_array_value, function_value);

        buffer_to_operate_on[current_sample as usize] = sample_value;
        current_increment = current_increment + time_increment;
        current_sample = current_sample + 1;
    }
}

