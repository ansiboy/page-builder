import { controller, action, routeData, serverContext, ServerContext } from "maishu-node-mvc";
import { SelectArguments } from "maishu-node-data";
import { PageRecord } from "../entities";
import { errors } from "../static/errors";
import { dataStorage } from "../decoders";
import { ControllerRoot } from "../config";
import { DataStorage } from "data-storage";
import { actions } from "../static/website-config";

@controller(`${ControllerRoot}page-data`)
export class PageDataController {
    @action(actions.pageData.list)
    async list(@dataStorage storage: DataStorage, @routeData { args }: { args: SelectArguments }, @serverContext context: ServerContext) {
        let r = storage.list(args, context.req);
        return r;
    }

    @action(actions.pageData.add)
    async add(@dataStorage storage: DataStorage, @routeData { item }: { item: PageRecord }, @serverContext context: ServerContext) {
        if (item == null) throw errors.routeDataFieldNull("item");
        if (item.pageData == null) throw errors.argumentFieldNull("pageData", "item");
        if (item.name == null) throw errors.argumentFieldNull("name", "item");

        return storage.add(item, context.req);
    }

    @action(actions.pageData.update)
    async update(@dataStorage storage: DataStorage, @routeData { item }: { item: PageRecord }, @serverContext context: ServerContext) {
        if (item == null) throw errors.routeDataFieldNull("item");
        if (item.pageData == null) throw errors.argumentFieldNull("pageData", "item");
        if (item.id == null) throw errors.argumentFieldNull("id", "item");

        return storage.update(item, context.req);
    }

    @action(actions.pageData.remove)
    async remove(@dataStorage storage: DataStorage, @routeData { id }: { id: string }, @serverContext context: ServerContext) {
        if (!id) throw errors.argumentNull("id");
        await storage.remove(id, context.req);
    }

    @action(actions.pageData.item)
    async item(@dataStorage storage: DataStorage, @routeData { name, id }: { name: string, id: string }, @serverContext context: ServerContext) {
        if (name == null && id == null)
            throw new Error("One of name or id of route data field can not be null.")

        let item = await storage.item(id, context.req);
        return item;
    }

    @action(actions.pageData.temp)
    temp() {
        return "test"
    }
    // /**
    //  * 通过 id 获取多个 PageRecord
    //  */
    // @action()
    // async items(@connection conn: Connection, @routeData { ids }: { ids: string[] }): Promise<PageRecord[]> {
    //     if (ids == null)
    //         throw errors.routeDataFieldNull("ids");

    //     if (ids.length == 0)
    //         return [];

    //     let repository = conn.getRepository(PageRecord);
    //     let r = await repository.findByIds(ids);
    //     return r;
    // }

    // @action("template-list")
    // async templateList(@currentAppId appId: string, @connection conn: Connection) {
    //     if (!conn) throw errors.argumentNull("conn");
    //     if (!currentAppId) throw errors.argumentNull("currentAppId");

    //     let ctrl = new HomeController();
    //     let themeName = await ctrl.getTheme(appId, conn);
    //     let pageRecords = await conn.getRepository(PageRecord).find({
    //         select: ["id", "name", "displayName"],
    //         where: { type: "template", themeName, applicationId: appId }
    //     });
    //     return pageRecords;
    // }

    // @action("css/:pageId")
    // async pageStyle(@connection conn: Connection, @routeData d: { pageId: string }) {
    //     let r = new ContentResult("", { "content-type": "text/css" });
    //     let t = conn.getRepository(PageRecord);
    //     let p = await t.findOne(d.pageId);
    //     if (!p) throw errors.pageRecordNotExists(d.pageId);

    //     return r;
    // }


}