use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct ReactorPWRData {
    pub neutron: f64,
    precursors: [f64; 6],
    pub reactivity: f64,
    pub temp_fuel: f64,
    pub temp_coolant: f64,
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
        let sum_lambdaC = d.lambda.iter().zip(d.precursors.iter()).map(|(x,y)| x*y).sum();
        let Dneutron = (reactivity - self.Beta)/self.Lambda + sum_lambdaC;
        let Dprecursors = [0.0; 6];
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

    pub fn calc_step_euler(&self, d : ReactorPWRData) -> ReactorPWRData {
        // solve using euler's method
        let ddata = self.calc_diff(d);
    }
}

