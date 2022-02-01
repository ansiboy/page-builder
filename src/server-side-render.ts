import { ComponentData, componentTypes, Page, PageData, parseComponentData } from "maishu-jueying-core";
import * as path from "path";
import * as fs from "fs";

import { Errors as BaseErrors } from "maishu-toolkit";
import { ComponentInfo } from "./static/model";
import { renderToString } from "react-dom/server";
import React = require("react");

export type LoadData<Props, T> = (props: Props) => Promise<Partial<T>>;
export type WebsiteConfig = { components: ComponentInfo[] };
const dataIdName = "data-id";

export class ServerSideRender {

    static async renderPage(pageData: PageData, websiteConfig: WebsiteConfig, themePhysicalPath: string): Promise<{ html: string, componentDatas: { [id: string]: any } }> {

        this.loadComponentTypes(pageData, websiteConfig, themePhysicalPath);
        let componentDatas = await this.loadComponentData(pageData);

        var stack: ComponentData[] = [pageData];
        let item = stack.shift();
        while (item != null) {
            if (item.type == Page.typeName) {
                item.props.pageData = pageData;
            }
            var children = (item.children || []).filter(o => typeof o != "string") as ComponentData[];
            stack.push(...children);
            item = stack.shift();
        }

        let element = parseComponentData(pageData);
        var html = renderToString(element);

        return { html, componentDatas };
    }

    private static loadComponentTypes(pageData: PageData, websiteConfig: WebsiteConfig, themePhysicalPath: string) {

        let componentInfos = (websiteConfig.components as ComponentInfo[]);
        let componentTypeNames = pageData.children.map(p => p.type);

        componentInfos.forEach(c => {
            if (componentTypeNames.indexOf(c.type) < 0 || componentTypes[c.type])
                return;

            if (!c.path) {
                throw new Error(`Path of component '${c.type}' is null.`);
            }

            let componentPath = path.join(themePhysicalPath, `${c.path}.js`);
            if (!fs.existsSync(componentPath))
                throw errors.fileNotExists(componentPath);

            let componentTypeModule = require(componentPath);
            let componentType: React.ComponentClass = componentTypeModule.default || componentTypeModule;
            let render = componentType.prototype.render as Function;
            if (render == null) {
                throw new Error(`Component '${c.type}' has none render method, path is '${c.path}'.`);
            }
            componentType.prototype.render = function () {
                return React.createElement("div", { id: this.props[dataIdName] || "" }, render.apply(this, arguments));
            }
            componentTypes[c.type] = componentType;
        })
    }

    private static async loadComponentData(pageData: PageData): Promise<{ [id: string]: any }> {
        var r: { [id: string]: any } = {};
        var componentInfos = pageData.children || [];
        var loadDataPromises: LoadData<any, any>[] = [];
        for (let i = 0; i < componentInfos.length; i++) {
            let componentData = componentInfos[i];
            let type = componentTypes[componentData.type];
            if (type == null) {
                throw errors.componentTypeNotExists(componentData.type);
            }

            let loadData: LoadData<any, any> = type["loadData"] || Promise.resolve({});
            loadDataPromises.push(loadData);

        }

        let componentDatas = await Promise.all(loadDataPromises)
        for (let i = 0; i < componentInfos.length; i++) {
            componentInfos[i].props.data = componentInfos[i].props.data || {};
            componentInfos[i].props[dataIdName] = componentInfos[i].id;
            Object.assign(componentInfos[i].props.data, componentDatas[i] || {});
        }

        return r;
    }
}



class Errors extends BaseErrors {
    fileNotExists(filePath: string) {
        let msg = `File '${filePath}' is not exists.`;
        return new Error(msg);
    }
    componentTypeNotExists(name: string) {
        let msg = `Component '${name}' not exists.`;
        return new Error(msg);
    }
}

export let errors = new Errors();

