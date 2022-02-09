"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const maishu_jueying_1 = require("maishu-jueying");
const common_1 = require("../../../common");
const HTML = "html";
maishu_jueying_1.Component.setPropEditor({
    componentType: common_1.typeNames.HtmlView,
    propName: HTML,
    editorType: maishu_jueying_1.TextInput,
});
