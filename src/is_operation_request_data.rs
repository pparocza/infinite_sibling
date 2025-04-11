use crate::is_buffer_function::ISBufferFunctionType;
use crate::is_function::function_type_string_to_enum;
use crate::is_operator::{operator_type_string_to_enum, ISBufferOperatorType};

pub struct OperationRequestData
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