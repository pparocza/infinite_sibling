use wasm_bindgen::prelude::*;
use crate::is_function::is_wasm_buffer_function;
use crate::is_operator::is_wasm_buffer_operator;

mod is_function;
mod is_operator;

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
    let mut sample_index: i32 = 0;
    let mut time: f32 = 0.0;
    let mut function_value: f32 = 0.0;
    let mut sample_value: f32 = 0.0;
    let mut current_array_value: f32 = 0.0;

    while sample_index < buffer_length
    {
        function_value = is_wasm_buffer_function
        (
            function_type_as_string, time, sample_index, function_arguments
        );

        current_array_value = current_buffer_array[sample_index as usize];

        sample_value = is_wasm_buffer_operator
        (
            operator_type_as_string, current_array_value, function_value
        );

        function_buffer.push(sample_value);
        time = time + time_increment;
        sample_index = sample_index + 1;
    }

    function_buffer
}


