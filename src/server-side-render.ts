import { ComponentData, componentTypes, PageBody, PageData, PageFooter, PageHeader, parseComponentData } from "maishu-jueying-core";
import * as path from "path";
import * as fs from "fs";

import { Errors as BaseErrors } from "maishu-toolkit";
import { ComponentInfo } from "./static/model";
import { renderToString } from "react-dom/server";

export type LoadData<Props, T> = (props: Props) => Promise<Partial<T>>;
export type WebsiteConfig = { components: ComponentInfo[] };

export class ServerSideRender {

    static async renderPage(pageData: PageData, websiteConfig: WebsiteConfig, themePhysicalPath: string): Promise<{ html: string, componentDatas: { [id: string]: any } }> {

        this.loadComponentTypes(pageData, websiteConfig, themePhysicalPath);
        let componentDatas = await this.loadComponentData(pageData);

        let headerChildren = (pageData.children || []).filter(o => o.parentId == PageHeader.id);
        let bodyChildren = (pageData.children || []).filter(o => o.parentId == PageBody.id);
        let footerChildren = (pageData.children || []).filter(o => o.parentId == PageFooter.id);

        let headerHtml = this.renderComponentDatas(headerChildren, websiteConfig);
        let bodyHtml = this.renderComponentDatas(bodyChildren, websiteConfig);
        let footerHtml = this.renderComponentDatas(footerChildren, websiteConfig);

        let html = `<div class="header">${headerHtml}</div>
        <div class="body">${bodyHtml}</div>
        <div class="footer">${footerHtml}</div>`;

        return { html, componentDatas };
    }


    private static renderComponentDatas(componentDatas: ComponentData[], websiteConfig: WebsiteConfig): string {
        let componentInfos = websiteConfig.components || [];
        var htmls = componentDatas
            .map(o => ({
                id: o.id, element: parseComponentData(o),
                renderSite: componentInfos.filter(c => c.type == o.type)[0]?.renderSide
            }))
            .map(o => ({ id: o.id, html: o.renderSite != "client" ? renderToString(o.element) : "" }))
            .map(o => `<div id=${o.id}>${o.html}</div>`);

        return htmls.join("");
    }

    private static loadComponentTypes(pageData: PageData, websiteConfig: WebsiteConfig, themePhysicalPath: string) {

        let componentInfos = (websiteConfig.components as ComponentInfo[]);
        let componentTypeNames = pageData.children.map(p => p.type);

        componentInfos.forEach(c => {
            if (componentTypeNames.indexOf(c.type) < 0)
                return;

            let componentPath = path.join(themePhysicalPath, `${c.path}.js`);
            if (!fs.existsSync(componentPath))
                throw errors.fileNotExists(componentPath);

            let componentTypeModule = require(componentPath);
            let componentType = componentTypeModule.default || componentTypeModule;

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

