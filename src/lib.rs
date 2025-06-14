use std::f32;
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
            operation.functionArgs(),
            operation.otherBuffer()
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
            else if operation.functionType() == "movingaverage"
            {
                moving_average(buffer_length, operation_request, &mut function_buffer);
            }
            else if operation.functionType() == "splice"
            {
                splice(buffer_length, operation_request, &mut function_buffer);
            }
            else if operation.functionType() == "normalize"
            {
                normalize(buffer_length, operation_request, &mut function_buffer);
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
    let mut current_sample_value: f32 = 0.0;

    let buffer_function = &is_function::is_wasm_buffer_function
    (
        operation_request.function_type,
        &operation_request.function_arguments,
        &operation_request.other_buffer
    );

    let operator = &is_operator::is_wasm_buffer_operator
    (
        operation_request.operator_type
    );

    while current_sample < buffer_length
    {
        current_sample_value = buffer_to_operate_on[current_sample as usize];

        function_value = buffer_function.evaluate
        (
            current_increment, current_sample, current_sample_value
        );

        sample_value = operator.operate(current_sample_value, function_value);

        buffer_to_operate_on[current_sample as usize] = sample_value;
        current_increment = current_increment + time_increment;
        current_sample = current_sample + 1;
    }
}

fn moving_average
(
    buffer_length: u32,
    operation_request: OperationRequestData,
    buffer_to_operate_on: &mut Vec<f32>
)
{
    let mut current_sample_index: u32 = 0;
    let operation_buffer: &mut Vec<f32> = &mut vec![0.0; buffer_length as usize];

    let mut accumulator = 0.0;
    let window_size = operation_request.function_arguments[0] as u32;
    let hanning_window = window_size / 2;

    while current_sample_index < buffer_length
    {
        for offset_index in 0..window_size
        {
            let index = (current_sample_index + offset_index) - hanning_window;

            if index > 0
            {
                let window_sample_index = index % buffer_length;
                accumulator += buffer_to_operate_on[window_sample_index as usize];
            }
            else if index < 0
            {
                let window_sample_index = index + buffer_length;
                accumulator += buffer_to_operate_on[window_sample_index as usize];
            }
        }

        operation_buffer[current_sample_index as usize] = accumulator / window_size as f32;
        accumulator = 0.0;
        current_sample_index = current_sample_index + 1;
    }

    current_sample_index = 0;

    while current_sample_index < buffer_length
    {
        let new_sample_value = operation_buffer[current_sample_index as usize];
        buffer_to_operate_on[current_sample_index as usize] = new_sample_value;

        current_sample_index = current_sample_index + 1;
    }
}

fn splice
(
    buffer_length: u32,
    operation_request: OperationRequestData,
    buffer_to_operate_on: &mut Vec<f32>
)
{
    let time_increment: f32 = 1.0 / buffer_to_operate_on.len() as f32;
    let mut current_sample: u32 = 0;
    let mut current_increment: f32 = 0.0;
    let mut current_sample_value: f32 = 0.0;
    let mut sample_value: f32 = 0.0;
    let mut function_value: f32 = 0.0;

    let buffer_function = &is_function::is_wasm_buffer_function
    (
        operation_request.function_type,
        &operation_request.function_arguments,
        &operation_request.other_buffer
    );

    let operator = &is_operator::is_wasm_buffer_operator
    (
        operation_request.operator_type
    );

    let splice_lower_bound = operation_request.function_arguments[1] as u32;
    let splice_upper_bound = operation_request.function_arguments[2] as u32;
    let insert_start_sample = operation_request.function_arguments[3] as u32;

    let mut current_splice_sample = splice_lower_bound;

    while current_sample < buffer_length
    {
        current_sample_value = buffer_to_operate_on[current_sample as usize];

        if current_sample < insert_start_sample || current_splice_sample >= splice_upper_bound
        {
            sample_value = current_sample_value;
        }
        else
        {
            function_value = buffer_function.evaluate
            (
                current_increment,
                current_splice_sample,
                current_sample_value
            );

            sample_value = operator.operate(current_sample_value, function_value);

            current_splice_sample = current_splice_sample + 1;
        }

        buffer_to_operate_on[current_sample as usize] = sample_value;
        current_increment = current_increment + time_increment;
        current_sample = current_sample + 1;
    }
}

fn normalize
(
    buffer_length: u32,
    operation_request: OperationRequestData,
    buffer_to_operate_on: &mut Vec<f32>
)
{
    let mut current_sample: u32 = 0;

    let normalize_max = operation_request.function_arguments[0];

    let mut buffer_max = *buffer_to_operate_on
        .iter()
        .max_by(|x, y| x.abs().partial_cmp(&y.abs()).unwrap())
        .unwrap();

    buffer_max = f32::abs(buffer_max);

    let normalize_factor = normalize_max / buffer_max;

    while current_sample < buffer_length
    {
        let current_sample_value = buffer_to_operate_on[current_sample as usize];
        let normalized_value = current_sample_value * normalize_factor;

        buffer_to_operate_on[current_sample as usize] = normalized_value;
        current_sample = current_sample + 1;
    }
}