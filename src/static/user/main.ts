
let w = window["websiteConfig"]
w.requirejs = w.requirejs || {};
w.requirejs.paths = w.requirejs.paths || {};

w.requirejs.paths = Object.assign({
    "css": "/node_modules/maishu-requirejs-plugins/src/css",
    "react": "https://unpkg.com/react@17.0.2/umd/react.development",
    "react-dom": "https://unpkg.com/react-dom@17.0.2/umd/react-dom.development",
    "react-router-dom": "https://unpkg.com/react-router-dom@6.2.1/umd/react-router-dom.production.min",
    "react-router": "https://unpkg.com/react-router@6.2.1/umd/react-router.production.min",
    "history": "https://unpkg.com/history@5.2.0/umd/history.production.min"
}, w.requirejs.paths);

requirejs.config(w.requirejs);
let contexts = requirejs.exec("contexts");
let context = contexts["_"];
let load: (id: string, url: string) => void = context.load;
context.load = function (id: string, url: string) {
    if (url[0] == "/" && !url.endsWith(".js"))
        url = url + ".js";

    load.apply(this, [id, url]);
}

requirejs(["./index"]);