import * as React from "react";
import * as ReactDOM from "react-dom";

window["componentElement"] = React.createElement;

type WebsiteConfig = import("../../controllers/home").WebsiteConfig;
type PageData = import("maishu-jueying-core").PageData;

let w: WebsiteConfig = (window as any)["websiteConfig"];
let pageData: PageData = (window as any)["pageData"];
let themeName: string = (window as any)["themeName"];

console.assert(w != null, "Website config is null.");
console.assert(pageData != null, "Pagedata is null");






function loadModule(componentPath: string) {
    return new Promise((resolve, reject) => {
        requirejs([componentPath], async function (mod: any) {
            let componentType = mod.default || mod;
            resolve(componentType);
        }, (err: any) => reject(err));
    })
}

type ValueChangedCallback<T> = (args: T, sender: any) => void;

/**
 * 实现数据的存储，以及数据修改的通知
 */
class ValueStore<T> {
    private items = new Array<{ func: ValueChangedCallback<T>, sender: any }>();
    private _value: T;

    constructor(value: T) {
        this._value = value;
    }
    attach(func: ValueChangedCallback<T>, sender?: any): ValueChangedCallback<T> {
        if (this.value !== undefined) {
            func(this.value, sender);
        }
        return this.add(func, sender);
    }
    add(func: ValueChangedCallback<T>, sender?: any): ValueChangedCallback<T> {
        this.items.push({ func, sender });
        return func;
    }
    remove(func: ValueChangedCallback<T>) {
        this.items = this.items.filter(o => o.func != func);
    }
    fire(value: T) {
        this.items.forEach(o => o.func(value, o.sender));
    }
    get value(): T {
        return this._value;
    }
    set value(value: T) {
        this._value = value;
        this.fire(value);
    }
}

class SingleInvoke<T> {

    private func: () => Promise<any>;
    private result = new ValueStore<T>(undefined);
    private error = new ValueStore<T>(undefined);
    private executing: boolean = false;

    constructor(func: () => Promise<T>) {
        this.func = func;
    }

    clear() {
        this.result = new ValueStore<T>(undefined);
        this.error = new ValueStore<T>(undefined);
    }

    execute(): Promise<T> {
        if (this.result.value !== undefined) {
            return Promise.resolve(this.result.value);
        }

        if (this.executing) {
            return new Promise((resolve, reject) => {
                this.result.add(value => {
                    resolve(value);
                })
                this.error.add(err => {
                    reject(err);
                })
            })
        }

        this.executing = true;
        return new Promise((resolve, reject) => {
            this.func().then(r => {
                this.result.value = r || null;
                this.executing = false;
                resolve(r);

            }).catch(err => {
                this.error = err;
                this.executing = false;
                reject(err);
            });
        })
    }

}


var componentDataInvoker = new SingleInvoke(() => new Promise((resolve, reject) => {
    let componentDataKey = window["dataKey"];
    console.assert(componentDataKey != null);
    // requirejs([`/getComponentDatas/${componentDataKey}`], function (module) {

    // })
    fetch(`/user-api/componentDatas/${componentDataKey}`).then(async r => {
        let componentDatas = await r.json();
        resolve(componentDatas);
    }).catch(err => {
        reject(err);
    })

}))

pageData.children.forEach(c => {
    let componentInfo = (w.components || []).filter(o => o.type == c.type)[0];
    if (componentInfo && componentInfo.path && componentInfo.renderSide != "server") {
        let renderSide = componentInfo.renderSide || "both";
        let componentPath = `/themes/${themeName}/${componentInfo.path}.js`;

        Promise.all([loadModule(componentPath), componentDataInvoker.execute()])
            .then(([componentType, componentDatas]: [any, { [key: string]: any }]) => {
                let props = Object.assign(c.props, { data: componentDatas[c.props.id] || {} });
                let element = React.createElement(componentType, props);
                let node = document.getElementById(c.id);
                if (node == null)
                    return;

                if (renderSide == "client") {
                    ReactDOM.render(element, node);
                }
                else {
                    ReactDOM.hydrate(element, node);
                }
            })


    }
})
