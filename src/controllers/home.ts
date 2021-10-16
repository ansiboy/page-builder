import { action, contextData, routeData } from "maishu-node-mvc";
import { controller } from "maishu-nws-mvc";
import { connection, currentAppId } from "../decoders";
import { Connection, } from "maishu-node-data";
import { errors } from "../static/errors";
import { PageRecord, StoreInfo } from "../entities";
import { themeHost } from "../static/website-config";
import { Service } from "maishu-chitu-service";

@controller("api/home")
export class HomeController {

    @action("menu-items")
    menuItems(@contextData cd: ContextData) {
        return cd.menuItem;
    }

    @action("set-theme")
    async setTheme(@currentAppId appId: string, @connection conn: Connection, @routeData d: { themeName: string }) {
        if (!appId) throw errors.argumentNull("appId");
        if (!d.themeName) throw errors.routeDataFieldNull("themeName");

        let storeInfos = conn.getRepository(StoreInfo);
        let storeInfo = await storeInfos.findOne(appId);
        if (storeInfo == null) {
            // storeInfo = { id: appId, theme: d.themeName };
            // await storeInfos.insert(storeInfo);
            throw errors.objectNotExists("StoreInfo", appId);
        }

        await storeInfos.update(appId, { theme: d.themeName });
        return { id: storeInfo.id };
    }

    @action("get-theme")
    async getTheme(@currentAppId appId: string, @connection conn: Connection) {
        if (!appId) throw errors.argumentNull("appId");

        let storeInfo = await this.getStoreInfo(appId, conn);
        return storeInfo.theme;
    }

    @action("get-pages")
    async getPages(@currentAppId appId: string, @connection conn: Connection) {
        if (!conn) throw errors.argumentNull("conn");

        let themeName = await this.getTheme(appId, conn);
        let pageRecords = conn.getRepository(PageRecord);
        let r = await pageRecords.find({ themeName, applicationId: appId });
        return r;
    }

    async getStoreInfo(appId: string, @connection conn: Connection) {
        if (!appId) throw errors.argumentNull("appId");
        if (!conn) throw errors.argumentNull("conn");

        let storeInfos = conn.getRepository(StoreInfo);
        let storeInfo = await storeInfos.findOne(appId);
        if (storeInfo == null) {
            throw errors.objectNotExists("StoreInfo", appId);
        }

        return storeInfo;
    }

    @action("themes")
    async themes() {
        let url = `http://${themeHost}/api/themes`;
        let service = new Service();
        let themes = await service.get<string[]>(url);
        return themes;
    }



}