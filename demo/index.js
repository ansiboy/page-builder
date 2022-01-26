const path = require("path");
const { start } = require("../out");
let themeHost = "127.0.0.1:6839"; //"finememo.com/themes";//
start({
    port: 5227,
    imageHost: "http://shop-image.gemwon.com",
    messageHost: "gemwon.com:6247",
    db: {
        type: "mysql",
        username: "root",
        password: "81263",
        name: "page-builder",
        database: "page-builder",
        entities: ["../out/entities.js"],
        synchronize: false,
        host: "shop-db",
        port: 3306
            //host: "finememo.com", port: 3306
    },
    menuItems: [{
            id: "AE3789A2-0CF0-4D81-A7C0-E2C9324A1DDD",
            name: "页面列表",
            path: "#page-list",
            children: [
                { id: "3CE34AB9-7814-4FE5-85E2-ABA6AAF9C1FD", name: "页面编辑", path: "#page-edit", hidden: true }
            ]
        },
        {
            id: "7B13EC50-A398-4379-AED5-6AB3263EDB75",
            name: "主题",
            path: "#theme-list",
        }
    ],
    componentStations: {
        aixpi: `http://${themeHost}/designer/aixpi`,
        flone: `http://${themeHost}/designer/flone`,
        generic: `http://${themeHost}/designer/generic`,
        // "gemwon-pc": `http://${themeHost}/designer/gemwon-pc`,
        "share": `http://${themeHost}/share`,
    },
    virtualPaths: {
        // "static/gemwon-pc": path.join(__dirname, "./themes/gemwon-pc")
        "static/themes": path.join(__dirname, "./themes")
    }
})