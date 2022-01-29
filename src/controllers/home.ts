import { action, RequestResult, routeData, ServerContext, serverContext, controller } from "maishu-node-mvc";
import { dataStorage } from "../decoders";
import { errors } from "../static/errors";

import { actions, default as w } from "../static/website-config";
import { DataStorage } from "data-storage";
import { ComponentData, componentTypes, PageBody, PageData, PageFooter, PageHeader } from "maishu-jueying-core";
import * as React from "react";
import { renderToString } from "react-dom/server";
import * as fs from "fs";
import { ComponentInfo } from "static/model";
import { PageRecord } from "entities";
import * as path from "path";

export type LoadData<Props, T> = (props: Props) => Promise<Partial<T>>;
type MyComponentData = ComponentData & { loadedData?: any };

@controller(`${w.adminPageRoot}home`)
export class HomeController {

    @action(actions.pages.preview)
    async preivew(@routeData d: { pageDataId: string }, @dataStorage storage: DataStorage, @serverContext context: ServerContext) {
        if (!d.pageDataId) throw errors.routeDataFieldNull("pageDataId");

        var pageRecord = await storage.item(d.pageDataId, context.req);
        if (!pageRecord) throw errors.objectNotExists("PageData", d.pageDataId);

        var pageData = pageRecord.pageData;



        this.loadComponentTypes(context, pageRecord);

        let html = await this.renderPage(pageData)
        let c: RequestResult = { content: html, headers: {}, statusCode: 200 };
        return c;
        //return pageData;
    }

    loadComponentTypes(context: ServerContext, pageRecord: PageRecord) {

        let themeName = pageRecord.themeName;
        let themeDirectory = context.rootDirectory.findDirectory(`static/themes/${pageRecord.themeName}`);
        console.assert(themeDirectory, "theme directory is null");

        let themePhysicalPath = themeDirectory.physicalPath;
        let themeVirtualPath = themeDirectory.virtualPath;
        let websiteConfigPath = path.join(themePhysicalPath, "website-config.js");//context.rootDirectory.findFile(`static/themes/${pageRecord.themeName}/website-config.js`);
        if (!fs.existsSync(websiteConfigPath)) {
            throw errors.fileNotExists(websiteConfigPath);
        }

        let websiteConfigModule = require(websiteConfigPath);
        let websiteConfig = websiteConfigModule.default || websiteConfigModule;
        let componentInfos = (websiteConfig.components as ComponentInfo[]);
        let componentTypeNames = pageRecord.pageData.children.map(p => p.type);

        componentInfos.forEach(c => {
            if (componentTypeNames.indexOf(c.type) < 0)
                return;

            // let componentPath = path.join(__dirname, `../static/${themeName}/${c.path}.server.js`);
            // if (!fs.existsSync(componentPath)) {
            // throw errors.fileNotExists(componentPath);
            let componentPath = path.join(themePhysicalPath, `${c.path}.js`);
            if (!fs.existsSync(componentPath))
                throw errors.fileNotExists(componentPath);
            // }

            let componentTypeModule = require(componentPath);
            let componentType = componentTypeModule.default || componentTypeModule;

            componentTypes[c.type] = componentType;
        })
    }

    private async renderPage(pageData: PageData) {
        let headerChildren = (pageData.children || []).filter(o => (o as ComponentData).parentId == PageHeader.id) as ComponentData[];
        let bodyChildren = (pageData.children || []).filter(o => (o as ComponentData).parentId == PageBody.id) as ComponentData[];
        let footerChildren = (pageData.children || []).filter(o => (o as ComponentData).parentId == PageFooter.id) as ComponentData[];
        let [headerHtml, bodyHtml, footerHtml] = await Promise.all([
            HomeController.renderComponentDatas(headerChildren),
            HomeController.renderComponentDatas(bodyChildren),
            HomeController.renderComponentDatas(footerChildren),
        ])

        let html = `<div class="header">${headerHtml}</div>
<div class="body">${bodyHtml}</div>
<div class="footer">${footerHtml}</div>`;
        return html;
    }

