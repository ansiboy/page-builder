import { config } from "./config";
import { io, ManagerOptions } from "socket.io-client";
import { getMyConnection } from "./decoders";
import { PageRecord, StoreDomain, StoreInfo } from "./entities";
import { guid } from "maishu-toolkit";
import { Connection } from "typeorm";

interface MerchantAuditSuccessMessage {
    merchant: {
        id: string,
        companyName: string,
        contacts: string,
        contactMobile: string,
        email: string,
        businessLicense: string,
        createDateTime: string,
        status: string
    },
    user: {
        id: string,
        data: {
            applicationId: string
        },
        remark: string
    }
}

// export function startMessage(messageHost: string,) {

//     let extraHeaders: ManagerOptions["extraHeaders"] = {};
//     extraHeaders["client-name"] = "settlement";

//     let socket = io(`http://${messageHost}/`, { extraHeaders });
//     socket.on("MerchantAuditSuccess", async function (msg: MerchantAuditSuccessMessage) {

//         let conn = await getMyConnection();
//         let pageRecords = conn.getRepository(PageRecord);

//         await createStoreInfo(conn, msg);
//         await createStoreDomain(conn, msg.user.data.applicationId);

//         //=====================================================================================================
//         // 导入页面
//         let existsPageRecords = await pageRecords.find({ applicationId: msg.user.data.applicationId });
//         let defaultPageRecords = await pageRecords.find({ applicationId: config.zwAppId });
//         let toInsert: PageRecord[] = [];

//         defaultPageRecords.forEach(o => {
//             if (existsPageRecords.filter(c => c.name == o.name).length > 0) {
//                 return;
//             }

//             o.applicationId = msg.user.data.applicationId;
//             o.id = guid();
//             o.createDateTime = new Date();

//             toInsert.push(o);
//         })

//         await pageRecords.insert(toInsert);
//         //=====================================================================================================

//     });

// }

/** 随机生成子一个域名， 并绑定*/
async function createStoreDomain(conn: Connection, appId: string) {
    let storeDomains = conn.getRepository(StoreDomain);
    let entity = await storeDomains.findOne({ applicationId: appId });
    if (entity) {
        return;
    }
    
    let item: StoreDomain;
    let subDomain: string;
    do {
        let name = randomDomainName();
        subDomain = name + "." + config.mainDomain;
        item = await storeDomains.findOne({ domain: subDomain });
    } while (item != null)

    await storeDomains.insert({
        id: guid(), createDateTime: new Date(),
        domain: subDomain, applicationId: appId
    })
}

export function randomDomainName() {
    let length = 6;
    let aCode = 'a'.charCodeAt(0);
    let zCode = 'z'.charCodeAt(0);
    let arr: number[] = []
    for (let i = 0; i < length; i++) {
        let num = Math.fround(Math.random() * (zCode - aCode)) + aCode;
        arr[i] = num;
    }

    let name = String.fromCharCode(...arr);
    return name;
}

export async function createStoreInfo(conn: Connection, msg: MerchantAuditSuccessMessage) {

    let storeInfos = conn.getRepository(StoreInfo);
    let appId = msg.user.data.applicationId;
    let entity = await storeInfos.findOne(appId);
    if (entity) {
        return;
    }
    let item: StoreInfo = {
        id: appId, theme: "aixpi", userId: msg.user.id
    };

    await storeInfos.insert(item);
    return item;
}