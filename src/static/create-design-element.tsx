import { Application, IService, ServiceConstructor } from "maishu-chitu";
import { guid } from "maishu-toolkit";
import * as React from "react";
import { errorHandle } from "./error-handle";
import { componentReactFactory } from "./website-config";

export let createDesignElement = function (type: any, props?: any, ...children: any[]) {

    props = Object.assign({}, props || {});

    if (type != React.Fragment) {
        props = props || {};
        if (props.onClick) {
            delete props.onClick;
        }

        if (props.href) {
            delete props.href;
        }


        let ref = props.ref as Function;
        if (props.ref == undefined) {
            delete props.ref;
        }
        props.ref = function (e: HTMLElement) {
            if (e != null && e.onclick != null) {
                e.onclick = function () {
                    console.warn("onclick event is disabled.")
                }
            }

            if (ref != null)
                ref.apply(this, [e]);
        }

        props.app = createRuntimeContext(window["app"])


    }


    return React.createElement(type, props, ...children);
};

export function createRuntimeContext(app: Application): RuntimeContext {
    let context = {
        createService<T extends IService>(type?: ServiceConstructor<T>) {
            let service = app.createService(type);
            let token = Cookie.get(names.token);
            if (token) {
                service.headers[names.token] = token;
            }

            let userId = Cookie.get(names.userId);
            if (userId) {
                service.headers[names.userId] = userId;
            }

            console.assert(context.trackId != null);
            service.headers[names.trackId] = context.trackId;

            let appId = window[names.applicationId] || localStorage.getItem(names.applicationId);
            if (appId)
                service.headers[names.applicationId] = appId;

            service.error.add((sender, error) => {
                errorHandle(error);
            });


            (service as any).app = context;
            return service;
        },
        get token() {
            return Cookie.get(names.token);
        },
        get userId() {
            return Cookie.get(names.userId) || localStorage.getItem("user-id");
        },
        get id() {
            return window[names.applicationId] || localStorage.getItem(names.applicationId);
        },
        get trackId() {
            let value = Cookie.get(names.trackId);
            if (value == null) {
                if (window["createDesignElement"] != null) {
                    value = guid();
                    Cookie.set(names.trackId, value);
                }
                else {
                    throw new Error("Can not get track id from cookie.");
                }
            }

            return value;
        },
        redirect(url) {
            window.location.href = url;
        },
        get location() {
            return window.location;
        }
    }

    return context;
}

let names = {
    token: "token",
    userId: "user-id",
    applicationId: "application-id",
    trackId: "track-id",
};

class Cookie {
    static set(name: string, value: string, days?: number) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }
    static get(name: string) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    static erase(name: string) {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

}


(window as any)[componentReactFactory] = createDesignElement;

window["createRuntimeElement"] = function (type: any, props?: any, ...children: any[]) {
    return React.createElement(type, props, ...children);
};
window[componentReactFactory] = createDesignElement;
