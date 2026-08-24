const fs = require("fs");
const path = require("path");


function setConfig(filename, cfg) {
    const configFile = path.resolve(__dirname, filename);

    console.log("setConfig filename:", filename);
    console.log("setConfig path:", configFile);
    console.log("setConfig data:", cfg);

    fs.writeFileSync(
        configFile,
        JSON.stringify(cfg, null, 2),
        "utf8"
    );

    console.log("setConfig completed");
}
function getConfig(filename) {
    const configFile = path.resolve(__dirname, filename);
    console.log("__dirname:", __dirname);
    console.log("filename:", filename);
    console.log("configFile:", configFile);
    console.log("exists:", fs.existsSync(configFile));
    if (!fs.existsSync(configFile)) {
        console.log("file not exist!");
        return {};
    }

    const data = fs.readFileSync(configFile, "utf8");
    return JSON.parse(data);
}

module.exports = { setConfig, getConfig };
