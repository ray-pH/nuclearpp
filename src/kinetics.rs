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
    //controllable
    external_reactivity: f64,
    dt: f64,
    // const neutronic
    beta: [f64; 6],
    Beta : f64,
    lambda: [f64; 6],
    Lambda: f64,
    excess_reactivity: f64,
    // const temperature
    alpha_fuel: f64,
    alpha_coolant: f64,
    // heat transfers
    mass_fuel : f64,
    heat_capacity_fuel : f64,
    mass_coolant : f64,
    heat_capacity_coolant : f64,
    convective_heat_transfer_coefficient : f64,
    coolant_inlet_temperature : f64,
    coolant_mass_flow_rate : f64,
}

#[wasm_bindgen]
impl ReactorPWR {
    // initialize
    #[wasm_bindgen(constructor)]
    pub fn new(dt : f64, excess_reactivity : f64,
        alpha_fuel : f64, alpha_coolant : f64,
        mass_fuel : f64, mass_coolant : f64,
        heat_capacity_fuel : f64, heat_capacity_coolant : f64,
        ) -> Self {
        // for now, hardcode the value
        let beta = [0.000215, 0.001424, 0.001274, 0.002568, 0.000748, 0.000273];
        let lambda = [0.0124, 0.0305, 0.111, 0.301, 1.14, 3.01];
        let time = 0.0;
        let Lambda = 20e-3;
        let Beta = beta.iter().sum();
        let external_reactivity = 0.0;
        let data = ReactorPWRData {
            neutron: 1e2,
            precursors: [0.0; 6],
            reactivity: 0.0,
            temp_fuel: 0.0,
            temp_coolant: 0.0,
        };
        let convective_heat_transfer_coefficient = 0.0;
        let coolant_inlet_temperature = 0.0;
        let coolant_mass_flow_rate = 0.0;
        ReactorPWR {
            data, time, dt, beta, Beta, lambda, Lambda,
            excess_reactivity, external_reactivity, alpha_fuel, alpha_coolant,
            mass_fuel, heat_capacity_fuel, mass_coolant, heat_capacity_coolant,
            convective_heat_transfer_coefficient, coolant_inlet_temperature, coolant_mass_flow_rate,
        }
    }

    pub fn set_external_reactivity(&mut self, external_reactivity : f64) {
        self.external_reactivity = external_reactivity;
    }

    pub fn get_datas(&self) -> Vec<f64> {
        let mut datas = Vec::new();
        datas.push(self.data.neutron);
        datas.extend_from_slice(&self.data.precursors);
        datas.push(self.data.reactivity);
        datas.push(self.data.temp_fuel);
        datas.push(self.data.temp_coolant);
        return datas;
    }

    // calculate the differential equations (d/dt data)
    fn calc_diff(&self, d : ReactorPWRData) -> ReactorPWRData{
        // differential equations
        // TODO : termperature
        let sum_lambdaC : f64 = self.lambda.iter().zip(d.precursors.iter()).map(|(x,y)| x*y).sum();
        let Dneutron = (d.reactivity - self.Beta)/self.Lambda * d.neutron + sum_lambdaC;
        let mut Dprecursors = [0.0; 6];
        for i in 0..6 {
            Dprecursors[i] = self.beta[i]/self.Lambda * d.neutron - self.lambda[i] * d.precursors[i];
        }
        return ReactorPWRData {
            neutron: Dneutron,
            precursors: Dprecursors,
            reactivity: 0.0,
            temp_fuel: 0.0,
            temp_coolant: 0.0,
        };
    }

    fn calc_step_euler(&self, d : ReactorPWRData, dt : f64) -> ReactorPWRData {
        // solve using euler's method
        let ddata = self.calc_diff(d);
        return d + ddata * dt;
    }

    pub fn step_euler(&mut self) {
        let reactivity = self.excess_reactivity + self.external_reactivity +
            self.alpha_fuel * self.data.temp_fuel + self.alpha_coolant * self.data.temp_coolant;
        let mut inp_data = self.data.clone();
        inp_data.reactivity = reactivity;
        // calculate the next step
        let next_data = self.calc_step_euler(inp_data, self.dt);
        self.data = next_data;
        self.time += self.dt;
    }
}

