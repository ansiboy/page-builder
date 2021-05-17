const { start } = require("../out");

start({
    port: 5217,
    imageHost: "haoyi100.cn/auth/image",
    messageHost: "119.29.102.254:6247",
    db: {
        type: "mysql", username: "root", password: "81263", name: "taro-builder",
        database: "taro-builder", entities: ["../out/entities.js"],
        synchronize: true,
        host: "192.168.2.94", port: 43306
    },
    menuItems: [
        {
            id: "AE3789A2-0CF0-4D81-A7C0-E2C9324A1DDD", name: "页面列表", path: "#page-list",
            children: [
                { id: "3CE34AB9-7814-4FE5-85E2-ABA6AAF9C1FD", name: "页面编辑", path: "#page-edit", hidden: true }
            ]
        },
        {
            id: "7B13EC50-A398-4379-AED5-6AB3263EDB75", name: "主题", path: "#theme-list",
        }
    ],

})