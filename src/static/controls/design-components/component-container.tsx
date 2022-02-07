import { PageDesigner, DesignerContext } from "maishu-jueying";
import { parseComponentData, registerComponent, ComponentData } from "maishu-jueying-core";
import { guid } from "maishu-toolkit";
import { DesignPageContext, ContextArguments } from "./design-page";
import { ComponentContainer as BaseComponentContainer, ComponentContainerProps as BaseComponentContainerProps } from "maishu-jueying-core";
import * as React from "react";

const DATA_COMPONENT_ID = "data-component-id"

export type ComponentContainerProps = BaseComponentContainerProps & {
    enable?: boolean
}

export class DesignComponentContainer extends BaseComponentContainer<ComponentContainerProps> {
    private containers: HTMLElement[] = [];

    constructor(props: ComponentContainerProps) {
        super(props);
    }

    private enableDrapDrop(containerElement: HTMLElement, designer: PageDesigner) {
        let pageData = designer.pageData;
        console.assert(containerElement != null);
        $(containerElement).sortable({
            axis: "y",
            stop: () => {

                //==============================================================================================
                // 对组件进行排序
                var componentIds = $(containerElement).find("li").map((i, e) => e.getAttribute(DATA_COMPONENT_ID)).toArray();
                var componentDatas = componentIds.map(id => pageData.children.filter(o => o.id == id)[0]);
                pageData.children = pageData.children.filter(o => componentIds.indexOf(o.id) < 0);
                pageData.children.push(...componentDatas);
                //==============================================================================================

            },
            receive: (event, ui) => {
                let componentData: ComponentData = JSON.parse(ui.helper.attr("component-data"));
                componentData.id = componentData.id || guid();
                componentData.parentId = this.props.id;
                componentData.props = {
                    id: componentData.id,
                }
                let newComponentIndex: number = 0;
                let preComponentId: string | undefined = undefined;
                ui.helper.parent().children().each((index, element) => {
                    if (element == ui.helper[0]) {
                        // elementIndex = index;
                        return false;
                    }
                    preComponentId = element.getAttribute(DATA_COMPONENT_ID)
                })

                if (preComponentId) {
                    var c = designer.findComponentData(preComponentId);
                    console.assert(c != null);
                    let preIndex = pageData.children.indexOf(c);
                    newComponentIndex = preIndex + 1;
                }


                let isFirst = newComponentIndex == 0;
                let isLatest = newComponentIndex >= pageData.children.length;

                if (isFirst) {
                    designer.appendComponent(componentData, 0);
                }
                else if (isLatest) {
                    designer.appendComponent(componentData);
                }
                else {
                    designer.appendComponent(componentData, newComponentIndex);
                }

                designer.selectComponent(componentData.id);
                ui.helper.remove();
            }
        })
    }
    disable() {
        this.containers.forEach(c => {
            $(c).sortable("disable");
            $(c).find("li").attr("contentEditable", "true");
            $(c).find("li").css("cursor", "default");
        })
    }
    enable() {
        this.containers.forEach(c => {
            $(c).sortable("options", "disable", false);
            $(c).find("li").attr("contentEditable", "false");
            $(c).find("li").css("cursor", "move");
        })
    }
    componentDidMount() {

    }

    createContainer(args: ContextArguments, column: string) {

        let pageData = args.pageData;
        if (pageData == null)
            return null;

        pageData.children.forEach(c => {
            c.props = c.props || {};
            c.props.column = c.props.column || "0";
        })

        let children = pageData.children.filter(o => typeof o != "string" && o.parentId == this.props.id && o.props.column == column) as ComponentData[];
        let className = this.props.className || "";
        if (children.length == 0) {
            className = className + " empty";
        }

        let style = this.props.style || {};
        className = className
        return <ul id={guid()} className={className} style={style}
            ref={e => {
                if (e == null || this.containers.indexOf(e) >= 0)
                    return

                // e.setAttribute(DataColumn, column.toString());
                this.containers.push(e)
                let enable = this.props.enable == null ? true : this.props.enable;
                if (enable) {
                    this.enableDrapDrop(e, args.designer);
                    setTimeout(() => {
                        args.componentPanel.addDropTarget(e);
                    })
                }

            }}>
            {children.length == 0 ?
                <li className="text-center">
                    <h4>请拖放组件到此处</h4>
                </li>
                : children.map(o => <li key={o.id} data-component-id={(o.id)}
                    className={o.selected ? "selected" : ""}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (o.selected) {
                            args.designer.selectComponent([])
                        }
                        else {
                            args.designer.selectComponent(o.id)
                        }
                    }}>
                    {parseComponentData(o, pageData)}</li>)
            }
        </ul>
    }

    render() {
        return <DesignPageContext.Consumer>
            {args => {
                return <>
                    {this.createContainer(args, "0")}
                </>
            }}
        </DesignPageContext.Consumer>

    }
}

DesignComponentContainer.contextType = DesignerContext;

registerComponent("ComponentContainer", DesignComponentContainer)