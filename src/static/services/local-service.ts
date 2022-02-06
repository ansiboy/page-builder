import { Callbacks, Service, ValueStore } from "maishu-chitu-service";
import { DataSourceSelectArguments, DataSourceSelectResult } from "maishu-wuzhui-helper";
import { PageRecord, } from "../../entities";
import { pathConcat } from "maishu-toolkit";
import websiteConfig, { adminActions as actions, } from "website-config";
import { errors } from "../errors";
// import { WebsiteConfig } from "maishu-chitu-scaffold/static/types";
import type { ComponentInfo } from "static/controls/component-loader";

let appId = getApplicationId();
if (appId)
    Service.headers["application-id"] = appId;

// let service = new Service(err => errorHandle(err));
let controllerRoot = websiteConfig.adminApiRoot;
function getApplicationId() {
    if (localStorage.getItem("application-id")) {
        return localStorage.getItem("application-id");
    }

    return null;
}

let themesRoot = websiteConfig.themesDirectoryName;


export class LocalService extends Service {

    static url(path: string) {
        // let contexts = requirejs.exec("contexts");
        // let contextName = websiteConfig.requirejs?.context || "";
        // if (!contextName)
        //     throw new Error("Context of website config is empty.");

        // let context = contexts[contextName];
        // let baseUrl = context?.config?.baseUrl;
        // let r: string;
        // if (!baseUrl)
        //     r = path;
        // else
        //     r = pathConcat(baseUrl, path);

        // return r;
        let r = pathConcat("/", path);
        return r;
    }

    static pageUrl(path: string) {
        let contexts = requirejs.exec("contexts");
        let contextName = websiteConfig.requirejs?.context || "";
        if (!contextName)
            throw new Error("Context of website config is empty.");

        let context = contexts[contextName];
        let baseUrl = context?.config?.baseUrl;
        let r: string;
        if (!baseUrl)
            r = path;
        else
            r = pathConcat(baseUrl, path);

        if (r.startsWith("./"))
            r = r.substr(2);

        return r;
    }

    static getContext(): RequirejsContext {
        let contexts = requirejs.exec("contexts");
        let contextName = websiteConfig.requirejs?.context || "";
        if (!contextName)
            throw new Error("Context of website config is empty.");

        let context = contexts[contextName];
        if (!context) {
            console.assert(websiteConfig.requirejs != null);
            requirejs.config(websiteConfig.requirejs);
        }

        let load: (id: string, url: string) => void = context.load;
        context.load = function (id: string, url: string) {
            // if (url[0] == "/" && !url.endsWith(".js"))
            //     url = url + ".js";

            load.apply(this, [id, url]);
        }
        return context;
    }

    private static trimPageData(item: PageRecord["pageData"]) {
        if (!item) throw errors.argumentNull("item");
        if (item.props)
            delete item.props.app;

        if (item.children) {
            for (let i = 0; i < item.children.length; i++) {
                if (item.children[i].props) {
                    delete item.children[i].props.app;
                }
            }
        }
    }

    pageRecordList(args: DataSourceSelectArguments) {
        let url = LocalService.url(actions.pageData.list);
        return this.getByJson<DataSourceSelectResult<PageRecord>>(url, { args });
    }
    removePageRecord(id: string) {
        let url = LocalService.url(actions.pageData.remove);
        return this.postByJson(url, { id });
    }
    async addPageRecord(item: Partial<PageRecord>) {
        item = JSON.parse(JSON.stringify(item));
        console.assert(item.pageData != null, `PageData of page record '${item.id}' is null.`);
        LocalService.trimPageData(item.pageData);
        let r = await this.postByJson(LocalService.url(actions.pageData.add), { item });
        Object.assign(item, r);
        return item;
    }
    async updatePageRecord(item: Partial<PageRecord>) {
        item = JSON.parse(JSON.stringify(item));
        console.assert(item.pageData != null, `PageData of page record '${item.id}' is null.`);
        LocalService.trimPageData(item.pageData);
        let r = await this.postByJson(LocalService.url(actions.pageData.update), { item });
        Object.assign(item, r);
        return item;
    }
    async getPageRecord(id: string): Promise<PageRecord> {
        if (!id) throw errors.argumentNull("id");

        let r = await this.getByJson<PageRecord>(LocalService.url(actions.pageData.item), { id });
        return r;
    }

    async getPageDataByName(name: string): Promise<PageRecord> {
        if (!name) throw errors.argumentNull("name");
        let r = await this.getByJson<PageRecord>(LocalService.url(actions.pageData.item), { name });
        return r;
    }

    // storeDomainList(args: DataSourceSelectArguments): Promise<DataSourceSelectResult<StoreDomain>> {
    //     let url = LocalService.url(`${controllerRoot}/store-domain/list`);
    //     return this.getByJson<DataSourceSelectResult<StoreDomain>>(url);
    // }

