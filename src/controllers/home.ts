import { action, RequestResult, routeData, ServerContext, serverContext, controller } from "maishu-node-mvc";
import { dataStorage } from "../decoders";
import { errors } from "../static/errors";

import { adminActions, default as w } from "../static/website-config";
import { DataStorage } from "data-storage";
import { PageRecord } from "entities";
import * as fs from "fs";
import * as path from "path";
import { JSDOM } from "jsdom";
import { config } from "../config";
import { ServerSideRender } from "../server-side-render";
import type { PageData } from "maishu-jueying-core";
import type { ComponentInfo } from "static/model";

export type WebsiteConfig = { components: ComponentInfo[] };
export type LoadData<Props, T> = (props: Props) => Promise<Partial<T>>;

@controller(`${w.adminPageRoot}home`)
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
        let websiteConfig = websiteConfigModule.default || websiteConfigModule;

        try {
            let r = await ServerSideRender.renderPage(pageData, websiteConfig, themePhysicalPath);

            let indexHtmlPath = context.rootDirectory.findFile(`${config.themesVirtualPath}/${pageRecord.themeName}/index.html`);
            if (!fs.existsSync(indexHtmlPath))
                throw errors.fileNotExists(indexHtmlPath);

            let indexHtml = fs.readFileSync(indexHtmlPath).toString();
            var jsdom = new JSDOM(indexHtml);
            jsdom.window.document.body.innerHTML = r.html;

            this.appendClientVariables(jsdom.window.document, pageRecord, websiteConfig);

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


}