"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../components/carousel/index"));
function CarouselDesign(props) {
    props = Object.assign({}, props);
    props.autoplay = false;
    return index_1.default(props);
}
exports.default = CarouselDesign;
