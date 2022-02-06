type WebsiteConfig = { requirejs: any };
type MyWebsiteConfig = WebsiteConfig & {
    // componentStations: { aixpi: string, flone: string, generic: string, "gemwon-pc": string },
    // componentShare: string, 
    // storePort: number, 
    adminApiRoot: string, adminPageRoot: string, userApiRoot: string,
    themesDirectoryName: string, adminActions: typeof adminActions,
};


//==========================================================================
// 常用配置
// export let themeHost = "127.0.0.1:6839";//"finememo.com/themes";//
// let storePort = 5218;
//==========================================================================

// export let themesRoot = "themes";


export let libVirtualPath = "lib";

const adminApiRoot = "admin-api/";
const adminPageRoot = "/";
const userApiRoot = "user-api/";

/** 管理端 actions */
export let adminActions = {
    pageData: {
        list: `/${adminApiRoot}page-data/list`,
        add: `/${adminApiRoot}page-data/add`,
        update: `/${adminApiRoot}page-data/update`,
        remove: `/${adminApiRoot}page-data/remove`,
        item: `/${adminApiRoot}page-data/item`,
        temp: `/${adminApiRoot}page-data/temp`,
    },
    api: {
        themes: `/${adminApiRoot}themes`
    },
    pages: {
        preview: `${adminPageRoot}preview/:pageDataId`
    }
}

/** 用户端 actions */
export let userActions = {
    getComponentDatas: `/${userApiRoot}componentDatas/:key`
}


let node_modules = "/node_modules";
let websiteConfig: MyWebsiteConfig = {
    //===================================================
    // 组件站点配置
    // componentStations: {
    //     aixpi: `http://${themeHost}/designer/aixpi`,
    //     flone: `http://${themeHost}/designer/flone`,
    //     generic: `http://${themeHost}/designer/generic`,
    //     "gemwon-pc": `http://${themeHost}/designer/gemwon-pc`,
    // },
    // componentShare: `http://${themeHost}/share`,
    //===================================================
    // storePort: storePort,
    requirejs: {
        context: "site",
        shim: {
            "node_modules/bootstrap/js/button": { deps: ["jquery"], exports: "jQuery" },
            "node_modules/bootstrap/js/dropdown": { deps: ["jquery"], exports: "jQuery" },
            "node_modules/bootstrap/dist/js/bootstrap": { deps: ["jquery"], exports: "jQuery" },
            // "jquery-ui": { deps: ["css!jquery-ui-css"] }
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
            "maishu-image-components": `${node_modules}/maishu-image-components/dist/index`,
            "maishu-jueying": `${node_modules}/maishu-jueying/dist/index`,
            "maishu-jueying-core": `${node_modules}/maishu-jueying-core/dist/index`,
            "maishu-toolkit": `${node_modules}/maishu-toolkit/dist/index`,
            "maishu-ui-toolkit": `${node_modules}/maishu-ui-toolkit/dist/index`,
            "maishu-ui-toolkit/out": `${node_modules}/maishu-ui-toolkit/out`,
            "maishu-wuzhui": `${node_modules}/maishu-wuzhui/dist/index`,
            "maishu-wuzhui-helper": `${node_modules}/maishu-wuzhui-helper/dist/index`,
            "maishu-dilu": `${node_modules}/maishu-dilu/dist/index`,
            "maishu-router": `${node_modules}/maishu-router/dist/index`,

            "devices": `content/devices.css-1.2/assets/devices.min.css`,
            // "jquery": `https://www.unpkg.com/jquery@3.6.0/dist/jquery.min`,
            "jquery": `${node_modules}/jquery/dist/jquery.min`,
            "jquery-ui": `content/jquery-ui-1.12.1/jquery-ui.min`,
            // "jquery-ui-css": `https://unpkg.com/jqueryui@1.11.1/jquery-ui`,
            "js-md5": `${node_modules}/js-md5/build/md5.min`,

            "url-pattern": `${node_modules}/url-pattern/lib/url-pattern`,
            "ejs": `${node_modules}/ejs/ejs.min`,
        },
    },
    adminApiRoot,
    adminPageRoot,
    userApiRoot,
    themesDirectoryName: "themes",
    adminActions,

};
export default websiteConfig;
export const componentReactFactory = "componentElement";

