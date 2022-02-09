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
const antd_1 = require("antd");
const icons_1 = require("@ant-design/icons");
const React = __importStar(require("react"));
const common_1 = require("../../common");
const GRID_COLUMNS = 24;
function SingleProduct(props) {
    let { imageSize, imageTextMargin, buttonText, price, imagePosition, productUrl } = props;
    if (imageSize == undefined)
        imageSize = common_1.propDefaultValues.singleProduct.imageSize;
    if (imageTextMargin == undefined)
        imageTextMargin = common_1.propDefaultValues.singleProduct.imageTextMargin;
    if (buttonText == undefined)
        buttonText = common_1.propDefaultValues.singleProduct.buttonText;
    if (price == undefined)
        price = 0;
    if (imagePosition == undefined)
        imagePosition = common_1.propDefaultValues.singleProduct.imagePosition;
    let imageMaring = `0 ${props.imageTextMargin}px 0`;
    return React.createElement(antd_1.Row, null,
        React.createElement(antd_1.Col, { span: imageSize },
            React.createElement("img", { src: "https://shop-image.gemwon.com/image?id=55036f91-768a-60da-85f5-220afe132bc9_1600_1600", style: { margin: imageMaring, width: "100%" } })),
        React.createElement(antd_1.Col, { span: GRID_COLUMNS - imageSize },
            React.createElement(antd_1.Typography.Title, { level: 2 }, props.productName || ""),
            React.createElement(antd_1.Typography.Title, { level: 3 },
                "$",
                price.toFixed(2)),
            React.createElement(antd_1.Button, { type: "default", size: "large", onClick: e => {
                    if (productUrl)
                        location.href = productUrl;
                } },
                React.createElement(icons_1.ShoppingCartOutlined, null),
                buttonText)));
}
exports.default = SingleProduct;
