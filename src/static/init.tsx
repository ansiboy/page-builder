import { Application } from "maishu-admin-scaffold/static/application";
import { PageRecord } from "../entities";
import { errors } from "./errors";
import { LocalService } from "./services";
import { ImageService } from "maishu-image-components";
import { IService, ServiceConstructor } from "maishu-chitu-service";

ImageService.serviceHost = "imageHost";
ImageService.headers["application-id"] = window["application-id"] || localStorage.getItem("application-id");

type MenuItem = Application["mainMaster"]["menuItems"][0];

export default function (app: Application) {

    let createService = app.createService;
    app.createService = function <T extends IService>(type?: ServiceConstructor<T>): T {
        let s: T = createService.apply(this, [type]);
        if (!s.headers["application-id"] && window["application-id"])
            s.headers["application-id"] = window["application-id"];

        return s;
    }

    updateMenuItems(app);
    LocalService.themeChanged.add(args => {
        updateMenuItems(app);
    })
}

let pageMenuItems: MenuItem[] = [];
function updateMenuItems(app: Application) {

    let localService = app.createService(LocalService);
    localService.getPages().then(r => {

        let menuItems = app.mainMaster.state.menuItems;
        menuItems = menuItems.filter(o => pageMenuItems.map(c => c.id).indexOf(o.id) < 0);

        pageMenuItems = r.map(o => toMenuItem(o)).filter(o => o != null).sort((a, b) => a.sortNumber > b.sortNumber ? 1 : -1);

        console.assert(menuItems != null);
        menuItems.push(...pageMenuItems);

        app.mainMaster.setState({ menuItems });
    })
}

function toMenuItem(r: PageRecord): MenuItem {
    if (!r)
        throw errors.argumentNull("r");

    let pageName = r.name;
    if (pageName.endsWith("home")) {
        return { id: r.id, name: "首页", type: "menu", sortNumber: 100, path: `#${r.themeName}-page-edit?name=${r.name}` };
    }
    else if (pageName.endsWith("product-list")) {
        return { id: r.id, name: "商品列表", type: "menu", sortNumber: 110, path: `#${r.themeName}-page-edit?name=${r.name}` };
    }
    else if (pageName.endsWith("product")) {
        return { id: r.id, name: "商品", type: "menu", sortNumber: 120, path: `#${r.themeName}-page-edit?name=${r.name}` }
    }
    else if (pageName == "base-template") {
        return { id: r.id, name: "模板", type: "menu", sortNumber: 120, path: `#${r.themeName}-page-edit?name=${r.name}` }
    }

    return null;
}

