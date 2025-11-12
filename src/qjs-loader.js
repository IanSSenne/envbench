import * as os from "os";
import * as std from "std";
const name = "require";
function debug_logAccess(moduleName, module) {
    console.log(`Loading module: ${moduleName}`);
    return new Proxy(module, {
        get(target, prop, receiver) {
            if (!Reflect.has(target, prop)) {
                console.log(`Keys: ${Object.getOwnPropertyNames(target).join(", ")}`);
                console.log(`Property: ${String(prop)} does not exist on module: ${moduleName}`);
                // throw new Error(`Property: ${String(prop)} does not exist on module: ${moduleName}`);
            }
            return Reflect.get(target, prop, receiver);
        }
    });
}
const path = debug_logAccess("path", {
    __esModule: true,
    join: (...args) => {
        let acc = [];
        for (const arg of args) {
            for (const segment of arg.split(/[/\\]/)) {
                if (segment === "" || segment === ".") {
                    continue;
                } else if (segment === "..") {
                    acc.pop();
                }
                else {
                    acc.push(segment);
                }
            }
        }
        return acc.join("/");
    },
    dirname: (path) => {
        const parts = path.split(/[/\\]/);
    }
});
const modules = {
    path,
    "node:path": path,
};
globalThis.process = debug_logAccess("process", {
    env: debug_logAccess("process.env", std.getenviron()),
    cwd: () => os.getcwd()[0],
});
globalThis.__dirname =
    globalThis[name] = (name) => {
        const mod = modules[name];
        if (!mod) {
            throw new Error(`Module not found: ${name}`);
        }
        return mod;
    }
export { };

