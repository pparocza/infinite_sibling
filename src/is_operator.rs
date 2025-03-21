enum ISBufferOperatorType
{
    Add, Subtract, Multiply, Divide
}

pub fn is_wasm_buffer_operator(operator_type_as_string: &str) -> impl Operate
{
    let operator_type: ISBufferOperatorType = operator_type_string_to_enum(operator_type_as_string);

    match operator_type
    {
        ISBufferOperatorType::Add => { Add {} }
        /*
        ISBufferOperatorType::Subtract => { Subtract {} }
        ISBufferOperatorType::Multiply => { Multiply {} }
        ISBufferOperatorType::Divide => { Divide {} }
        */
        _ => { unreachable!() }
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
        _ => { unreachable!() }
    }
}

pub trait Operate
{
    fn operate(&self, current_value: f32, function_value: f32) -> f32;
}

pub struct Add {}
impl Operate for Add
{
    fn operate(&self, current_value: f32, function_value: f32) -> f32 { current_value + function_value }
}

pub struct Subtract {}
impl Operate for Subtract
{
    fn operate(&self, current_value: f32, function_value: f32) -> f32 { current_value - function_value }
}

pub struct Multiply {}
impl Operate for Multiply
{
    fn operate(&self, current_value: f32, function_value: f32) -> f32 { current_value * function_value }
}

pub struct Divide {}
impl Operate for Divide
{
    fn operate(&self, current_value: f32, function_value: f32) -> f32 { current_value / function_value }
}