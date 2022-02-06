import { action, RequestResult, routeData, ServerContext, serverContext, controller } from "maishu-node-mvc";
import { dataStorage } from "../decoders";
import { errors } from "../static/errors";
import { adminActions, default as w } from "../static/website-config";
import { DataStorage } from "data-storage";
import { JSDOM } from "jsdom";
import { config } from "../config";
import { ServerSideRender } from "../server-side-render";

import * as fs from "fs";
import * as path from "path";

import type { PageRecord } from "entities";
import type { PageData } from "maishu-jueying-core";
import { moduleCSS } from "../node-require";
import { pathConcat } from "maishu-toolkit";
import type { ComponentInfo } from "static/controls/component-loader";

export type WebsiteConfig = { components: ComponentInfo[] };
export type LoadData<Props, T> = (props: Props) => Promise<Partial<T>>;

@controller()
export class HomeController {

    @action(adminActions.pages.preview)
    async preivew(@routeData d: { pageDataId: string }, @dataStorage storage: DataStorage, @serverContext context: ServerContext) {
        if (!d.pageDataId) throw errors.routeDataFieldNull("pageDataId");

        var pageRecord = await storage.item(d.pageDataId, context.req);
        if (!pageRecord) throw errors.objectNotExists("PageData", d.pageDataId);

        var pageData: PageData = JSON.parse(JSON.stringify(pageRecord.pageData));

        let themeDirectory = context.rootDirectory.findDirectory(`${config.themesVirtualPath}/${pageRecord.themeName}`);
        console.assert(themeDirectory, "theme directory is null");

        let themePhysicalPath = themeDirectory.physicalPath;
        let websiteConfigPath = path.join(themePhysicalPath, "website-config.js");
        if (!fs.existsSync(websiteConfigPath)) {
            throw errors.fileNotExists(websiteConfigPath);
        }

        let websiteConfigModule = require(websiteConfigPath);
        let websiteConfig: WebsiteConfig = websiteConfigModule.default || websiteConfigModule;
        try {
            let r = await ServerSideRender.renderPage(pageData, websiteConfig, themePhysicalPath);

            let indexHtmlPath = context.rootDirectory.findFile(`${config.themesVirtualPath}/${pageRecord.themeName}/index.html`);
            if (!fs.existsSync(indexHtmlPath))
                throw errors.fileNotExists(indexHtmlPath);

            let indexHtml = fs.readFileSync(indexHtmlPath).toString();
            var jsdom = new JSDOM(indexHtml);
            jsdom.window.document.body.innerHTML = r.html;

            this.appendClientVariables(jsdom.window.document, pageRecord, websiteConfig);
            this.appendComponentCss(jsdom.window.document, pageRecord, websiteConfig, themePhysicalPath);


            let html = `<!DOCTYPE html>\r\n${jsdom.window.document.body.parentElement.outerHTML}`;



            let c: RequestResult = { content: html, headers: { "content-type": "text/html" }, statusCode: 200 };
            return c;
        }
        catch (err) {
            let obj = {};
            Object.getOwnPropertyNames(err).forEach(k => obj[k] = err[k]);
            let c: RequestResult = { content: JSON.stringify(obj), headers: { "content-type": "application/json" }, statusCode: 200 };
            return c;
        }
    }

    private appendClientVariables(document: Document, pageRecord: PageRecord, websiteConfig: WebsiteConfig) {
        let scriptElement = document.createElement("script");
        document.head.appendChild(scriptElement);
        let script = "";
        script = script + `window["pageData"] = ${JSON.stringify(pageRecord.pageData)};\r\n`;
        script = script + `window["websiteConfig"] = ${JSON.stringify(websiteConfig)};\r\n`;
        script = script + `themeName = '${pageRecord.themeName}';\r\n`;
        scriptElement.innerHTML = script;
    }

    private appendComponentCss(document: Document, pageRecord: PageRecord, websiteConfig: WebsiteConfig, themePhysicalPath: string) {
        let pageData = pageRecord.pageData;
        if (!pageData || !pageData.children)
            return;

        pageData.children.forEach(c => {
            let relativePath = websiteConfig.components.filter(o => o.type == c.type)[0]?.path;
            if (!relativePath)
                return;

            let componentPhysicalPath = path.join(themePhysicalPath, relativePath);
            if (!componentPhysicalPath.endsWith(".js"))
                componentPhysicalPath = componentPhysicalPath + ".js";

            let cssPaths = moduleCSS[componentPhysicalPath];
            if (!cssPaths)
                return;

            cssPaths.forEach(cssPath => {
                if (!cssPath.endsWith(".css"))
                    cssPath = cssPath + ".css";

                var link = document.createElement("link");
                link.rel = "stylesheet";
                link.type = "text/css";
                link.href = pathConcat(`/${w.themesDirectoryName}`, cssPath);
                document.head.appendChild(link);
            })




        })


    }

    @action(adminActions.api.themes)
    themes() {
        return ["topic"];
    }
}