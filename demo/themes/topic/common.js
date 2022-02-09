"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeNames = exports.propDefaultValues = void 0;
const common_1 = require("../common");
let carousel = { autoplay: true };
let singleProduct = {
    imageSize: 4, imageTextMargin: 10, buttonText: "Buy Now", imagePosition: "left"
};
exports.propDefaultValues = {
    carousel, singleProduct
};
exports.typeNames = {
    HtmlView: common_1.typeNames.HtmlView,
    SingleProduct: "SingleProduct",
    Carousel: "Carousel",
    RowProducts: "RowProducts",
    ImageTextList: "ImageTextList",
};
