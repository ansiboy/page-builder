import { ConnectionOptions } from "maishu-node-data";
import path = require("path");
import w from "./static/website-config";

let db: ConnectionOptions = {
    type: "mysql", username: "root", password: "81263", name: "page-builder",
    database: "page-builder", entities: [path.join(__dirname, "./entities.js")],
    synchronize: false,
    host: "shop-db", port: 3306,
    // host: "192.168.2.94", port: 43306
};

export let config = {
    zwAppId: "7bbfa36c-8115-47ad-8d47-9e52b58e7efd",
    mainDomain: "maishu.com",
    defaultThemeName: "generic",
    db,
    themesVirtualPath: `static/${w.themesDirectoryName}`,
}

// export const ControllerRoot = w.adminApiRoot;


