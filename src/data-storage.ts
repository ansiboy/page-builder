import { getMyConnection } from "./decoders";
import { PageRecord } from "./entities";
import { expr } from "jquery";
import { DataHelper, SelectArguments, SelectResult } from "maishu-node-data";
import { guid } from "maishu-toolkit";
import { errors } from "./static/errors";
import type { IncomingMessage } from "http";

export interface DataStorage {
    list(args: SelectArguments, request: IncomingMessage): Promise<SelectResult<PageRecord>>;
    item(id: string, request: IncomingMessage): Promise<PageRecord>;
    add(item: PageRecord, request: IncomingMessage): Promise<Partial<PageRecord>>;
    update(item: PageRecord, request: IncomingMessage): Promise<void>;
    remove(id: string, request: IncomingMessage): Promise<void>;
}

export class DefaultDataStorage implements DataStorage {
    async list(args: SelectArguments, request: IncomingMessage): Promise<SelectResult<PageRecord>> {
        if (!args) throw errors.argumentNull("args");

        let conn = await getMyConnection();
        let r = DataHelper.list(conn.getRepository(PageRecord), { selectArguments: args });
        return r;
    }
    async item(id: string): Promise<PageRecord> {
        let conn = await getMyConnection();
        let r = conn.getRepository(PageRecord).findOne(id);
        return r;
    }
    async add(item: PageRecord): Promise<Partial<PageRecord>> {
        if (item == null) throw errors.routeDataFieldNull("item");
        if (item.pageData == null) throw errors.argumentFieldNull("pageData", "item");
        if (item.name == null) throw errors.argumentFieldNull("name", "item");
        if (!item.id)
            item.id = guid();

        let conn = await getMyConnection();
        item.createDateTime = new Date(Date.now());
        await conn.getRepository(PageRecord).insert(item);
        let obj = { id: item.id, createDateTime: item.createDateTime } as Partial<PageRecord>;
        return obj;
    }
    async update(item: PageRecord): Promise<void> {
        if (item == null) throw errors.routeDataFieldNull("item");
        if (item.pageData == null) throw errors.argumentFieldNull("pageData", "item");
        if (item.id == null) throw errors.argumentFieldNull("id", "item");

        let obj: Partial<PageRecord> = { pageData: item.pageData, templateName: item.templateName };
        if (item.name) {
            obj.name = item.name;
        }

        let conn = await getMyConnection();
        let r = await conn.getRepository(PageRecord).update({ id: item.id }, obj);
        if (r.affected == 0)
            throw new Error(`Update page record fail.`);
    }
    async remove(id: string): Promise<void> {
        if (!id) throw errors.argumentNull("id");

        let conn = await getMyConnection();
        await conn.getRepository(PageRecord).delete(id);
    }
}