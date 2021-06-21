
declare let requirejs: {
    (config: any);
    (config: any, modules: string[], callback?: Function, err?: Function);
    (modules: string[], callback?: Function, err?: Function);
    config: Function;
    exec(name);
};


declare let define: Function;

declare module "website-config" {
    let a: typeof import("./website-config");
    export = a;
}

declare module "share/app" {
    export let createRuntimeContext: (app: import("maishu-chitu").Application) => RuntimeContext
}
