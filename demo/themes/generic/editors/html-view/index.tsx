import { Component, TextInput } from "maishu-jueying";
import { Props as ComponentProps } from "../../components/html-view/index";
import { typeNames } from "../../../common";

const HTML: keyof ComponentProps = "html";
Component.setPropEditor({
    componentType: typeNames.HtmlView,
    propName: HTML,
    editorType: TextInput,
})

