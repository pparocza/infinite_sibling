use wasm_bindgen::prelude::*;

const TWO_PI: f32 = std::f32::consts::PI * 2.0;

#[wasm_bindgen]
pub fn wasm_frequency_modulation
(
    buffer_length: i32, carrier_frequency: f32, modulator_frequency: f32, modulator_gain: f32
) -> Vec<f32>
{
    let mut buffer: Vec<f32> = Vec::new();

    let time_increment: f32 = 1.0 / buffer_length as f32;
    let mut time: f32 = 0.0;

    let mut modulation_value: f32;
    let mut modulated_frequency_value: f32;
    let mut value: f32;

    let mut i: i32 = 0;

    while i < buffer_length
    {
        modulation_value = modulator_gain * f32::sin(time * modulator_frequency * TWO_PI);
        modulated_frequency_value = carrier_frequency + modulation_value;
        value = f32::sin(time * modulated_frequency_value * TWO_PI);
        buffer.push(value);
        time = time + time_increment;
        i = i + 1;
    }

    buffer
}