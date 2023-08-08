/* tslint:disable */
/* eslint-disable */
/**
*/
export class ReactorPWR {
  free(): void;
/**
* @param {number} initial_power
* @param {number} dt
* @param {number} excess_reactivity
* @param {number} alpha_fuel
* @param {number} alpha_coolant
* @param {number} mass_fuel
* @param {number} mass_coolant
* @param {number} heat_capacity_fuel
* @param {number} heat_capacity_coolant
*/
  constructor(initial_power: number, dt: number, excess_reactivity: number, alpha_fuel: number, alpha_coolant: number, mass_fuel: number, mass_coolant: number, heat_capacity_fuel: number, heat_capacity_coolant: number);
/**
* @param {number} external_reactivity
*/
  set_external_reactivity(external_reactivity: number): void;
/**
* @returns {Float64Array}
*/
  get_datas(): Float64Array;
/**
*/
  step_euler(): void;
/**
* @param {number} n
*/
  step_euler_n(n: number): void;
/**
*/
  time: number;
}
/**
*/
export class ReactorPWRData {
  free(): void;
/**
*/
  power: number;
/**
*/
  reactivity: number;
/**
*/
  temp_coolant: number;
/**
*/
  temp_fuel: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_reactorpwrdata_free: (a: number) => void;
  readonly __wbg_get_reactorpwrdata_power: (a: number) => number;
  readonly __wbg_set_reactorpwrdata_power: (a: number, b: number) => void;
  readonly __wbg_get_reactorpwrdata_reactivity: (a: number) => number;
  readonly __wbg_set_reactorpwrdata_reactivity: (a: number, b: number) => void;
  readonly __wbg_get_reactorpwrdata_temp_fuel: (a: number) => number;
  readonly __wbg_set_reactorpwrdata_temp_fuel: (a: number, b: number) => void;
  readonly __wbg_get_reactorpwrdata_temp_coolant: (a: number) => number;
  readonly __wbg_set_reactorpwrdata_temp_coolant: (a: number, b: number) => void;
  readonly __wbg_reactorpwr_free: (a: number) => void;
  readonly __wbg_get_reactorpwr_time: (a: number) => number;
  readonly __wbg_set_reactorpwr_time: (a: number, b: number) => void;
  readonly reactorpwr_new: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => number;
  readonly reactorpwr_set_external_reactivity: (a: number, b: number) => void;
  readonly reactorpwr_get_datas: (a: number, b: number) => void;
  readonly reactorpwr_step_euler: (a: number) => void;
  readonly reactorpwr_step_euler_n: (a: number, b: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
