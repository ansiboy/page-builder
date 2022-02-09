// import type { WebsiteConfig as BaseWebsiteConfig } from "maishu-chitu-scaffold/static/website-config";
import { ComponentInfo } from "../../../out/static/controls/component-loader";
import { typeNames } from "./common";

type WebsiteConfig = { components: ComponentInfo[], requirejs?: any };
export let components: ComponentInfo[] = [

];
const node_modules = "../themes/topic/node_modules"
let w: WebsiteConfig = {
    components: [{
        displayName: "轮播",
        icon: "fa fa-text-width",
        type: "Carousel",
        path: "./components/carousel/index",
        editor: "./editors/carousel/index",
        design: "./design/carousel",
        // layout: "./layout/carousel"
        // renderSide: "server",
        // layout: '../generic/component-editor-renders/html'
    },
    {
        displayName: "单个商品",
        icon: "fa fa-text-width",
        type: typeNames.SingleProduct,
        path: "./components/single-product/index",
        editor: "./editors/single-product/index",
    },
    {
        displayName: "HTML",
        icon: "fa fa-text-width",
        type: typeNames.HtmlView,
        path: "../generic/components/html-view/index",
        editor: "../generic/editors/html-view/index",
        layout: '../generic/component-editor-renders/html'
    },
    {
        displayName: "Menu",
        icon: "fa fa-text-width",
        type: "Menu",
        path: "./components/menu/index",
        editor: "./editors/menu/index",
    },
    {
        displayName: "Footer",
        icon: "fa fa-text-width",
        type: "Footer",
        path: "./components/footer/index",
        editor: "./editors/footer/index",
    },
    {
        displayName: "容器",
        icon: "fa fa-text-width",
        type: "ComponentContainer",
    }],
    requirejs: {
        // context: "topic",
        shim: {
        },
        paths: {
            "antd": `${node_modules}/antd/dist/antd.min`,
            "@ant-design/icons": `${node_modules}/@ant-design/icons/dist/index.umd`,
            "moment": `${node_modules}/moment/moment`,
        }
    }

}

export default w;