import { Page, registerComponent } from "maishu-jueying-core";
import { DesignerContext, PageDesigner } from "maishu-jueying";
import * as React from "react";
import { ComponentPanel } from "../component-panel";
import { ComponentLoader } from "../component-loader";
import "css!devices"
import { PageData } from "../../model";

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
                let pageData: PageData = this.props.pageData;
                let children = pageData.children || [];
                for (let i = 0; i < children.length; i++) {
                    let props: ComponentProps = children[i].props = children[i].props || {};
                    // props.app = createRuntimeContext(window["app"]);
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

