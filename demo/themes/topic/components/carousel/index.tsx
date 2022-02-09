import * as React from "react";
import type { LoadData } from "../../../../../out/index";
import "./index.less";
import { Carousel, Empty } from "antd";
import "/themes/topic/node_modules/antd/dist/antd.css";
import { propDefaultValues } from "../../common";

export interface CarouselItem {
    id: number,
    imageUrl: string,
    mobileImageUrl?: string,
    targetUrl: string
}

export interface Props {
    // pcImageUrls: string[],
    // mobileImageUrls: string[],
    cutPosition: 'LeftTop' | 'MiddleTop' | 'RightTop' |
    'LeftMiddle' | 'Center' | 'RightMiddle' |
    'LeftBottom' | 'MiddleBottom' | 'RightBottom',
    items: CarouselItem[],
    data: {
        categories: any[]
    },
    autoplay: boolean,
}


export default function MyCarousel(props: Props) {
    let { items, autoplay } = props;
    if (autoplay == null)
        autoplay = propDefaultValues.carousel.autoplay;

    if (items == null || items.length == 0)
        return <Empty />

    return <Carousel autoplay={autoplay}>
        {items.map(o => <img key={o.imageUrl} src={o.imageUrl} />)}
    </Carousel>
}

export let loadData: LoadData<Props, Props["data"]> = async (props: Props) => {
    let data = {
        categories: []
    }

    return data;
}

