import Carousel, { Props } from "../components/carousel/index";
export default function CarouselDesign(props: Props) {
    props = Object.assign({}, props);
    props.autoplay = false;
    return Carousel(props);
}