    /**
     * 将多个组件数据转换为 HTML
     * @param componentDatas 多个组件数据
     * @returns 多个组件数据对应的 HTML
     */
    static async renderComponentDatas(componentDatas: ComponentData[]): Promise<string> {
        let componentHtmls = await Promise.all(componentDatas.map(c => HomeController.parseComponentData(c)));
        let html = componentHtmls.join("\r\n");
        return html;
    }


    static async parseComponentData(componentData: MyComponentData): Promise<string> {
        let type = componentTypes[componentData.type];
        if (type == null) {
            throw errors.componentTypeNotExists(componentData.type);
        }
        let children: (string | React.ReactElement<any>)[] = [];
        if (componentData.children != null) {
            children = await Promise.all(componentData.children.map(async function (c): Promise<string | React.ReactElement<any>> {
                if (typeof c == "string")
                    return c;

                return HomeController.parseComponentData(c);
            }));
        }

        let loadData: LoadData<any, any> = type["loadData"];
        let partialData: any = {};
        if (loadData != undefined) {
            partialData = await loadData(componentData.props);
            componentData.props.data = componentData.props.data || {};
            Object.assign(componentData.props.data, partialData || {});
        }

        let c = React.createElement(type, componentData.props, ...children);
        let html: string;
        try {
            html = renderToString(c);
            html = `<div id=${componentData.id}>${html}</div>`
        }
        catch (err) {

            let obj = {};
            Object.getOwnPropertyNames(err).forEach(name => {
                obj[name] = err[name];
            })

            html = `<div id=${componentData.id}>${JSON.stringify(obj)}</div>`;
            console.error(err);
        }

        componentData.loadedData = partialData;

        return html;
    }


    // @action("menu-items")
    // menuItems(@contextData cd: ContextData) {
    //     return cd.menuItem;
    // }

    // @action("set-theme")
    // async setTheme(@currentAppId appId: string, @connection conn: Connection, @routeData d: { themeName: string }) {
    //     if (!appId) throw errors.argumentNull("appId");
    //     if (!d.themeName) throw errors.routeDataFieldNull("themeName");

    //     let storeInfos = conn.getRepository(StoreInfo);
    //     let storeInfo = await storeInfos.findOne(appId);
    //     if (storeInfo == null) {
    //         // storeInfo = { id: appId, theme: d.themeName };
    //         // await storeInfos.insert(storeInfo);
    //         throw errors.objectNotExists("StoreInfo", appId);
    //     }

    //     await storeInfos.update(appId, { theme: d.themeName });
    //     return { id: storeInfo.id };
    // }

    // @action("get-theme")
    // async getTheme(@currentAppId appId: string, @connection conn: Connection) {
    //     if (!appId) throw errors.argumentNull("appId");

    //     // let storeInfo = await this.getStoreInfo(appId, conn);
    //     // return storeInfo.theme;
    //     return [];
    // }

    // @action("get-pages")
    // async getPages(@currentAppId appId: string, @connection conn: Connection) {
    //     if (!conn) throw errors.argumentNull("conn");

    //     let themeName = await this.getTheme(appId, conn);
    //     let pageRecords = conn.getRepository(PageRecord);
    //     let r = await pageRecords.find({ themeName, applicationId: appId });
    //     return r;
    // }

    // async getStoreInfo(appId: string, @connection conn: Connection) {
    //     if (!appId) throw errors.argumentNull("appId");
    //     if (!conn) throw errors.argumentNull("conn");

    //     let storeInfos = conn.getRepository(StoreInfo);
    //     let storeInfo = await storeInfos.findOne(appId);
    //     if (storeInfo == null) {
    //         throw errors.objectNotExists("StoreInfo", appId);
    //     }

    //     return storeInfo;
    // }

    // @action("themes")
    // async themes() {
    //     let url = `http://${themeHost}/api/themes`;
    //     let service = new Service();
    //     let themes = await service.get<string[]>(url);
    //     return themes;
    // }



}