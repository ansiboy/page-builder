import { Callbacks, Service, ValueStore } from "maishu-chitu-service";
import { DataSourceSelectArguments, DataSourceSelectResult } from "maishu-wuzhui-helper";
import { PageRecord, StoreDomain, } from "../../entities";
import { pathConcat } from "maishu-toolkit";
import { ComponentInfo } from "../model";
import websiteConfig from "../website-config";
import { errorHandle } from "../error-handle";
import { errors } from "../errors";
import { WebsiteConfig } from "maishu-chitu-scaffold/static/types";

let appId = getApplicationId();
if (appId)
    Service.headers["application-id"] = appId;

// let service = new Service(err => errorHandle(err));

function getApplicationId() {
    if (localStorage.getItem("application-id")) {
        return localStorage.getItem("application-id");
    }

    return null;
}


export class LocalService extends Service {

    static url(path: string) {
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

    pageRecordList(args: DataSourceSelectArguments) {
        let url = LocalService.url("api/page-data/list");
        return this.getByJson<DataSourceSelectResult<PageRecord>>(url, { args });
    }
    removePageRecord(id: string) {
        let url = LocalService.url("api/page-data/remove");
        return this.postByJson(url, { id });
    }
    async addPageRecord(item: Partial<PageRecord>) {
        let r = await this.postByJson(LocalService.url("api/page-data/add"), { item });
        Object.assign(item, r);
        return item;
    }
    async updatePageRecord(item: Partial<PageRecord>) {
        let r = await this.postByJson(LocalService.url("api/page-data/update"), { item });
        Object.assign(item, r);
        return item;
    }
    async getPageRecord(id: string): Promise<PageRecord> {
        if (!id) throw errors.argumentNull("id");

        let r = await this.getByJson<PageRecord>(LocalService.url("api/page-data/item"), { id });
        return r;
    }

    async getPageDataByName(name: string): Promise<PageRecord> {
        if (!name) throw errors.argumentNull("name");
        let r = await this.getByJson<PageRecord>(LocalService.url("api/page-data/item"), { name });
        return r;
    }

    storeDomainList(args: DataSourceSelectArguments): Promise<DataSourceSelectResult<StoreDomain>> {
        let url = LocalService.url("api/store-domain/list");
        return this.getByJson<DataSourceSelectResult<StoreDomain>>(url);
    }

    insertStoreDomain(item: StoreDomain) {
        let url = LocalService.url("api/store-domain/insert");
        return this.postByJson(url, { item });
    }

    updateStoreDomain(item: StoreDomain) {
        let url = LocalService.url("api/store-domain/update");
        return this.postByJson(url, { item });
    }

    deleteStoreDomain(item: StoreDomain) {
        let url = LocalService.url("api/store-domain/delete");
        return this.delete(url, { id: item.id });
    }

    defaultStoreDomain() {
        let url = LocalService.url("api/store-domain/default");
        return this.getByJson<string>(url);
    }

    // urlRewriteList(args: DataSourceSelectArguments) {
    //     let url = LocalService.url("api/url-rewrite/list");
    //     return this.getByJson<DataSourceSelectResult<UrlRewrite>>(url, { args });
    // }

    // async urlRewriteInsert(item: UrlRewrite) {
    //     let url = LocalService.url("api/url-rewrite/insert");
    //     let r = await this.postByJson(url, { item });
    //     Object.assign(item, r);
    //     return r;
    // }

    // async urlRewriteUpdate(item: UrlRewrite) {
    //     let url = LocalService.url("api/url-rewrite/update");
    //     let r = await this.postByJson(url, { item });
    //     Object.assign(item, r);
    //     return r;
    // }

    // async urlRewriteDelete(item: UrlRewrite) {
    //     let url = LocalService.url("api/url-rewrite/delete");
    //     let r = await this.postByJson(url, { item });
    //     return r;
    // }

    // async htmlSnippetList(args: DataSourceSelectArguments) {
    //     let url = LocalService.url("api/html-snippet/list");
    //     return this.getByJson<DataSourceSelectResult<HtmlSnippet>>(url, { args });
    // }

    // async htmlSnippetInsert(item: HtmlSnippet) {
    //     let url = LocalService.url("api/html-snippet/insert");
    //     return this.postByJson(url, { item });
    // }

    // async htmlSnippetUpdate(item: HtmlSnippet) {
    //     let url = LocalService.url("api/html-snippet/update");
    //     let r = await this.postByJson(url, { item });
    //     Object.assign(item, r);
    //     return r;
    // }

    // async htmlSnippetDelete(item: HtmlSnippet) {
    //     let url = LocalService.url("api/html-snippet/delete");
    //     let r = await this.postByJson(url, { id: item.id });
    //     return r;
    // }


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
                    o.path = pathConcat(themeName, o.path);
                    // if (times == "designtime") {
                    //     o.path = o.path + ".des";
                    // }
                }

                if (o.editor != null)
                    o.editor = pathConcat(themeName, o.editor);

                if (o.design != null) {
                    o.design = pathConcat(themeName, o.design);
                    // if (times == "designtime") {
                    //     o.design = o.design + ".des";
                    // }
                }

                if (o.layout != null)
                    o.layout = pathConcat(themeName, o.layout);

            })
        }


        return this._componentStationConfig;
    }

    private async loadWebsiteConfig(themeName: string) {
        let url = LocalService.url(`${themeName}/website-config.js`);
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
        let url = LocalService.url("api/page-data/template-list");
        let r = this.getByJson<PageRecord[]>(url);
        return r;
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
        let url = LocalService.url("api/home/set-theme");
        let r = await this.postByJson(url, { themeName });

        LocalService.themeChanged.fire({ themeName });

        return r;
    }

    /** 获取模板 */
    async getTheme(): Promise<string> {
        let url = LocalService.url("api/home/get-theme");
        let r = await this.getByJson<string>(url);
        return r;
    }

    async getPages(): Promise<PageRecord[]> {
        let url = LocalService.url("api/home/get-pages");
        let pageRecords = await this.getByJson<PageRecord[]>(url);
        return pageRecords;
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

    getThemes(): Promise<string[]> {
        let url = LocalService.url("api/home/themes");
        return this.get<string[]>(url);
    }
}

export interface ComponentStationConfig extends WebsiteConfig {
    components: ComponentInfo[],
    // groups: { name: string, id: string }[],
    // themes: { name: string, path: string, title: string, image: string, }[],
}