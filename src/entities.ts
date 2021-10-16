import { PageData } from "maishu-jueying-core";
import { Entity, Column, PrimaryColumn, Connection } from "maishu-node-data";

@Entity("page_data_record")
export class PageRecord {
    @Column({ primary: true, name: "id", type: "char", length: 36 })
    id: string;

    @Column({ name: "name", type: "varchar", length: 56 })
    name: string;

    @Column({ name: "page_data", type: "json", })
    pageData: PageData;

    @Column({ name: "create_date_time", type: "datetime" })
    createDateTime: Date;

    @Column({ name: "application_id", type: "char", length: 36, nullable: true })
    applicationId?: string;

    @Column({ name: "type", type: "varchar", length: 20 })
    type: "system" | "snapshoot" | "page" | "template";

    @Column({ name: "edit_page", type: "varchar", length: 45, nullable: true })
    editPage?: string;

    // @Column({ name: "template_id", type: "varchar", length: 36, nullable: true })
    // templateId?: string;

    @Column({ name: "theme_name", type: "varchar", length: 40, nullable: true })
    themeName: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    remark: string;

    @Column({ name: "template_name", type: "varchar", length: 45, nullable: true })
    templateName?: string;

    @Column({ name: "display_name", type: "varchar", length: 45, nullable: true })
    displayName?: string;
}

@Entity("data_object")
export class DataObject {
    @Column({ primary: true, name: "id", type: "varchar", length: 100 })
    id: string;

    @Column({ name: "data", type: "json" })
    data: any;

    @Column({ name: "create_date_time", type: "datetime" })
    createDateTime: Date;

    @Column({ name: "application_id", type: "char", length: 36, nullable: true })
    applicationId?: string;
}

@Entity("store_info")
export class StoreInfo {
    /** 使用 Application Id 作为主键 */
    @PrimaryColumn({ type: "char", length: 36 })
    id: string;

    @Column({ type: "varchar", length: 50 })
    theme: string;

    @Column({ type: "char", length: 36 })
    userId: string;
}

@Entity("store_domain")
export class StoreDomain {
    @PrimaryColumn({ type: "char", length: 36 })
    id: string;

    @Column({ type: "char", length: 36 })
    applicationId: string;

    @Column({ type: "char", length: 36 })
    domain: string;

    @Column({ type: "datetime" })
    createDateTime: Date;
}

// @Entity("url_rewrite")
// export class UrlRewrite {
//     @PrimaryColumn({ type: "char", length: 36 })
//     id: string;

//     @Column({ type: "varchar", length: 200 })
//     originalUrl: string;

//     @Column({ type: "varchar", length: 200 })
//     newUrl: string;

//     @Column({ type: "datetime" })
//     createDateTime: Date;

//     @Column({ type: "char", length: 36 })
//     applicationId: string;
// }

// /**
//  * HTML 片段，用于向 HTML 页面添加 HTML 代码片段
//  */
// @Entity("html_snippet")
// export class HtmlSnippet {

//     @PrimaryColumn({ type: "char", length: 36 })
//     id: string;

//     @Column({ type: "varchar", length: 50 })
//     url: string;

//     @Column({ type: "text" })
//     code: string;

//     @Column({ type: "varchar", length: 20 })
//     target: "head" | "body";

//     @Column({ type: "char", length: 36 })
//     applicationId: string;

//     @Column({ type: "date" })
//     createDateTime: Date;

//     /** 替换，css 选择器 */
//     @Column({ type: "varchar", length: 50, nullable: true })
//     replacement?: string;

//     @Column({
//         type: "bit", nullable: true,
//         transformer: {
//             to(value) {
//                 return value == true ? 1 : 0;
//             },
//             from(value) {
//                 if (Buffer.isBuffer(value))
//                     value = value[0];

//                 return value == 1;
//             }
//         },
//     })
//     isRegex?: boolean;

// }