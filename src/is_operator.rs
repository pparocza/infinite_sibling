pub enum ISBufferOperatorType
{
    Add, Divide, Multiply, Replace, Subtract
}

pub fn is_wasm_buffer_operator(operator_type: ISBufferOperatorType) -> Box<dyn Operate>
{
    match operator_type
    {
        ISBufferOperatorType::Add => { Box::new(Add {}) }
        ISBufferOperatorType::Divide => { Box::new(Divide {}) }
        ISBufferOperatorType::Multiply => { Box::new(Multiply {}) }
        ISBufferOperatorType::Replace => { Box::new(Replace{}) }
        ISBufferOperatorType::Subtract => { Box::new(Subtract {}) }
        _ => { unreachable!() }
    }
}

pub fn operator_type_string_to_enum(operator_type: &str) -> ISBufferOperatorType
{
    match operator_type
    {
        "add" => ISBufferOperatorType::Add,
        "divide" => ISBufferOperatorType::Divide,
        "multiply" => ISBufferOperatorType::Multiply,
        "replace" => ISBufferOperatorType::Replace,
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
    fn operate(&self, current_value: f32, function_value: f32) -> f32
    { current_value + function_value }
}

pub struct Divide {}
impl Operate for Divide
{
    fn operate(&self, current_value: f32, function_value: f32) -> f32
    { current_value / function_value }
}

pub struct Multiply {}
impl Operate for Multiply
{
    fn operate(&self, current_value: f32, function_value: f32) -> f32
    { current_value * function_value }
}

pub struct Replace {}
impl Operate for Replace
{
    fn operate(&self, current_value: f32, function_value: f32) -> f32
    { function_value }
}

pub struct Subtract {}
impl Operate for Subtract
{
    fn operate(&self, current_value: f32, function_value: f32) -> f32
    { current_value - function_value }
}