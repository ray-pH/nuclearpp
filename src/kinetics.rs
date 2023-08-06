#![allow(non_snake_case)]
use wasm_bindgen::prelude::*;
use std::ops;

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub struct ReactorPWRData {
    pub neutron: f64,
    precursors: [f64; 6],
    pub reactivity: f64,
    pub temp_fuel: f64,
    pub temp_coolant: f64,
}

// implement ops::Add for ReactorPWRData
impl ops::Add for ReactorPWRData {
    type Output = Self;
    fn add(self, rhs: Self) -> Self {
        let mut precursors = [0.0; 6];
        for i in 0..6 {
            precursors[i] = self.precursors[i] + rhs.precursors[i];
        }
        ReactorPWRData {
            neutron: self.neutron + rhs.neutron,
            precursors,
            reactivity: self.reactivity + rhs.reactivity,
            temp_fuel: self.temp_fuel + rhs.temp_fuel,
            temp_coolant: self.temp_coolant + rhs.temp_coolant,
        }
    }
}

// operator overloading scale ReactorPWRData with some float
impl ops::Mul<f64> for ReactorPWRData {
    type Output = Self;
    fn mul(self, scale: f64) -> Self {
        let mut precursors = [0.0; 6];
        for i in 0..6 {
            precursors[i] = self.precursors[i] * scale;
        }
        ReactorPWRData {
            neutron: self.neutron * scale,
            precursors,
            reactivity: self.reactivity * scale,
            temp_fuel: self.temp_fuel * scale,
            temp_coolant: self.temp_coolant * scale,
        }
    }
}
impl ops::Mul<ReactorPWRData> for f64 {
    type Output = ReactorPWRData;
    fn mul(self, rhs: ReactorPWRData) -> ReactorPWRData {
        rhs * self
    }
}

#[wasm_bindgen]
pub struct ReactorPWR {
    data: ReactorPWRData,
    pub time: f64,
    pub dt: f64,
    // neutronic
    beta: [f64; 6],
    Beta : f64,
    lambda: [f64; 6],
    Lambda: f64,
    excess_reactivity: f64,
    external_reactivity: f64,
    // temperature
    alpha_fuel: f64,
    alpha_coolant: f64,
    // coolant
}

#[wasm_bindgen]
impl ReactorPWR {
    // calculate the differential equations (d/dt data)
    pub fn calc_diff(&self, d : ReactorPWRData) -> ReactorPWRData{
        // differential equations
        let reactivity = self.excess_reactivity + self.external_reactivity +
            self.alpha_fuel * d.temp_fuel + self.alpha_coolant * d.temp_coolant;
        let sum_lambdaC : f64 = self.lambda.iter().zip(d.precursors.iter()).map(|(x,y)| x*y).sum();
        let Dneutron = (reactivity - self.Beta)/self.Lambda + sum_lambdaC;
        let mut Dprecursors = [0.0; 6];
        for i in 0..6 {
            Dprecursors[i] = self.beta[i]/self.Lambda * d.neutron - self.lambda[i] * d.precursors[i];
        }
        return ReactorPWRData {
            neutron: Dneutron,
            precursors: Dprecursors,
            reactivity,
            temp_fuel: 0.0,
            temp_coolant: 0.0,
        };
    }

    pub fn calc_step_euler(&self, d : ReactorPWRData, dt : f64) -> ReactorPWRData {
        // solve using euler's method
        let ddata = self.calc_diff(d);
        return d + ddata * dt;
    }
}

