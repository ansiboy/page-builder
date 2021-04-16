import { action, controller, routeData, serverContext, ServerContext } from "maishu-nws-mvc";
import { Connection } from "typeorm";
import { connection } from "../decoders";
import { PageRecord, StoreInfo } from "../entities";
import { errors } from "../static/errors";
import { In } from "maishu-node-data";
import { getDomain } from "../content-transforms/html-transform";

let pageNames = ["account", "shopping-cart", "product-list", "product", "order-detail", "receipt-edit",
    "receipt-list", "index", "login", "search", "checkout", "shipping"];

@controller("store-url")
export class StoreUrl {
    @action()
    async get(@routeData d: { appId: string }, @serverContext ctx: ServerContext, @connection conn: Connection) {
        if (!d.appId) throw errors.routeDataFieldNull("appId");

        // let domain = getDomain(ctx.req);
        // let storeDomain: StoreInfo | null = null;
        // storeDomain = await conn.getRepository().findOne({ domain });

        // if (storeDomain) {
        //     let dic: { [key: string]: string } = {};
        //     for (let i = 0; i < pageNames.length; i++) {
        //         conn.getRepository(PageRecord).find({
        //             where: { name: In(pageNames) },
        //             select: ["id", "name"],
        //         });

        //         dic[pageNames[i]] = "account"
        //     }
        // }

        return {}
    }
}