use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(module ="/modules/types/buffer/operation/workers/IS_WASMOperationData.js")]
extern "C"
{
    pub type IS_WASMOperationData;

    #[wasm_bindgen(constructor)]
    fn new() -> IS_WASMOperationData;

    #[wasm_bindgen(method, getter)]
    pub fn operatorType(this: &IS_WASMOperationData) -> String;

    #[wasm_bindgen(method, getter)]
    pub fn functionType(this: &IS_WASMOperationData) -> String;

    #[wasm_bindgen(method, getter)]
    pub fn functionArgs(this: &IS_WASMOperationData) -> Vec<f32>;

    #[wasm_bindgen(method, getter)]
    pub fn isSuspendedOperation(this: &IS_WASMOperationData) -> bool;
}