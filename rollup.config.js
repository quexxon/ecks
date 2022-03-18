export default {
    input: "./build/index.js",
    output: [{
        file: "dist/ecks.bundle.js",
        format: "es"
    }, {
        file: "dist/ecks.bundle.cjs",
        format: "cjs"
    }]
}
