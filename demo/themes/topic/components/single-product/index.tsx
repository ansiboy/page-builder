import { Row, Col, Image, Typography, Button, Anchor } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import * as React from "react";
import { propDefaultValues } from "../../common";

const GRID_COLUMNS = 24;

export interface Props {
    productName: string,
    displayName: boolean,
    price: number,
    showPrice: boolean,
    buttonText: string,
    imagePosition: "left" | "right",
    imageUrl: string,

    /** 图片大小 */
    imageSize: number,

    /** 图片与文本之间的边距 */
    imageTextMargin: number,

    /** 商品链接 */
    productUrl: string,
}

export default function SingleProduct(props: Props) {
    let { imageSize, imageTextMargin, buttonText, price, imagePosition, productUrl } = props;
    if (imageSize == undefined)
        imageSize = propDefaultValues.singleProduct.imageSize;

    if (imageTextMargin == undefined)
        imageTextMargin = propDefaultValues.singleProduct.imageTextMargin;

    if (buttonText == undefined)
        buttonText = propDefaultValues.singleProduct.buttonText;

    if (price == undefined)
        price = 0;

    if (imagePosition == undefined)
        imagePosition = propDefaultValues.singleProduct.imagePosition;

    let imageMaring = `0 ${props.imageTextMargin}px 0`;

    return <Row>
        <Col span={imageSize}>
            <img src="https://shop-image.gemwon.com/image?id=55036f91-768a-60da-85f5-220afe132bc9_1600_1600" style={{ margin: imageMaring, width: "100%" }} />
        </Col>
        <Col span={GRID_COLUMNS - imageSize}>
            <Typography.Title level={2}>
                {props.productName || ""}
            </Typography.Title>
            <Typography.Title level={3}>
                ${price.toFixed(2)}
            </Typography.Title>
            <Button type="default" size="large"
                onClick={e => {
                    if (productUrl)
                        location.href = productUrl;

                }}>
                <ShoppingCartOutlined />
                {buttonText}
            </Button>
        </Col>
    </Row>
}