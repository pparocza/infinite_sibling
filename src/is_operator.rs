enum ISBufferOperatorType
{
    Add, Subtract, Multiply, Divide, Undefined
}

pub fn is_wasm_buffer_operator
(
    operator_type_as_string: &str, current_sample_value: f32, function_value: f32
) -> f32
{
    let operator_type: ISBufferOperatorType = operator_type_string_to_enum(operator_type_as_string);

    match operator_type
    {
        ISBufferOperatorType::Add => current_sample_value + function_value,
        ISBufferOperatorType::Subtract => current_sample_value - function_value,
        ISBufferOperatorType::Multiply => current_sample_value * function_value,
        ISBufferOperatorType::Divide => current_sample_value / function_value,
        ISBufferOperatorType::Undefined => 0.0,
    }
}

fn operator_type_string_to_enum(operator_type: &str) -> ISBufferOperatorType
{
    match operator_type
    {
        "add" => ISBufferOperatorType::Add,
        "divide" => ISBufferOperatorType::Divide,
        "multiply" => ISBufferOperatorType::Multiply,
        "subtract" => ISBufferOperatorType::Subtract,
        _ => {ISBufferOperatorType::Undefined}
    }
}