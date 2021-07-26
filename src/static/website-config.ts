import { WebsiteConfig } from "maishu-admin-scaffold/static/website-config";

//==========================================================================
// 常用配置
export let themeHost = "127.0.0.1:6839";//"finememo.com/themes";//
let storePort = 5218;
//==========================================================================

type MyWebsiteConfig = WebsiteConfig & {
    componentStations: { aixpi: string, flone: string, generic: string, "gemwon-pc": string },
    componentShare: string, storePort: number
};

export let libVirtualPath = "lib";
let node_modules = "/node_modules";
let websiteConfig: MyWebsiteConfig = {
    //===================================================
    // 组件站点配置
    componentStations: {
        aixpi: `http://${themeHost}/designer/aixpi`,
        flone: `http://${themeHost}/designer/flone`,
        generic: `http://${themeHost}/designer/generic`,
        "gemwon-pc": `http://${themeHost}/designer/gemwon-pc`,
    },
    componentShare: `http://${themeHost}/share`,
    //===================================================
    storePort: storePort,
    requirejs: {
        context: "site",
        shim: {
            "node_modules/bootstrap/js/button": { deps: ["jquery"], exports: "jQuery" },
            "node_modules/bootstrap/js/dropdown": { deps: ["jquery"], exports: "jQuery" },
            "node_modules/bootstrap/dist/js/bootstrap": { deps: ["jquery"], exports: "jQuery" },
        },
        paths: {
            "css": `${node_modules}/maishu-requirejs-plugins/src/css`,
            "json": `${node_modules}/maishu-requirejs-plugins/src/json`,

            "react": `${node_modules}/react/umd/react.development`,
            "react-dom": `${node_modules}/react-dom/umd/react-dom.development`,

            "maishu-chitu": `${node_modules}/maishu-chitu/dist/index.min`,
            "maishu-chitu-react": `${node_modules}/maishu-chitu-react/dist/index.min`,
            "maishu-chitu-service": `${node_modules}/maishu-chitu-service/dist/index.min`,
            "maishu-dilu-react": `${node_modules}/maishu-dilu-react/dist/index.min`,
            "maishu-data-page": `${node_modules}/maishu-data-page/dist/index.min`,
            "maishu-image-components": `${node_modules}/maishu-image-components/dist/index.min`,
            "maishu-jueying": `${node_modules}/maishu-jueying/dist/index.min`,
            "maishu-jueying-core": `${node_modules}/maishu-jueying-core/dist/index`,
            "maishu-toolkit": `${node_modules}/maishu-toolkit/dist/index`,
            "maishu-ui-toolkit": `${node_modules}/maishu-ui-toolkit/dist/index`,
            "maishu-wuzhui": `${node_modules}/maishu-wuzhui/dist/index`,
            "maishu-wuzhui-helper": `${node_modules}/maishu-wuzhui-helper/dist/index`,
            "maishu-dilu": `${node_modules}/maishu-dilu/dist/index`,
            "maishu-router": `${node_modules}/maishu-router/dist/index`,

            "devices": `content/devices.css-1.2/assets/devices.min.css`,
            "jquery": `${node_modules}/jquery/dist/jquery.min`,
            "jquery-ui": `content/jquery-ui-1.12.1/jquery-ui.min`,
            "js-md5": `${node_modules}/js-md5/build/md5.min`,

            "url-pattern": `${node_modules}/url-pattern/lib/url-pattern`,
            "ejs": `${node_modules}/ejs/ejs.min`,
        }
    },
    menuItems: [
        {
            id: "AE3789A2-0CF0-4D81-A7C0-E2C9324A1DDD", name: "页面列表", path: "#page-list", sortNumber: 10,
            children: [
                { id: "3CE34AB9-7814-4FE5-85E2-ABA6AAF9C1FD", name: "页面编辑", path: "#page-edit", hidden: true }
            ]
        },
        {
            id: "7B13EC50-A398-4379-AED5-6AB3263EDB75", name: "主题", path: "#theme-list", sortNumber: 20,
        },
        {
            id: "EAC315A7-D8BE-4E85-843B-0D16F3254485", name: "域名绑定", path: "#domain-binding", sortNumber: 30
        },
        {
            id: "FADCEEB3-145D-4131-BCB4-BFCF7D5FE167", name: "链接改写", path: "#url-rewrite", sortNumber: 30
        },
        {
            id: "D0D26AA2-066F-478A-B19C-D8FB8F660905", name: "页面代码", path: "#html-snippet", sortNumber: 40
        },
    ],
    // mode: "production",
    mode: "development",

};
export default websiteConfig;
