import { controller, action, routeData, serverContext, ServerContext } from "maishu-node-mvc";
import { SelectArguments } from "maishu-node-data";
import { PageRecord } from "../entities";
import { errors } from "../static/errors";
import { dataStorage } from "../decoders";
import { DataStorage } from "data-storage";
import { adminActions, default as w } from "../static/website-config";

@controller(`${w.adminApiRoot}page-data`)
export class PageDataController {
    @action(adminActions.pageData.list)
    async list(@dataStorage storage: DataStorage, @routeData { args }: { args: SelectArguments }, @serverContext context: ServerContext) {
        let r = storage.list(args, context.req);
        return r;
    }

    @action(adminActions.pageData.add)
    async add(@dataStorage storage: DataStorage, @routeData { item }: { item: PageRecord }, @serverContext context: ServerContext) {
        if (item == null) throw errors.routeDataFieldNull("item");
        if (item.pageData == null) throw errors.argumentFieldNull("pageData", "item");
        if (item.name == null) throw errors.argumentFieldNull("name", "item");

        return storage.add(item, context.req);
    }

    @action(adminActions.pageData.update)
    async update(@dataStorage storage: DataStorage, @routeData { item }: { item: PageRecord }, @serverContext context: ServerContext) {
        if (item == null) throw errors.routeDataFieldNull("item");
        if (item.pageData == null) throw errors.argumentFieldNull("pageData", "item");
        if (item.id == null) throw errors.argumentFieldNull("id", "item");

        return storage.update(item, context.req);
    }

    @action(adminActions.pageData.remove)
    async remove(@dataStorage storage: DataStorage, @routeData { id }: { id: string }, @serverContext context: ServerContext) {
        if (!id) throw errors.argumentNull("id");
        await storage.remove(id, context.req);
    }

    @action(adminActions.pageData.item)
    async item(@dataStorage storage: DataStorage, @routeData { name, id }: { name: string, id: string }, @serverContext context: ServerContext) {
        if (name == null && id == null)
            throw new Error("One of name or id of route data field can not be null.")

        let item = await storage.item(id, context.req);
        return item;
    }

    @action(adminActions.pageData.temp)
    temp() {
        return "test"
    }
   

}