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
exports.imageListEditor = exports.toggle = void 0;
const maishu_jueying_1 = require("maishu-jueying");
require("./items-editor.less");
const React = __importStar(require("react"));
const antd_1 = require("antd");
const icons_1 = require("@ant-design/icons");
const common_1 = require("../../common");
const common_2 = require("../../common");
require("./index.less");
let ITEMS = "items";
let AUTOPLAY = "autoplay";
maishu_jueying_1.Component.setPropEditor({
    componentType: common_2.typeNames.Carousel,
    propName: AUTOPLAY,
    editorType: toggle(),
    displayName: "自动播放",
    defaultValue: common_1.propDefaultValues.carousel.autoplay,
});
maishu_jueying_1.Component.setPropEditor({
    componentType: common_2.typeNames.Carousel,
    propName: ITEMS,
    editorType: imageListEditor(),
    displayName: "轮播图片"
});
function toggle(options) {
    options = Object.assign({ defaultValue: false }, options || {});
    return class extends maishu_jueying_1.PropEditor {
        render() {
            let { value } = this.props;
            value = value == undefined ? options?.defaultValue : value;
            return React.createElement("label", { className: "pull-left switch" },
                React.createElement("input", { type: "checkbox", className: "ace ace-switch ace-switch-5", checked: value, onChange: e => {
                        this.props.updateComponentProp(e.target.checked);
                    } }),
                React.createElement("span", { className: "lbl middle" }));
        }
    };
}
exports.toggle = toggle;
const PC_IMAGE = "imageUrl";
const MOBILE_IMAGE = "mobileImageUrl";
const PAGE_URL = "targetUrl";
function imageListEditor() {
    return class ImagesEditor extends maishu_jueying_1.PropEditor {
        constructor(props) {
            super(props);
            this.state = { modalVisible: false, currentItem: {} };
        }
        showDialog(item) {
            item = item || {};
            this.setState({ modalVisible: true, currentItem: item });
        }
        hideDialog() {
            this.setState({ modalVisible: false });
        }
        removeItem(item) {
            let items = this.props.value || [];
            items = items.filter(o => o != item);
            this.props.updateComponentProp(items);
        }
        async save() {
            await this.form.validateFields();
            let items = this.props.value || [];
            let { currentItem } = this.state;
            if (!currentItem.id) {
                currentItem.id = Date.now();
                items.push(currentItem);
            }
            this.props.updateComponentProp(items);
            this.hideDialog();
        }
        render() {
            let { value } = this.props;
            value = value == null ? [] : value;
            let { modalVisible, currentItem } = this.state;
            return React.createElement(React.Fragment, null,
                React.createElement(antd_1.List, { dataSource: value, renderItem: item => React.createElement(antd_1.List.Item, null,
                        React.createElement(antd_1.Image, { src: item.imageUrl, onClick: e => this.showDialog(item), preview: false, style: { cursor: "pointer" } }),
                        React.createElement(antd_1.Popconfirm, { title: `确定删除吗`, onConfirm: e => this.removeItem(item) },
                            React.createElement(icons_1.CloseOutlined, { className: "carousel-remove-button" }))), footer: React.createElement(antd_1.Button, { icon: React.createElement(icons_1.PlusOutlined, null), type: "primary", block: true, onClick: () => this.showDialog() }, "\u6DFB\u52A0") }),
                React.createElement(antd_1.Modal, { title: "\u6DFB\u52A0\u56FE\u7247", visible: modalVisible, onCancel: () => this.hideDialog(), onOk: () => this.save(), okButtonProps: { icon: React.createElement(icons_1.SaveOutlined, null), htmlType: "submit" }, cancelButtonProps: { icon: React.createElement(icons_1.RollbackOutlined, null) } },
                    React.createElement(antd_1.Form, { ref: e => this.form = e || this.form, labelCol: { span: 4 } },
                        React.createElement(antd_1.Form.Item, { label: "PC \u7AEF\u56FE\u7247", name: PC_IMAGE, required: true, rules: [{ required: true, message: "请输入 PC 端图片" }] },
                            React.createElement(antd_1.Input, { ref: e => {
                                    if (!e)
                                        return;
                                    e.setValue(currentItem.imageUrl || "");
                                }, onChange: e => {
                                    currentItem.imageUrl = e.target.value;
                                    this.setState({ currentItem });
                                } })),
                        React.createElement(antd_1.Form.Item, { label: "\u79FB\u52A8\u7AEF\u56FE\u7247", name: MOBILE_IMAGE },
                            React.createElement(antd_1.Input, { ref: e => {
                                    if (!e)
                                        return;
                                    e.setValue(currentItem.mobileImageUrl || "");
                                }, onChange: e => {
                                    currentItem.mobileImageUrl = e.target.value;
                                    this.setState({ currentItem });
                                } })),
                        React.createElement(antd_1.Form.Item, { label: "\u9875\u9762\u94FE\u63A5", name: PAGE_URL, required: true, rules: [{ required: true, message: "请输入页面链接" }] },
                            React.createElement(antd_1.Input, { ref: e => {
                                    if (!e)
                                        return;
                                    e.setValue(currentItem.targetUrl || "");
                                }, onChange: e => {
                                    currentItem.targetUrl = e.target.value;
                                    this.setState({ currentItem });
                                } })))));
        }
    };
}
exports.imageListEditor = imageListEditor;
