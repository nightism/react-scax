import typescript from "rollup-plugin-typescript2"; // For transpile typescript
import commonjs from "rollup-plugin-commonjs"; // For transpile the imported commonJS modules
import external from "rollup-plugin-peer-deps-external"; // For excluding peerDependancies
import resolve from "rollup-plugin-node-resolve"; // For taking care of the imported third-party modules
import dts from 'rollup-plugin-dts'; // For bundling .d.ts files

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