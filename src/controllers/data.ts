import { ControllerRoot } from "../config";
import { action, controller, routeData } from "maishu-nws-mvc";
import { connection, currentAppId, } from "../decoders";
import { Connection, DataHelper, SelectResult } from "maishu-node-data";
import { CustomData } from "../entities";
import { DataSourceSelectArguments, guid } from "maishu-toolkit";
import { errors } from "../static/errors";

@controller(`${ControllerRoot}data`)
export class Data {

    @action(":type/list")
    async list(@connection conn: Connection, @routeData d: { type: string, args: DataSourceSelectArguments }): Promise<SelectResult<any>> {
        let customDatas = conn.getRepository(CustomData);
        d.args = d.args || {};
        let filter = d.args.filter = d.args.filter || {};
        if (typeof filter == "string")
            throw errors.argumentTypeIncorrect("args.filter", "object");

        filter.type = d.type;
        let r = await DataHelper.list(customDatas, { selectArguments: d.args });
        let dataItems = r.dataItems.map(o => o.data);
        return { totalRowCount: r.totalRowCount, dataItems };
    }

    @action(":type/update")
    async update(@connection conn: Connection, @routeData d: { type: string, item: any }) {
        if (!d.item) throw errors.argumentNull("item");
        if (!d.item.id) throw errors.argumentFieldNull("id", "item");
        if (!d.type) throw errors.argumentNull("type");

        let customDatas = conn.getRepository(CustomData);
        await customDatas.update(d.item.id, { data: d.item });

        return {};
    }

    @action(":type/insert")
    async insert(@connection conn: Connection, @currentAppId appId: string, @routeData d: { type: string, item: any }) {
        if (!d.item) throw errors.argumentNull("item");
        if (d.item.id && typeof d.item.id != "string") throw errors.argumentTypeIncorrect("item.id", "string");
        if (!d.type) throw errors.argumentNull("type");

        let customDatas = conn.getRepository(CustomData);

        if (!d.item.id) {
            d.item.id = guid();
        }

        let customData: CustomData = { id: d.item.id, data: d.item, createDateTime: new Date(), applicationId: appId, type: d.type };
        await customDatas.insert(customData);

        return { id: d.item.id };
    }

    @action(":type/delete")
    async delete(@connection conn: Connection, @routeData d: { id: string }) {
        if (!d.id) throw errors.argumentNull("id");

        let customDatas = conn.getRepository(CustomData);
        await customDatas.delete(d.id);

        return { id: d.id };
    }

    @action(":type/item")
    async item(@connection conn: Connection, @routeData d: { id: string }) {
        if (!d.id) throw errors.argumentNull("id");

        let customDatas = conn.getRepository(CustomData);
        let item = customDatas.findOne(d.id);

        return item;
    }

}