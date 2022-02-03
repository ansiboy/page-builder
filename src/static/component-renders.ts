import { PropertyEditorInfo } from "maishu-jueying";

// 用于生成组件布局 


(window as any)["componentRenders"] = (window as any)["componentRenders"] || {};
let componentRenders = (window as any)["componentRenders"];
function getComponentRenders(): { [typename: string]: (propEditors: PropertyEditorInfo[]) => JSX.Element } {
    return componentRenders;
}

export default class ComponentRenders {
    static setComponentRender(typeName: string, value: (propEditors: PropertyEditorInfo[]) => JSX.Element) {
        let componentRenders = getComponentRenders();
        componentRenders[typeName] = value;
    }

    static getComponentRender(typeName: string): (propEditors: PropertyEditorInfo[]) => JSX.Element {
        let componentRenders = getComponentRenders();
        return componentRenders[typeName];
    }
}