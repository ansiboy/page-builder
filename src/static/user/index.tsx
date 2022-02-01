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

pageData.children.forEach(c => {
    let componentInfo = (w.components || []).filter(o => o.type == c.type)[0];
    if (componentInfo && componentInfo.path && componentInfo.renderSide != "server") {
        let renderSide = componentInfo.renderSide || "both";
        let componentPath = `/themes/${themeName}/${componentInfo.path}.js`;
        requirejs([componentPath], async function (mod: any) {
            let componentType = mod.default || mod;
            let element = React.createElement(componentType, c.props);
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
