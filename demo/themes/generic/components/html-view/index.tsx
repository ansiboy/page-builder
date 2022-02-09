import * as React from "react";

export interface Props {
    html: string;
}

export default class extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }
    render(): React.ReactNode {
        return <div>{this.props.html || "请输入 HTML"}</div>
    }
}