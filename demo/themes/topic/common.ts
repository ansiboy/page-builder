import type { CarouselItem, Props as CarouselProps } from "./components/carousel/index";
import type { Props as SingleProductProps } from "./components/single-product/index";
import { typeNames as baseTypeNames } from "../common";
type SingleProductDefaultProps = Pick<SingleProductProps, "imageSize" | "imageTextMargin" | "buttonText" | "imagePosition">;
let carousel: Pick<CarouselProps, "autoplay"> = { autoplay: true };
let singleProduct: SingleProductDefaultProps = {
    imageSize: 4, imageTextMargin: 10, buttonText: "Buy Now", imagePosition: "left"
};

export let propDefaultValues = {
    carousel, singleProduct
}

export const typeNames = {
    HtmlView: baseTypeNames.HtmlView,
    SingleProduct: "SingleProduct",
    Carousel: "Carousel",
}