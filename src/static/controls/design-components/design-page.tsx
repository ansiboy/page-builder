import { Page, PageData, registerComponent } from "maishu-jueying-core";
import { DesignerContext, PageDesigner } from "maishu-jueying";
import * as React from "react";
import { ComponentPanel } from "../component-panel";
import { ComponentLoader } from "../component-loader";
import "css!devices"
import { contextData } from "maishu-nws-mvc";
import { Application } from "maishu-chitu-react";
import { IService, Service, ServiceConstructor } from "maishu-chitu-service";

export type ContextArguments = { page: DesignPage, designer: PageDesigner, pageData: PageData, componentPanel: ComponentPanel };
export let DesignPageContext = React.createContext<ContextArguments>({ page: null, designer: null, pageData: null, componentPanel: null });
window["DesignPageContext"] = DesignPageContext;

interface State {
}


interface ComponentProps {
    themeName: string;
    themePath: string;
    id: string;
    app: RuntimeContext;
    data: { [key: string]: string },
    pageData: PageData
}



export class DesignPage extends React.Component<{ pageData: PageData, componentPanel: ComponentPanel, themeName: string }, State> {
    element: HTMLElement;
    componentLoader: ComponentLoader;

    constructor(props: DesignPage["props"]) {
        super(props);

        this.state = {};
        this.createComponentLoader(this.props.pageData);
    }


    createComponentLoader(pageData: PageData) {
        this.componentLoader = new ComponentLoader(pageData, this.props.themeName);
        this.componentLoader.loadComponentSuccess.add(args => {
            // let componentInfo = args.componentInfo;
            // Promise.all([
            //     ComponentLoader.loadComponentEditor(componentInfo),
            //     ComponentLoader.loadComponentLayout(componentInfo),
            // ]).then(() => {
            //     this.setState({ pageData });
            // })
        })
        this.componentLoader.loadComponentsComplete.add(() => {
            this.setState({ pageData });
        })

        this.componentLoader.loadComponentFail.add(() => {
        })
    }

    UNSAFE_componentWillReceiveProps(props: DesignPage["props"]) {
        this.createComponentLoader(props.pageData);
        this.componentLoader.loadComponentTypes();
    }

    componentDidMount() {
        this.componentLoader.loadComponentTypes();
    }

    render() {
        return <DesignerContext.Consumer>
            {args => {
                let value: ContextArguments = {
                    page: this, designer: args.designer, pageData: this.props.pageData,
                    componentPanel: this.props.componentPanel
                };
                let pageData: PageData = this.props.pageData;//JSON.parse(JSON.stringify(this.props.pageData));
                let children = pageData.children || [];
                for (let i = 0; i < children.length; i++) {
                    let props: ComponentProps = children[i].props = children[i].props || {};
                    props.app = createRuntimeContext(window["app"]);
                    props.themeName = this.props.themeName;
                    props.themePath = `/site/${this.props.themeName}`;
                }
                return <DesignPageContext.Provider value={value}>
                    <Page {...{ pageData }} />
                </DesignPageContext.Provider>
            }}
        </DesignerContext.Consumer>
    }
}

DesignPage.contextType = DesignerContext;
registerComponent(Page.typeName, DesignPage);

function createRuntimeContext(app: Application): RuntimeContext {
    let ctx: RuntimeContext = {
        createService<T extends IService>(type?: ServiceConstructor<T>): T {
            let service = app.createService<T>(type as any) as T;
            if (localStorage.getItem("user_info")) {
                let userInfo = JSON.parse(localStorage.getItem("user_info")) as { id: string };
                console.assert(userInfo != null);
                service.headers["user-id"] = userInfo.id;
            }

            let appId = window["application-id"] || window["applicationId"];
            if (appId) {
                service.headers["application-id"] = appId;
            }

            return service;
        },
        token: localStorage.getItem("token")
    }

    return ctx;
}