    // insertStoreDomain(item: StoreDomain) {
    //     let url = LocalService.url(`${controllerRoot}/store-domain/insert`);
    //     return this.postByJson(url, { item });
    // }

    // updateStoreDomain(item: StoreDomain) {
    //     let url = LocalService.url(`${controllerRoot}/store-domain/update`);
    //     return this.postByJson(url, { item });
    // }

    // deleteStoreDomain(item: StoreDomain) {
    //     let url = LocalService.url(`${controllerRoot}/store-domain/delete`);
    //     return this.delete(url, { id: item.id });
    // }

    defaultStoreDomain() {
        let url = LocalService.url(`${controllerRoot}/store-domain/default`);
        return this.getByJson<string>(url);
    }

    async componentInfos(themeName: string) {
        let config = await this.componentStationConfig(themeName);
        return config.components;
    }

    private _componentStationConfig: ComponentStationConfig;
    async componentStationConfig(themeName: string): Promise<ComponentStationConfig> {
        if (!themeName)
            themeName = await this.getTheme();

        if (this._componentStationConfig != null)
            return this._componentStationConfig;

        this._componentStationConfig = await this.loadWebsiteConfig(themeName);

        let _componentInfos = this._componentStationConfig.components;
        if (!_componentInfos)
            throw errors.componentsConfigNull();

        if ((_componentInfos as any)["pathContacted"] == undefined) {
            (_componentInfos as any)["pathContacted"] = true;
            _componentInfos.forEach(o => {
                if (o.path != null) {
                    o.path = pathConcat(themesRoot, themeName, o.path);
                    // if (times == "designtime") {
                    //     o.path = o.path + ".des";
                    // }
                }

                if (o.editor != null)
                    o.editor = pathConcat(themesRoot, themeName, o.editor);

                if (o.design != null) {
                    o.design = pathConcat(themesRoot, themeName, o.design);
                    // if (times == "designtime") {
                    //     o.design = o.design + ".des";
                    // }
                }

                if (o.layout != null)
                    o.layout = pathConcat(themesRoot, themeName, o.layout);

            })
        }


        return this._componentStationConfig;
    }

    private async loadWebsiteConfig(themeName: string) {
        let url = LocalService.url(`${themesRoot}/${themeName}/website-config.js`);
        let c: ComponentStationConfig = await this.loadJS(url);

        let contexts = requirejs.exec("contexts");
        let contextName = websiteConfig.requirejs?.context || "";
        let context = contexts[contextName]
        if (context != null && c.requirejs?.paths != null) {
            context.configure({ paths: c.requirejs.paths })
        }
        return c;
    }

    async templateList(): Promise<PageRecord[]> {
        // let url = LocalService.url(`${controllerRoot}/page-data/template-list`);
        // let r = this.getByJson<PageRecord[]>(url);
        // return r;
        return [];
    }

    async loadJS<T>(jsPath: string): Promise<T> {
        let context = LocalService.getContext();
        return new Promise((resolve, reject) => {
            context.require([jsPath], (mod: any) => {
                resolve(mod.default || mod)
            }, (err: any) => {
                reject(err)
            })
        })
    }

    /** 设置模板 */
    async setTheme(themeName: string) {
        let url = LocalService.url(`${controllerRoot}/home/set-theme`);
        let r = await this.postByJson(url, { themeName });

        LocalService.themeChanged.fire({ themeName });

        return r;
    }

    /** 获取模板 */
    async getTheme(): Promise<string> {
        let url = LocalService.url(`${controllerRoot}/home/get-theme`);
        let r = await this.getByJson<string>(url);
        return r;
    }

    async getPages(): Promise<PageRecord[]> {
        let url = LocalService.url(`${controllerRoot}/home/get-pages`);
        let pageRecords = await this.getByJson<PageRecord[]>(url);
        return pageRecords || [];
    }

    static themeChanged = Callbacks<{ themeName: string }>();

    static getPageTitle(pageName: string) {
        if (!pageName) throw errors.argumentNull("pageName");

        if (pageName.endsWith("home")) {
            return "首页";
        }
        else if (pageName.endsWith("product-list")) {
            return "商品列表";
        }
        else if (pageName.endsWith("product")) {
            return "商品页"
        }

        return null;
    }

    async getThemes(): Promise<string[]> {
        let url = LocalService.url(websiteConfig.adminActions.api.themes);
        return this.get<string[]>(url);
        // return [];
    }
}

export interface ComponentStationConfig {
    components: ComponentInfo[],
    requirejs?: any,
    // groups: { name: string, id: string }[],
    // themes: { name: string, path: string, title: string, image: string, }[],
}