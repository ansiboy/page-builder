import { controller, action, routeData } from "maishu-node-mvc";
import { Connection, DataHelper, SelectArguments } from "maishu-node-data";
import { PageRecord, StoreInfo } from "../entities";
import { errors } from "../static/errors";
import { guid } from "maishu-toolkit";
import { connection, currentAppId } from "../decoders";
import { HomeController } from "./home";
import { ContentResult } from "maishu-nws-mvc";

@controller("api/page-data")
export class PageDataController {
    @action()
    async list(@connection conn: Connection, @routeData { args }: { args: SelectArguments }, @currentAppId appId: string) {
        let APP_ID = "application_id";
        if (args.filter) {
            args.filter = `(${args.filter}) and ${APP_ID} = '${appId}'`
        }
        else {
            args.filter = `${APP_ID} = '${appId}'`
        }
        let r = await DataHelper.list(conn.getRepository(PageRecord), { selectArguments: args });
        return r;
    }

    @action()
    async add(@connection conn: Connection, @routeData { item }: { item: PageRecord }, @currentAppId appId: string) {
        if (item == null) throw errors.routeDataFieldNull("item");
        if (item.pageData == null) throw errors.argumentFieldNull("pageData", "item");
        if (item.name == null) throw errors.argumentFieldNull("name", "item");
        if (!appId) throw errors.argumentNull("appId");

        if (!item.id)
            item.id = guid();

        item.applicationId = appId;
        item.createDateTime = new Date(Date.now());
        await conn.getRepository(PageRecord).insert(item);
        let obj = { id: item.id, createDateTime: item.createDateTime } as Partial<PageRecord>;
        return obj;
    }

    @action()
    async update(@connection conn: Connection, @routeData { item }: { item: Partial<PageRecord> }, @currentAppId appId) {
        if (item == null) throw errors.routeDataFieldNull("item");
        if (item.pageData == null) throw errors.argumentFieldNull("pageData", "item");
        if (item.id == null) throw errors.argumentFieldNull("id", "item");
        if (!appId) throw errors.argumentNull("appId");

        let obj: Partial<PageRecord> = { pageData: item.pageData, templateName: item.templateName };
        if (item.name) {
            obj.name = item.name;
        }
        let r = await conn.getRepository(PageRecord).update({ id: item.id, applicationId: appId }, obj);
        if (r.affected == 0)
            throw new Error(`Update page record fail.`);

        return {};
    }

    @action()
    async remove(@connection conn: Connection, @routeData { id }: { id: string }) {
        if (!id) throw errors.argumentNull("id");
        await conn.getRepository(PageRecord).delete(id);
        return {};
    }

    @action()
    async item(@connection conn: Connection, @routeData { name, id }: { name: string, id: string }, @currentAppId appId) {
        if (name == null && id == null)
            throw new Error("One of name or id of route data field can not be null.")

        let storeInfos = conn.getRepository(StoreInfo);
        let storeInfo = await storeInfos.findOne({ id: appId });
        if (!storeInfo) {
            throw new Error(`Store ${storeInfo.id} is not exists.`);
        }

        let repository = conn.getRepository(PageRecord);
        let item: PageRecord;
        if (name != null) {
            item = await repository.findOne({ name, applicationId: appId, themeName: storeInfo.theme });
        }
        else {
            item = await repository.findOne(id);
        }

        return item;
    }

    /**
     * 通过 id 获取多个 PageRecord
     */
    @action()
    async items(@connection conn: Connection, @routeData { ids }: { ids: string[] }): Promise<PageRecord[]> {
        if (ids == null)
            throw errors.routeDataFieldNull("ids");

        if (ids.length == 0)
            return [];

        let repository = conn.getRepository(PageRecord);
        let r = await repository.findByIds(ids);
        return r;
    }

    @action("template-list")
    async templateList(@currentAppId appId: string, @connection conn: Connection) {
        if (!conn) throw errors.argumentNull("conn");
        if (!currentAppId) throw errors.argumentNull("currentAppId");

        let ctrl = new HomeController();
        let themeName = await ctrl.getTheme(appId, conn);
        let pageRecords = await conn.getRepository(PageRecord).find({
            select: ["id", "name", "displayName"],
            where: { type: "template", themeName, applicationId: appId }
        });
        return pageRecords;
    }

    @action("css/:pageId")
    async pageStyle(@connection conn: Connection, @routeData d: { pageId: string }) {
        let r = new ContentResult("", { "content-type": "text/css" });
        let t = conn.getRepository(PageRecord);
        let p = await t.findOne(d.pageId);
        if (!p) throw errors.pageRecordNotExists(d.pageId);

        return r;
    }


}