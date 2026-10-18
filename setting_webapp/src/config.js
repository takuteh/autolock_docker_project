
const fs = require("fs");
const path = require("path");

const PLATFORM = process.env.AUTOLOCK_PLATFORM || "docker";
const AUTOLOCK_NAMESPACE = process.env.AUTOLOCK_NAMESPACE || "autolock";
const AUTOLOCK_CR_NAME = process.env.AUTOLOCK_CR_NAME;

function setConfigDocker(filename, cfg) {
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


async function setConfigKubernetes(cfg) {
    if (!AUTOLOCK_CR_NAME) {
        throw new Error("AUTOLOCK_CR_NAME is not configured");
    }

    const k8s = await import("@kubernetes/client-node");
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();

    const api = kc.makeApiClient(k8s.CustomObjectsApi);

    const mainConfig = cfg.main;
    if (!mainConfig || typeof mainConfig !== "object") {
        throw new Error("Invalid config: cfg.main is required");
    }

    const response = await api.patchNamespacedCustomObject({
        group: "autolock.takuteh.uk",
        version: "v1alpha1",
        namespace: AUTOLOCK_NAMESPACE,
        plural: "autolocks",
        name: AUTOLOCK_CR_NAME,
        body: [
            {
                op: "replace",
                path: "/spec/main/config/main",
                value: mainConfig
            }
        ],
        options: {
            headers: {
                "Content-Type": "application/json-patch+json"
            }
        }
    });

    console.log("PATCH response:", JSON.stringify(response, null, 2));
    console.log("Autolock CR patched:", AUTOLOCK_CR_NAME);
}

async function setConfig(filename, cfg) {
    switch (PLATFORM) {
        case "docker":
            return setConfigDocker(filename, cfg);

        case "kubernetes":
            return setConfigKubernetes(cfg);

        default:
            throw new Error(`Unsupported AUTOLOCK_PLATFORM: ${PLATFORM}`);
    }
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
