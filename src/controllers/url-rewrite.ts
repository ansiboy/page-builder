// import { DataHelper } from "maishu-node-data";
// import { action, controller, routeData } from "maishu-nws-mvc";
// import { guid } from "maishu-toolkit";
// import { DataSourceSelectArguments } from "maishu-wuzhui";
// import { Connection } from "typeorm";
// import { connection, currentAppId } from "../decoders";
// import { UrlRewrite } from "../entities";
// import { errors } from "../static/errors";

// @controller("api/url-rewrite")
// export class UrlRewriteController {
//     @action()
//     async list(@connection conn: Connection, @routeData d: { args: DataSourceSelectArguments }, @currentAppId appId: string) {
//         let APP_ID: keyof UrlRewrite = "applicationId";
//         if (!d.args) throw errors.routeDataFieldNull("args");
//         if (d.args.filter) {
//             d.args.filter = `(${d.args.filter}) and (${APP_ID} = '${appId}')`
//         }
//         else {
//             d.args.filter = `${APP_ID} = '${appId}'`
//         }

//         let urlRewrites = conn.getRepository(UrlRewrite);
//         let r = DataHelper.list(urlRewrites, { selectArguments: d.args });
//         return r;
//     }

//     @action()
//     async insert(@connection conn: Connection, @routeData d: { item: UrlRewrite }, @currentAppId appId: string) {
//         if (!d.item) throw errors.routeDataFieldNull("item");

//         let urlRewrites = conn.getRepository(UrlRewrite);
//         d.item.id = guid();
//         d.item.createDateTime = new Date();
//         d.item.applicationId = appId;

//         await urlRewrites.insert(d.item);
//         let r: Pick<UrlRewrite, "id" | "createDateTime"> = {
//             id: d.item.id,
//             createDateTime: d.item.createDateTime
//         };
//         return r;
//     }

//     @action()
//     async update(@connection conn: Connection, @routeData d: { item: UrlRewrite }, @currentAppId appId: string) {
//         if (!d.item) throw errors.routeDataFieldNull("item");

//         if (d.item.applicationId != appId)
//             throw errors.applicationIdNotMatch(appId, d.item.applicationId);

//         delete d.item.createDateTime;
//         delete d.item.applicationId;

//         let urlRewrites = conn.getRepository(UrlRewrite);

//         await urlRewrites.update(d.item.id, d.item);

//         return { id: d.item.id };
//     }

//     @action()
//     async delete(@connection conn: Connection, @routeData d: { id: string }, @currentAppId appId: string) {
//         if (!d.id) throw errors.routeDataFieldNull("id");
//         if (!appId) throw errors.argumentNull("appId");

//         let urlRewrites = conn.getRepository(UrlRewrite);
//         await urlRewrites.delete({ id: d.id });

//         return { id: d.id };
//     }

    
//     @action()
//     async urlGroups(){
        
//     }
// }