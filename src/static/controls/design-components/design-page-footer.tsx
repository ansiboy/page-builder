import { PageFooter, PageFooterProps, registerComponent } from "maishu-jueying-core";
import * as React from "react";
import { DesignComponentContainer } from "./component-container";

// @component({ type: PageFooter.typeName })
export class DesignPageFooter extends React.Component<PageFooterProps & { enable?: boolean }> {
    render() {
        let style: React.CSSProperties = { height: this.props.height ? this.props.height : null, display: this.props.visible ? "" : "none" }
        return <DesignComponentContainer id={this.props.id} className={PageFooter.className} style={style} enable={this.props.enable} />
    }
}

registerComponent(PageFooter.typeName, DesignPageFooter);


