use wasm_bindgen::prelude::*;
use crate::is_buffer_function::*;
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
    current_buffer_array: &[f32],
    function_type_as_string: &str, operator_type_as_string: &str,
    function_arguments: &[f32]
) -> Vec<f32>
{
    let buffer_length = current_buffer_array.len() as i32;
    let mut function_buffer: Vec<f32> = Vec::new();

    let time_increment: f32 = 1.0 / buffer_length as f32;
    let mut current_sample: i32 = 0;
    let mut current_increment: f32 = 0.0;
    let mut function_value: f32 = 0.0;
    let mut sample_value: f32 = 0.0;
    let mut current_array_value: f32 = 0.0;

    let buffer_function = &is_function::is_wasm_buffer_function
    (
        function_type_as_string, function_arguments
    );

    let operator = &is_operator::is_wasm_buffer_operator
    (
        operator_type_as_string
    );

    while current_sample < buffer_length
    {
        current_array_value = current_buffer_array[current_sample as usize];

        function_value = buffer_function.evaluate(current_increment, current_sample);
        sample_value = operator.operate(current_array_value, function_value);

        function_buffer.push(sample_value);
        current_increment = current_increment + time_increment;
        current_sample = current_sample + 1;
    }

    function_buffer
}


