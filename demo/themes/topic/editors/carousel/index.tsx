import { Component, PropEditor, PropEditorState, TextInput, } from "maishu-jueying";
import "./items-editor.less";
import Carousel, { Props as ComponentProps, CarouselItem } from "../../components/carousel/index";
import * as  React from "react";
import { List, Image, Button, Modal, Form, Input, FormInstance, Badge, Popconfirm } from "antd";
import { PlusOutlined, SaveOutlined, CloseOutlined, RollbackOutlined } from "@ant-design/icons";
import { propDefaultValues } from "../../common";
import Item from "antd/lib/list/Item";
import { typeNames } from "../../common";

import "./index.less";

let ITEMS: keyof ComponentProps = "items";
let AUTOPLAY: keyof ComponentProps = "autoplay";

Component.setPropEditor({
    componentType: typeNames.Carousel,
    propName: AUTOPLAY,
    editorType: toggle(),
    displayName: "自动播放",
    defaultValue: propDefaultValues.carousel.autoplay,
})

Component.setPropEditor({
    componentType: typeNames.Carousel,
    propName: ITEMS,
    editorType: imageListEditor(),
    displayName: "轮播图片"
})


export function toggle(options?: { defaultValue?: boolean }) {
    options = Object.assign({ defaultValue: false } as typeof options, options || {});
    return class extends PropEditor<boolean | undefined, PropEditorState<boolean>>{
        render() {
            let { value } = this.props;
            value = value == undefined ? options?.defaultValue : value;
            return <label className="pull-left switch">
                <input type="checkbox" className="ace ace-switch ace-switch-5"
                    checked={value}
                    onChange={e => {
                        this.props.updateComponentProp(e.target.checked);
                    }} />
                <span className="lbl middle"></span>
            </label>
        }
    }
}

const PC_IMAGE: keyof CarouselItem = "imageUrl";
const MOBILE_IMAGE: keyof CarouselItem = "mobileImageUrl";
const PAGE_URL: keyof CarouselItem = "targetUrl";

export function imageListEditor() {

    return class ImagesEditor extends PropEditor<ComponentProps["items"], { modalVisible: boolean, currentItem: CarouselItem }> {
        private form: FormInstance<any>;

        constructor(props: ImagesEditor["props"]) {
            super(props)

            this.state = { modalVisible: false, currentItem: {} as CarouselItem };
        }

        showDialog(item?: CarouselItem) {
            item = item || {} as CarouselItem;
            this.setState({ modalVisible: true, currentItem: item });
        }

        hideDialog() {
            this.setState({ modalVisible: false });
        }

        removeItem(item: CarouselItem) {
            let items: CarouselItem[] = this.props.value || [];
            items = items.filter(o => o != item);
            this.props.updateComponentProp(items);
        }

        async save() {
            await this.form.validateFields();
            let items: CarouselItem[] = this.props.value || [];
            let { currentItem } = this.state;
            if (!currentItem.id) {
                currentItem.id = Date.now();
                items.push(currentItem);
            }

            this.props.updateComponentProp(items);
            this.hideDialog();
        }

        render(): React.ReactNode {
            let { value } = this.props;
            value = value == null ? [] : value;
            let { modalVisible, currentItem } = this.state;
            return <>
                <List dataSource={value}
                    renderItem={item => <List.Item>
                        <Image src={item.imageUrl} onClick={e => this.showDialog(item)} preview={false} style={{ cursor: "pointer" }} />
                        <Popconfirm title={`确定删除吗`} onConfirm={e => this.removeItem(item)}>
                            <CloseOutlined className="carousel-remove-button" />
                        </Popconfirm>
                    </List.Item>}
                    footer={<Button icon={<PlusOutlined />} type="primary" block onClick={() => this.showDialog()}>添加</Button>}>
                </List>
                <Modal title="添加图片" visible={modalVisible} onCancel={() => this.hideDialog()} onOk={() => this.save()}
                    okButtonProps={{ icon: <SaveOutlined />, htmlType: "submit" }} cancelButtonProps={{ icon: <RollbackOutlined /> }}>
                    <Form ref={e => this.form = e || this.form} labelCol={{ span: 4 }}>
                        <Form.Item label="PC 端图片" name={PC_IMAGE} required rules={[{ required: true, message: "请输入 PC 端图片" }]}>
                            <Input
                                ref={e => {
                                    if (!e) return;
                                    e.setValue(currentItem.imageUrl || "");
                                }}
                                onChange={e => {
                                    currentItem.imageUrl = e.target.value;
                                    this.setState({ currentItem });
                                }} />
                        </Form.Item>
                        <Form.Item label="移动端图片" name={MOBILE_IMAGE}>
                            <Input
                                ref={e => {
                                    if (!e) return;
                                    e.setValue(currentItem.mobileImageUrl || "")
                                }}
                                onChange={e => {
                                    currentItem.mobileImageUrl = e.target.value;
                                    this.setState({ currentItem });
                                }} />
                        </Form.Item>
                        <Form.Item label="页面链接" name={PAGE_URL} required rules={[{ required: true, message: "请输入页面链接" }]}>
                            <Input
                                ref={e => {
                                    if (!e) return;
                                    e.setValue(currentItem.targetUrl || "")
                                }}
                                onChange={e => {
                                    currentItem.targetUrl = e.target.value;
                                    this.setState({ currentItem });
                                }} />
                        </Form.Item>
                    </Form>
                </Modal>
            </>
        }
    }
}

