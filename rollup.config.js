import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import resolve from "rollup-plugin-node-resolve";
import dts from 'rollup-plugin-dts';

import pkg from "./package.json";

/**
 * Config for bundling source code
 */
const srcConfig = {
    input: "src/index.ts",
    output: [
        {
            file: pkg.main,
            format: "cjs",
            exports: "named",
            sourcemap: true
        },
        {
            file: pkg.module,
            format: "es",
            exports: "named",
            sourcemap: true
        }
    ],
    plugins: [
        external(),
        resolve(),
        typescript({
            rollupCommonJSResolveHack: true,
            exclude: [`**/${pkg.devDir}/**`],
            clean: true,
            verbosity: 3
        }),
        commonjs({
            include: ["node_modules/**"]
        })
    ]
}

/**
 * Config for bundling .d.ts files
 */
const typeConfig = {
    input: "src.dts/index.d.ts",
    output: [{
        file: pkg.types,
        format: "es"
    }],
    plugins: [dts()],
}

export default [
    srcConfig,
    typeConfig,
];