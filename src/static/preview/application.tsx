
import { Application } from "maishu-chitu-react";
import React = require("react");
import { routers } from "../routers";
import ReactDOM = require("react-dom");
import strings from "../strings";
import { IService, ServiceConstructor } from "maishu-chitu-service";
import { types } from "@babel/core";


class MyApplication extends Application {

    private req: Function;

    constructor(config: any, req: Function) {
        super(config);

        this.req = req;
        this.pageCreated.add((app, page) => {
            console.log(page.data.id);
        })

        this.pageShown.add(() => {

        })

        window.onpopstate = (event: PopStateEvent) => {
            this.showPage(document.location.href);
        }
    }

    createPageElement(pageName: string, containerName: string) {
        let element = super.createPageElement(pageName, containerName);
        element.className = "page";
        ReactDOM.render(<div className="text-center" style={{ paddingTop: 200, paddingBottom: 200 }}>
            <i className="fa fa-spinner fa-spin" />
            <span>
                {strings.pageLoading}
            </span>
        </div>, element);
        return element;
    }

    async loadjs(path: string) {
        return new Promise<any>((reslove, reject) => {
            this.req([path],
                function (result: any) {
                    reslove(result);
                },
                function (err: Error) {
                    reject(err);
                });


        });
    }

    parseUrl(url: string) {

        let a = document.createElement("a");
        a.href = url;
        let pathname = a.pathname;
        if (pathname == "/") {
            pathname = "/home";
        }
        let m: { [name: string]: string } | null = null;
        let values: any = {};
        for (let i = 0; i < routers.length; i++) {
            m = routers[i].match(pathname);
            if (m) {
                values = Object.assign({}, m);
                if (a.search && a.search.length > 1) {
                    let query = this.pareeUrlQuery(a.search.substr(1));
                    Object.assign(values, query)
                }

                break;
            }
        }

        if (a.search != null && a.search.length > 1) {
            var q = super.pareeUrlQuery(a.search.substr(1));
            values = Object.assign(values, q);
        }

        return { pageName: "page", values };
    }

}


export function run(config: any, req) {
    window["app"] = window["app"] || new MyApplication(config, req);

    let app: Application = window["app"];
    let createService = app.createService;
    app.createService = function <T extends IService>(type?: ServiceConstructor<T>): T {
        let s: T = createService.apply(this, [type]);
        if (!s.headers["application-id"] && window["application-id"])
            s.headers["application-id"] = window["application-id"];

        debugger;

        return s;
    }
    // createService<T extends IService>(type?: ServiceConstructor<T>): T {
    //     let s = super.createService(type);
    //     s.headers["application-id"] = window["application-id"];
    //     let token = localStorage["token"];
    //     if (token) {
    //         s.headers["token"] = token;
    //     }
    //     return s;
    // }


    return window["app"];
}


window["createRuntimeElement"] = function (type: any, props?: any, ...children: any[]) {
    if (type == "a") {
        props = props || {};

        let app = window["app"] as MyApplication;

        if (props.href) {
            let href = props.href;
            delete props.href;
            props.onClick = function (e) {
                e.preventDefault();
                window.history.pushState({}, "", href);
                app.showPage(href);

            } as React.MouseEventHandler<HTMLAnchorElement>;
        }

    }


    return React.createElement(type, props, ...children);
};