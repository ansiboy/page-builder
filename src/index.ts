import * as path from "path";
import { startServer, Settings as MVCSettings, JavaScriptProcessor, RequestProcessor } from "maishu-node-mvc";
import { getVirtualPaths } from "maishu-chitu-scaffold";

import { DataStorage, DefaultDataStorage } from "./data-storage";
import { errors } from "./static/errors";
import { config } from "./config";
import { THEME_PHYSICAL_PATH, WEBSITE_DIRECTORY } from "./node-require";
import { JavaScriptProcessorWrapper } from "./request-processors/java-script-processor";
import w, { componentReactFactory } from "./static/website-config";

interface Settings {
    port: number,
    dataStorage?: DataStorage,
    themesPath: string,
}

const myVirtualPath = {
    "/static/node_modules": path.join(__dirname, "../node_modules"),
    "/static/content": path.join(__dirname, "../content"),
    "/static/modules/content": path.join(__dirname, "../content/modules"),
}

export { LoadData, ServerSideRender } from "./server-side-render";

export async function start(settings: Settings) {

    if (!settings.themesPath) throw errors.argumentFieldNull("themesPath", "settings");
    if (!path.isAbsolute(settings.themesPath)) throw new Error(`Themes path ${settings.themesPath} is not an absolute path.`);

    let { port } = settings;

    let contextData: ContextData = {
        dataStorage: settings.dataStorage || new DefaultDataStorage(),
        themesPath: settings.themesPath,
    };

    global[THEME_PHYSICAL_PATH] = settings.themesPath;

    let virtualPaths = getVirtualPaths("/static", path.join(__dirname, "../src/static"));
    virtualPaths = Object.assign(virtualPaths, myVirtualPath);
    virtualPaths[config.themesVirtualPath] = settings.themesPath;

    let proxy: MVCSettings["proxy"] = {};
    let mvcSettings: MVCSettings = {
        port,
        contextData,
        websiteDirectory: __dirname,
        virtualPaths,
        proxy,
        processors: {
            JavaScriptProcessor: {
                babel: {
                    "\\S+.js$": {
                        "presets": [
                            ["@babel/preset-env", {
                                "targets": { chrome: 58 }
                            }]
                        ],
                        plugins: [
                            ["@babel/plugin-transform-modules-amd", { noInterop: true }],
                        ]
                    },

                },
                ignorePaths: function (path: string) {
                    let maishuOut = /\S*\/node_modules\/\S+\/out\/\S+/;
                    if (maishuOut.test(path)) {
                        return false;
                    }

                    let regexes = [/\S*\/node_modules\S+/, /\S*\/lib\S+/]
                    for (let i = 0; i < regexes.length; i++) {
                        if (regexes[i].test(path))
                            return true;
                    }

                    return false;
                },
            },
            StaticFile: {
                contentTypes: {
                    ".map": "text"
                }
            }
        },

    }

    let s = startServer(mvcSettings, "mvc");
    global[WEBSITE_DIRECTORY] = s.websiteDirectory;
    let javaScriptProcessor = s.requestProcessors.find(JavaScriptProcessor);
    console.assert(javaScriptProcessor != null);
    console.assert((javaScriptProcessor as RequestProcessor).priority != null);

    let jsw = new JavaScriptProcessorWrapper(w.themesDirectoryName, componentReactFactory);
    jsw.priority = (javaScriptProcessor as RequestProcessor).priority - 1;
    s.requestProcessors.add(jsw);

}





