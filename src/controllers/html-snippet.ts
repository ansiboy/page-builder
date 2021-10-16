// import { DataListPage } from "maishu-data-page";
// import { Connection, DataHelper } from "maishu-node-data";
// import { action, controller, routeData } from "maishu-nws-mvc";
// import { DataSourceSelectArguments, guid } from "maishu-toolkit";
// import { connection, currentAppId } from "../decoders";
// import { HtmlSnippet } from "../entities";
// import { errors } from "../static/errors";

// @controller("api/html-snippet")
// export class HtmlSnippetController {

//     @action()
//     async list(@connection conn: Connection, @routeData d: { args: DataSourceSelectArguments }, @currentAppId appId: string) {

//         let APP_ID: keyof HtmlSnippet = "applicationId";
//         if (!d.args) throw errors.routeDataFieldNull("args");
//         if (d.args.filter) {
//             d.args.filter = `(${d.args.filter}) and (${APP_ID} = '${appId}')`;
//         }
//         else {
//             d.args.filter = `${APP_ID} = '${appId}'`;
//         }

//         let repository = conn.getRepository(HtmlSnippet);
//         let r = await DataHelper.list(repository, { selectArguments: d.args });
//         return r;
//     }

//     @action()
//     async insert(@connection conn: Connection, @routeData d: { item: HtmlSnippet }, @currentAppId appId: string) {
//         if (!d.item) throw errors.routeDataFieldNull("item");

//         d.item.id = guid();
//         d.item.createDateTime = new Date();
//         d.item.applicationId = appId;

//         let repository = conn.getRepository(HtmlSnippet);
//         await repository.insert(d.item);

//         let r: Pick<HtmlSnippet, "id" | "createDateTime" | "applicationId"> = {
//             id: d.item.id, createDateTime: d.item.createDateTime,
//             applicationId: d.item.applicationId
//         };

//         return r;
//     }

//     @action()
//     async update(@connection conn: Connection, @routeData d: { item: HtmlSnippet }, @currentAppId appId: string) {
//         if (!d.item) throw errors.routeDataFieldNull("item");
//         if (!d.item.id) throw errors.argumentFieldNull("id", "item");

//         if (d.item.applicationId != appId)
//             throw errors.applicationIdNotMatch(appId, d.item.applicationId);

//         delete d.item.createDateTime;
//         delete d.item.applicationId;

//         let repository = conn.getRepository(HtmlSnippet);
//         await repository.update(d.item.id, d.item);

//         return { id: d.item.id };
//     }

//     @action()
//     async delete(@connection conn: Connection, @routeData d: { id: string }, @currentAppId appId: string) {
//         if (!d.id) throw errors.routeDataFieldNull("id");

//         let repository = conn.getRepository(HtmlSnippet);
//         await repository.delete({ id: d.id });

//         return { id: d.id };
//     }
// }

