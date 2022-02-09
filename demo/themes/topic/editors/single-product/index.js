"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const maishu_jueying_1 = require("maishu-jueying");
const common_1 = require("../../common");
const antd_1 = require("antd");
const React = __importStar(require("react"));
const IMAGE_URL = "imageUrl";
const IMAGE_SIZE = "imageSize";
const PRODUCT_NAME = "productName";
const PRODUCt_URL = "productUrl";
class ImageSizeEditor extends maishu_jueying_1.PropEditor {
    render() {
        return React.createElement(antd_1.Slider, { defaultValue: this.props.value, max: 20, min: 4, onChange: (e) => {
                this.props.updateComponentProp(e);
            } });
    }
}
maishu_jueying_1.Component.setPropEditor({
    componentType: common_1.typeNames.SingleProduct,
    propName: PRODUCT_NAME,
    editorType: maishu_jueying_1.TextInput,
    displayName: "商品名称"
});
maishu_jueying_1.Component.setPropEditor({
    componentType: common_1.typeNames.SingleProduct,
    propName: PRODUCt_URL,
    editorType: maishu_jueying_1.TextInput,
    displayName: "商品链接",
});
maishu_jueying_1.Component.setPropEditor({
    componentType: common_1.typeNames.SingleProduct,
    propName: IMAGE_URL,
    editorType: maishu_jueying_1.TextInput,
    displayName: "商品图片"
});
maishu_jueying_1.Component.setPropEditor({
    componentType: common_1.typeNames.SingleProduct,
    propName: IMAGE_SIZE,
    editorType: ImageSizeEditor,
    displayName: "图片大小"
});
