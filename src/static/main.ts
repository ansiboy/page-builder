let node_modules = "node_modules";
var requirejsConfig = {
    "paths": {
        "css": "node_modules/maishu-requirejs-plugins/src/css",
        "text": "node_modules/maishu-requirejs-plugins/lib/text",
        "json": "node_modules/maishu-requirejs-plugins/src/json",

        "react": "node_modules/react/umd/react.development",
        "react-dom": "node_modules/react-dom/umd/react-dom.development",
        "maishu-chitu": "node_modules/maishu-chitu/dist/index.min",
        "maishu-chitu-react": "node_modules/maishu-chitu-react/dist/index.min",
        "maishu-chitu-service": "node_modules/maishu-chitu-service/dist/index.min",
        "maishu-dilu": "node_modules/maishu-dilu/dist/index.min",
        "maishu-toolkit": "node_modules/maishu-toolkit/dist/index.min",
        "maishu-ui-toolkit": "node_modules/maishu-ui-toolkit/dist/index.min",
        "maishu-wuzhui": "node_modules/maishu-wuzhui/dist/index.min",
        "maishu-wuzhui-helper": "node_modules/maishu-wuzhui-helper/dist/index.min",
        "bootstrap-css": `${node_modules}/bootstrap/dist/css/bootstrap.css`,
        "font-awesome": `${node_modules}/font-awesome/css/font-awesome.css`
    }
}

requirejs(["website-config"], function (mod) {
    let config = mod.default || mod;
    loadApplication(config);
})

function loadApplication(config) {
    config.requirejs = config.requirejs || {};
    config.requirejs.paths = Object.assign(config.requirejs.paths || {}, requirejsConfig.paths);

    let req = requirejs.config(config.requirejs || {});

    let init = function () {
        req(["application", "init"], (mod, initModule) => {
            let app = mod.run(config, req);
            let func = initModule.default || initModule;
            if (typeof func != "function") {
                console.log("Export of init module is not a function.");
            }
            else {
                func(app);
                app.run();
            }
        });
    }

    if (config.mode == "production") {
        req(["pre-required"], function (prerequired) {
            let keys = Object.getOwnPropertyNames(prerequired);
            for (let i = 0; i < keys.length; i++) {
                define(keys[i], function () {
                    return prerequired[keys[i]];
                })
            }
            init();
        });
    }
    else {
        init();
    }
}
