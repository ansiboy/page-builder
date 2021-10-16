import * as path from "path";
import { startServer, Settings as MVCSettings } from "maishu-node-mvc";
import { getVirtualPaths } from "maishu-admin-scaffold";
import { ConnectionOptions, createConnection } from "maishu-node-data";
import websiteConfig from "./static/website-config";
import { sourceVirtualPaths } from "maishu-chitu-scaffold";
// import { getDomain, StoreHtmlTransform } from "./content-transforms/store-html-transform";
import { pathConcat } from "maishu-toolkit";
import * as querystring from "querystring";
import { getMyConnection } from "./decoders";
import { PageRecord, StoreDomain, StoreInfo } from "./entities";
import { IncomingMessage } from "http";
import { startMessage } from "./message";
import { routers } from "./static/routers";
import { AdminHtmlTransform } from "./content-transforms/admin-html-transform";

interface Settings {
    port: number,
    messageHost: string,
    imageHost: string,
    db: ConnectionOptions,
    menuItems?: MenuItem[],
}

export async function start(settings: Settings) {

    let { imageHost, port, db } = settings;


    await createConnection(db);

    startMessage(settings.messageHost);
    let contextData: ContextData = {
        db,
        menuItem: settings.menuItems || []
    };

    let virtualPaths = getVirtualPaths("/static", path.join(__dirname, "../src/static"));

    let sv = sourceVirtualPaths(__dirname);
    virtualPaths = Object.assign(sv, virtualPaths);

    virtualPaths["/static/node_modules"] = path.join(__dirname, "../node_modules");
    virtualPaths["/static/content"] = path.join(__dirname, "../content");
    virtualPaths["/static/modules/content"] = path.join(__dirname, "../content/modules");
    virtualPaths["/static/css.js"] = path.join(__dirname, "../node_modules/maishu-requirejs-plugins/src/css.js");

    for (let themeName in websiteConfig.componentStations) {
        virtualPaths[`/static/modules/${themeName}-page-edit.js`] = path.join(__dirname, "static/modules/pc-page-edit.js");
    }

    let proxy: MVCSettings["proxy"] = {};
    proxy["^/ueditor/net/upload/(\\S*)"] = `http://${imageHost}/Images/upload/$1`;
    let componentStations = websiteConfig.componentStations || {};
    for (let c in componentStations) {
        proxy[`^/${c}/(\\S*)`] = `${componentStations[c]}/$1`;
        proxy[`^/site/${c}/(\\S*)`] = `${componentStations[c]}/$1`;
    }

    proxy[`^/share/(\\S*)`] = `${websiteConfig.componentShare}/$1`;
    proxy[`^/image/(\\S*)`] = `${imageHost}/$1`;

    let mvcSettings: MVCSettings = {
        port,
        contextData,
        websiteDirectory: __dirname,
        virtualPaths,
        proxy,
        processors: {
            JavaScriptProcessor: {
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
        }
    }

    let adminServer = startServer(mvcSettings, "mvc");
    adminServer.contentTransforms.push(new AdminHtmlTransform());

    let storeServer = startServer({
        port: port + 1,
        websiteDirectory: __dirname,
        virtualPaths,
        proxy,
        // urlRewrite: (rawUrl, { req }) => {
        //     return storeUrlRewrite(rawUrl, req);
        // }
    })
    // storeServer.contentTransforms.push(new StoreHtmlTransform());
}

// const AppName = "application-id";
// async function storeUrlRewrite(rawUrl: string, req: IncomingMessage) {

//     //===============================================================
//     // 优化查询
//     let conn = await getMyConnection();
//     let urlRewrites = conn.getRepository(UrlRewrite);
//     let item = await urlRewrites.findOne({ newUrl: rawUrl });
//     if (item && item.originalUrl != null) {
//         rawUrl = item.originalUrl;
//     }
//     //===============================================================

//     let queryIndex = rawUrl.indexOf("?");
//     let query: string | null = null;
//     let pathname: string = rawUrl;
//     if (queryIndex >= 0) {
//         query = rawUrl.substr(queryIndex + 1);
//         pathname = rawUrl.substr(0, queryIndex);
//     }

//     let m: { [key: string]: string } | null = null;
//     if (rawUrl == "/")
//         m = { name: "home" };
//     else if (pathname == "/")
//         m = {};

//     if (m == null) {
//         for (let i = 0; i < routers.length; i++) {
//             m = routers[i].match(pathname);
//             if (m)
//                 break;
//         }
//     }

//     if (!m) {
//         return null;
//     }

//     if (query != null) {
//         let obj = querystring.parse(query);
//         m = Object.assign(obj || {}, m);
//     }

//     if (m.filePath)
//         return pathConcat("/", m.filePath);

//     if (m.id == null && m.name != null) {
//         let conn = await getMyConnection();
//         let storeDomains = conn.getRepository(StoreDomain);
//         let pageRecords = conn.getRepository(PageRecord);

//         let domain = getDomain(req);
//         let storeDomain = await storeDomains.findOne({ domain });
//         if (storeDomain != null) {
//             m[AppName] = storeDomain.applicationId;
//         }

//         let appId = m[AppName];
//         if (!appId)
//             throw new Error("Application id is null or empty.");

//         let pageRecord = await pageRecords.findOne({ name: m.name, applicationId: appId });
//         if (pageRecord == null)
//             throw new Error(`Page record with name '${m.name}' and applicationId '${appId}' is not exists.`);

//         m.id = pageRecord.id;
//     }

//     let q = Object.keys(m).filter(o => m[o] != null).map(o => `${o}=${m[o]}`).join('&');
//     let u = `/preview.html?${q}`;
//     return u;

// }




