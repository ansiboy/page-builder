import { buttonOnClick } from "maishu-ui-toolkit";
import * as  React from "react";
import { LocalService } from "../services";

let localService = new LocalService();

interface Props {
}

interface State {
}

export default class extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {};
    }

    selectTheme(name: string) {
        return localService.setTheme(name)
    }

    render() {
        let keys = Object.getOwnPropertyNames({});
        return <div className="row">
            {keys.map(o =>
                <div key={o} className="col-md-3 text-center">
                    <img src={`${o}/content/preview.png`} className="img-responsive"
                        style={{ border: "solid 1px #cccccc" }} />

                    <button className="btn btn-primary btn-block" style={{ marginTop: 20 }}
                        ref={e => {
                            if (!e) return;
                            buttonOnClick(e, () => this.selectTheme(o));
                        }}>
                        <i className="glyphicon glyphicon-ok"></i>
                        <span>选择模板</span>
                    </button>
                </div>
            )}
        </div>
    }
}