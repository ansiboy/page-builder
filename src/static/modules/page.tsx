import { guid } from "maishu-toolkit";
import * as React from "react";
import { PageData, Page } from "maishu-jueying-core";
import { LocalService } from "../services";
import { ComponentLoader } from "../controls/component-loader"
import { PageHelper } from "../controls/page-helper";
import { PageRecord } from "entities";

interface State {
    pageData?: PageData
}

interface Props {
    themeName: string,
    data: {
        id?: string,
        name?: string,
    }
}

export default class PageView extends React.Component<Props, State> {
    private localService: LocalService;
    constructor(props: Props) {
        super(props);

        this.state = { pageData: this.emptyPageData() };
        this.localService = new LocalService();

        let p: Promise<PageRecord> = this.props.data.id ?
            this.localService.getPageRecord(this.props.data.id) :
            this.localService.getPageDataByName(this.props.data.name);

        p.then(async r => {
            if (!r?.templateName) {
                return r;
            }

            let template = await this.localService.getPageDataByName(r.templateName);
            if (template?.pageData)
                PageHelper.mergeTemplate(r.pageData, template.pageData);

            return r;
        }).then(r => {
            if (r == null) {
                this.setState({ pageData: null })
                return r;
            }

            (r.pageData as PageData).children.forEach(c => {
                c.props.data = this.props.data;
            })

            let componentLoader = new ComponentLoader(r.pageData, this.props.themeName, true);

            componentLoader.loadComponentSuccess.add(() => {
                this.setState({ pageData: r.pageData });
            })
            componentLoader.loadComponentsComplete.add(() => {
                this.setState({ pageData: r.pageData });
            })
            componentLoader.loadComponentTypes();
        }).catch(err => {
            console.error(err);
        });
    }
    emptyPageData() {
        let pageId = guid();
        let pageData: PageData = {
            id: pageId,
            type: Page.name,
            props: {},
            children: [
            ],
        }

        return pageData;
    }

    render() {
        let { pageData } = this.state;
        if (pageData === undefined)
            return <div className="empty">
                数据正在加载中...
            </div>

        if (pageData === null) {
            return <div className="empty">
                <div>页面 {this.props.data.id} 不存在</div>
            </div>
        }

        return <Page pageData={pageData}>

        </Page>
    }
}