import { registerComponent, componentTypes } from "maishu-jueying-core";
import { PageData, } from "../model";
import { errors } from "../errors";
import { LocalService } from "../services";
import * as React from "react";
import { guid } from "maishu-toolkit";
import { Callback } from "maishu-toolkit";
import strings from "../strings";
import { ComponentData } from "../model";
import type ComponentRenders from "../component-renders";

let localRequirejs = require as any as typeof requirejs;

// /** 组件描述信息 */
export interface ComponentInfo {
    /** 组件类型名称 */
    type: string;
    /** 组件显示名称 */
    displayName?: string;
    /** 组件图标 */
    icon?: string;
    /** 组件介绍 */
    introduce?: string;
    /** 组件路经 */
    path?: string;
    design?: string;
    editor?: string;
    layout?: string;
    data?: ComponentData;
    renderSide?: "both" | "server" | "client";
    sortNumber?: number;
    group?: string;
}

export interface DataComponent<Props> {
    loadProps: (props: Props) => Promise<Partial<Props>>
    loadData: (props: Props) => Promise<any>
}

let localService = new LocalService();
export class ComponentLoader {

    loadComponentsComplete = new Callback();
    loadComponentSuccess = new Callback<{ typeName: string, componentInfo: ComponentInfo, pageData: PageData }>();
    loadComponentFail = new Callback<{ typeName: string }>();
    private _pageData: PageData;
    private isDesignMode: boolean;
    private typesToLoad: string[];
    private themeName: string;

    constructor(pageData: PageData, themeName: string, isRuntimeMode?: boolean) {
        this._pageData = pageData;
        this.themeName = themeName;

        isRuntimeMode = isRuntimeMode == null ? false : isRuntimeMode;
        this.isDesignMode = !isRuntimeMode;
        let pageDataComponentTypes: string[] = [];
        let stack: Array<ComponentData> = [...this._pageData.children];

        while (stack.length > 0) {
            let item = stack.pop();

            if (ComponentLoader.isComponentData(item) && pageDataComponentTypes.indexOf(item.type) < 0)
                pageDataComponentTypes.push(item.type);


            if (Array.isArray(item)) {
                item.forEach(c => stack.push(c))
            }
            else {
                for (let key in item) {
                    if (item[key] != null && typeof item[key] == "object")
                        stack.push(item[key]);
                }

            }
        }

        this.typesToLoad = pageDataComponentTypes.filter(o => componentTypes[o] == null);
        for (let i = 0; i < this.typesToLoad.length; i++) {
            let type = this.typesToLoad[i];
            let componentType = componentTypes[type] as any;
            if (componentType == null) {
                registerComponent(type, FakeComponent);
            }
        }
    }

    get pageData() {
        return this._pageData;
    }


    loadComponentTypes() {

        if (this.typesToLoad.length == 0) {
            this.loadComponentsComplete.fire({});
            return;
        }

        let executedCount = 0;
        for (let i = 0; i < this.typesToLoad.length; i++) {
            let type = this.typesToLoad[i];

            loadComponentType(type, this.isDesignMode, this.themeName).then(c => {
                registerComponent(type, c.componentType);
                if (c.componentInfo != null) {
                    this.loadComponentSuccess.fire({
                        typeName: type, componentInfo: c.componentInfo,
                        pageData: this._pageData
                    });
                }
            }).catch(err => {
                console.error(err);
                this.loadComponentFail.fire({ typeName: type });

            }).finally(() => {
                executedCount = executedCount + 1;
                if (executedCount >= this.typesToLoad.length) {
                    this.loadComponentsComplete.fire({});
                }
            })
            // }
        }

    }

    static loadComponentEditor(compoenntInfo: ComponentInfo) {
        return loadComponentEditor(compoenntInfo);
    }

    static loadComponentLayout(compoenntInfo: ComponentInfo) {
        return loadComponentLayout(compoenntInfo);
    }

    private static isComponentData(obj: any) {
        let c: ComponentData = obj;
        return typeof c == "object" && c.id != null && c.parentId != null && c.id != null && c.props != null;
    }

}


