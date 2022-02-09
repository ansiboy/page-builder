import { Component, TextInput, PropEditor } from "maishu-jueying";
import { Props as ComponentProps } from "../../components/single-product/index";
import { typeNames } from "../../common";
import { ReactNode } from "react";
import { Slider } from "antd";
import * as React from "react";

const IMAGE_URL: keyof ComponentProps = "imageUrl";
const IMAGE_SIZE: keyof ComponentProps = "imageSize";
const PRODUCT_NAME: keyof ComponentProps = "productName";
const PRODUCt_URL: keyof ComponentProps = "productUrl";

class ImageSizeEditor extends PropEditor<number> {
    render(): ReactNode {
        return <Slider defaultValue={this.props.value} max={20} min={4}
            onChange={(e: number) => {
                this.props.updateComponentProp(e)
            }} />
    }
}

Component.setPropEditor({
    componentType: typeNames.SingleProduct,
    propName: PRODUCT_NAME,
    editorType: TextInput,
    displayName: "商品名称"
})

Component.setPropEditor({
    componentType: typeNames.SingleProduct,
    propName: PRODUCt_URL,
    editorType: TextInput,
    displayName: "商品链接",
})

Component.setPropEditor({
    componentType: typeNames.SingleProduct,
    propName: IMAGE_URL,
    editorType: TextInput,
    displayName: "商品图片"
})

Component.setPropEditor({
    componentType: typeNames.SingleProduct,
    propName: IMAGE_SIZE,
    editorType: ImageSizeEditor,
    displayName: "图片大小"
})

