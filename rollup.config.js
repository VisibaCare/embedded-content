const path = require('path');
const filesize = require('rollup-plugin-filesize');
const typescript = require('rollup-plugin-typescript2');
const commonjs = require('rollup-plugin-commonjs');
const terser = require('rollup-plugin-terser').terser;
const replace = require('rollup-plugin-replace');
const { rollup } = require('rollup');

function build(mode, filename) {
    const plugins = [
        replace({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        typescript({
                tsconfig: 'tsconfig.build.json',
                clean: true,
                check: true,
                useTsconfigDeclarationDir: true
        }),
        commonjs(),
    ];

    if (mode.endsWith('.min')) {
        plugins.push(terser());
    }

    plugins.push(filesize());

    return rollup({
        input: 'src/index.ts',
        external: [],
        plugins: plugins,
        inlineDynamicImports: true
    })
    .then((bundle) => {
        const options = {
            file: path.resolve(__dirname, 'dist', filename),
            format: mode.endsWith('.min') ? mode.slice(0, -'.min'.length) : mode,
            globals: {},
            name: 'VSocketJs',
            exports: 'named',
        };

        return bundle.write(options);
    })
    .catch((error) => {
        console.log(error);
        process.exit(-1);
    });
}

const main = async () => {
    await build('umd', 'index.js');
    await build('umd.min', 'index.min.js');
    await build('es', 'index.esm.js');
}

main();