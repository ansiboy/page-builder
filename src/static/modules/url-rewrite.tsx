import { DataListPage } from "maishu-data-page";
import { rules } from "maishu-dilu";
import { UrlRewrite } from "../../entities";
import { dataSources } from "../services/data-sources";

export default class extends DataListPage<UrlRewrite> {
    dataSource = dataSources.urlRewrite;
    columns = [
        this.boundField({
            dataField: "originalUrl", headerText: "原链接",
            validation: { rules: [rules.required("请输入原链接")] }
        }),
        this.boundField({
            dataField: "newUrl", headerText: "新链接",
            validation: { rules: [rules.required("请输入新链接")] }
        }),
        this.dateTimeField({ dataField: "createDateTime", headerText: "创建时间", readOnly: true })
    ]
}