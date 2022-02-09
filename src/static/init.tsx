import { Application, IService, ServiceConstructor } from "maishu-chitu";
import "css!bootstrap-css";
import "css!font-awesome";
import "/content/admin_style_default.less";
// import "/content/page-builder.less";

export default function (app: Application) {

    let createService = app.createService;
    app.createService = function <T extends IService>(type?: ServiceConstructor<T>): T {
        let s: T = createService.apply(this, [type]);
        if (!s.headers["application-id"] && window["application-id"])
            s.headers["application-id"] = window["application-id"];

        return s;
    }

}

