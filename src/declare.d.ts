// import type { DataStorage } from "data-storage";

interface MenuItem {
    id: string,
    name: string,
    path: string,
    children: { id: string, name: string, path: string, hidden: boolean }[]
}

interface ContextData {
    // db: import("maishu-node-data").ConnectionOptions,
    // menuItem: MenuItem[],
    dataStorage: import("./data-storage").DataStorage
}

declare module "json!menu-items" {
    let r: MenuItem[];
    export = r;
}

declare interface RequirejsContext {
    require(modules: string[],
        success: (args: object[]) => void,
        fail?: (err: any) => void,
    );

    require(module: string): any;

}

type RuntimeContext = Pick<import("maishu-chitu").Application, "createService"> & {
    readonly token: string;
    readonly id: string;
    redirect(url: string): void;
};