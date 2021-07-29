import { ConnectionOptions } from "maishu-node-data";

let db: ConnectionOptions = {
    type: "mysql", username: "root", password: "81263", name: "taro-builder",
    database: "taro-builder", entities: ["./entities.js"],
    synchronize: false,
    host: "127.0.0.1", port: 3306,
    // host: "192.168.2.94", port: 43306
};

export let config = {
    zwAppId: "7bbfa36c-8115-47ad-8d47-9e52b58e7efd",
    mainDomain: "maishu.com",
    defaultThemeName: "generic",
    db,
}

