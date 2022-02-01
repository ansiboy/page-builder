import { PageHeaderProps, PageHeader, registerComponent } from "maishu-jueying-core";
import * as React from "react";
import { DesignComponentContainer } from "./component-container";

// @component({ type: PageHeader.typeName })
export class DesignPageHeader extends React.Component<PageHeaderProps & { enable?: boolean }> {
    private componentContainer: DesignComponentContainer;
    disable() {
        console.assert(this.componentContainer != null);
        this.componentContainer.disable();
    }
    render() {
        let style: React.CSSProperties = { height: this.props.height ? this.props.height : null, display: this.props.visible ? "" : "none" }
        return <DesignComponentContainer id={this.props.id} className={PageHeader.className} style={style} enable={this.props.enable}
            ref={e => this.componentContainer = e || this.componentContainer} />
    }
}

registerComponent(PageHeader.typeName, DesignPageHeader);