async function loadComponentType(typeName: string, isDesignMode: boolean, themeName: string) {
    let componentInfos = await localService.componentInfos(themeName);
    let componentInfo = componentInfos.filter(o => o.type == typeName)[0];
    if (componentInfo == null) {
        let error = errors.canntFindComponentInfo(typeName);;
        let componentType = createInfoComponent(error.message);
        return { componentType, componentInfo };

    }

    let path = isDesignMode ? componentInfo.design || componentInfo.path : componentInfo.path;

    let componentType = await new Promise<React.ComponentClass<any>>((resolve, reject) => {
        localRequirejs([`${path}`], (mod) => {
            let compoenntType1: React.ComponentClass<any> = mod[typeName] || mod["default"];
            if (compoenntType1 == null)
                throw errors.moduleNotExport(path, typeName);

            if (compoenntType1.prototype.isReactComponent == undefined && typeof compoenntType1 == "function") {
                let c = compoenntType1;
                compoenntType1 = class extends React.Component {
                    render(): React.ReactNode {
                        return React.createElement("div", {}, React.createElement(c, this.props));
                    }
                }
            }

            let d = compoenntType1 as any as DataComponent<any>;
            if (typeof d.loadData == "function") {
                compoenntType1 = createComponent(d.loadData, compoenntType1)
            }

            componentTypes[typeName] = compoenntType1;
            resolve(compoenntType1);

        }, (err: any) => {
            let text = typeof err == "string" ? err : err.message;
            let componentType = createInfoComponent(text);
            // return { componentType, componentInfo };
            // reject(err);
            console.error(err);
            resolve(componentType)
        })

    })

    return { componentType, componentInfo };
}

async function loadComponentEditor(componentInfo: ComponentInfo): Promise<any> {
    if (componentInfo?.editor == null)
        return Promise.resolve();

    return new Promise((resolve, reject) => {
        console.log(`Load component editor ${componentInfo.editor}.`)
        localRequirejs([`${componentInfo.editor}`], (mod) => {
            resolve(mod);
        }, err => {
            let text = typeof err == "string" ? err : err.message;
            let componentType = createInfoComponent(text);
            resolve(componentType);
        })

    })
}

async function loadComponentLayout(componentInfo: ComponentInfo): Promise<any> {
    if (componentInfo?.layout == null)
        return Promise.resolve();
    //import { componentRenders } from "../component-renders/index";
    return new Promise((resolve, reject) => {
        (require as any)([`${componentInfo.layout}`, "../component-renders"], (mod: any, renderModule: any) => {
            let func = mod?.default || mod;
            if (typeof func != "function") {
                console.error(`Module ${componentInfo.layout} is not a function.`)
                resolve({});
            }

            let componentRenders = renderModule.default as typeof ComponentRenders;
            componentRenders.setComponentRender(componentInfo.type, mod.default || mod);
            resolve(mod);
        }, (err: any) => {
            reject(err);
        })

    })
}

export class FakeComponent extends React.Component<any> {
    render() {
        return <div key={this.props.id || guid()} style={{ padding: "50px 0 50px 0", textAlign: "center" }}>
            组件正在加载中...
        </div>
    }
}

export function createComponentLoadFail(error: any, reload: () => void) {
    return class ComponentLoadFail extends React.Component {
        render() {
            let msg = typeof error == "string" ? error : error.message;
            return <div>
                <div onClick={e => reload()}>组件加载错误, 点击重新加载</div>
                <div>{msg}</div>
            </div>
        }
    }

}

export function createInfoComponent(text: string) {
    return class InfoComponent extends React.Component {
        render() {
            return <div className="text-center" style={{ paddingTop: 20, paddingBottom: 20 }}>
                {text}
            </div>
        }
    }

}

export function createComponent(loadData: (props: any) => Promise<any>, originalCompoenntType) {

    return class extends React.Component<any, { data?: any }> {
        constructor(props: any) {
            super(props);

            this.state = {};
            loadData(props).then(data => {
                this.setState({ data });
            })
        }

        render() {
            let { data } = this.state;
            if (data === undefined)
                return <div className="empty">{strings.dataLoading}</div>

            let props = Object.assign({}, this.props, { data });
            let e = React.createElement(originalCompoenntType, props);
            return e;
        }
    }

}