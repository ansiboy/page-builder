"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.components = void 0;
const common_1 = require("./common");
exports.components = [];
const node_modules = "../themes/topic/node_modules";
let w = {
    components: [{
            displayName: "轮播",
            icon: "fa fa-text-width",
            type: "Carousel",
            path: "./components/carousel/index",
            editor: "./editors/carousel/index",
            design: "./design/carousel",
        },
        {
            displayName: "单个商品",
            icon: "fa fa-text-width",
            type: common_1.typeNames.SingleProduct,
            path: "./components/single-product/index",
            editor: "./editors/single-product/index",
        },
        {
            displayName: "单排商品",
            icon: "fa fa-text-width",
            type: common_1.typeNames.RowProducts,
            path: "./components/row-products/index",
            editor: "./editors/row-product/index",
        },
        {
            displayName: "图文列表",
            icon: "fa fa-text-width",
            type: common_1.typeNames.ImageTextList,
            path: "./components/image-text-list/index",
            editor: "./editors/image-text-list/index",
        },
        {
            displayName: "HTML",
            icon: "fa fa-text-width",
            type: common_1.typeNames.HtmlView,
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
        shim: {},
        paths: {
            "antd": `${node_modules}/antd/dist/antd.min`,
            "@ant-design/icons": `${node_modules}/@ant-design/icons/dist/index.umd`,
            "moment": `${node_modules}/moment/moment`,
        }
    }
};
exports.default = w;
