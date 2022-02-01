import { PageBody, PageBodyProps, PageHeader, PageHeaderProps, PageFooter, PageFooterProps, registerComponent } from "maishu-jueying-core";
import * as React from "react";
import { DesignComponentContainer } from "./component-container";
import { DesignPageContext } from "./design-page";

export class DesignPageBody extends React.Component<PageBodyProps & { enable?: boolean }> {
    render() {
        return <DesignPageContext.Consumer>
            {args => {
                let style: React.CSSProperties = { marginTop: 0 };
                if (args.pageData == null)
                    return null;

                return <DesignComponentContainer className={PageBody.className} {...this.props} style={style} enable={this.props.enable} />
            }}
        </DesignPageContext.Consumer>
    }
}

registerComponent(PageBody.typeName, DesignPageBody);


