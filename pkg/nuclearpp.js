let wasm;

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

let cachedFloat64Memory0 = null;

function getFloat64Memory0() {
    if (cachedFloat64Memory0 === null || cachedFloat64Memory0.byteLength === 0) {
        cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64Memory0;
}

function getArrayF64FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat64Memory0().subarray(ptr / 8, ptr / 8 + len);
}
/**
*/
export class ReactorPWR {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ReactorPWR.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_reactorpwr_free(ptr);
    }
    /**
    * @returns {number}
    */
    get time() {
        const ret = wasm.__wbg_get_reactorpwr_time(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set time(arg0) {
        wasm.__wbg_set_reactorpwr_time(this.__wbg_ptr, arg0);
    }
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
    constructor(initial_power, dt, excess_reactivity, alpha_fuel, alpha_coolant, mass_fuel, mass_coolant, heat_capacity_fuel, heat_capacity_coolant) {
        const ret = wasm.reactorpwr_new(initial_power, dt, excess_reactivity, alpha_fuel, alpha_coolant, mass_fuel, mass_coolant, heat_capacity_fuel, heat_capacity_coolant);
        return ReactorPWR.__wrap(ret);
    }
    /**
    * @param {number} external_reactivity
    */
    set_external_reactivity(external_reactivity) {
        wasm.reactorpwr_set_external_reactivity(this.__wbg_ptr, external_reactivity);
    }
    /**
    * @returns {Float64Array}
    */
    get_datas() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.reactorpwr_get_datas(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 8);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    */
    step_euler() {
        wasm.reactorpwr_step_euler(this.__wbg_ptr);
    }
    /**
    * @param {number} n
    */
    step_euler_n(n) {
        wasm.reactorpwr_step_euler_n(this.__wbg_ptr, n);
    }
}
/**
*/
export class ReactorPWRData {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_reactorpwrdata_free(ptr);
    }
    /**
    * @returns {number}
    */
    get power() {
        const ret = wasm.__wbg_get_reactorpwrdata_power(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set power(arg0) {
        wasm.__wbg_set_reactorpwrdata_power(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get reactivity() {
        const ret = wasm.__wbg_get_reactorpwrdata_reactivity(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set reactivity(arg0) {
        wasm.__wbg_set_reactorpwrdata_reactivity(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get temp_fuel() {
        const ret = wasm.__wbg_get_reactorpwrdata_temp_fuel(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set temp_fuel(arg0) {
        wasm.__wbg_set_reactorpwrdata_temp_fuel(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get temp_coolant() {
        const ret = wasm.__wbg_get_reactorpwrdata_temp_coolant(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set temp_coolant(arg0) {
        wasm.__wbg_set_reactorpwrdata_temp_coolant(this.__wbg_ptr, arg0);
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_init_memory(imports, maybe_memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedFloat64Memory0 = null;
    cachedInt32Memory0 = null;
    cachedUint8Memory0 = null;


    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;

    if (typeof input === 'undefined') {
        input = new URL('nuclearpp_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await input, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync }
export default __wbg_init;
