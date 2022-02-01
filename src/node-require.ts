import assert = require("assert");
import * as path from "path";
import * as fs from "fs";

type Module = {
    id: string,
    filename: string,
    loaded: boolean,
    parent?: Module,
    _load: Function,
    constructor: any,
}


export const ThemePhysicalPathName = "themePhysicalPath";

export let moduleCSS: { [moduleId: string]: string[] } = {};


module.constructor.prototype.require = function (filePath: string) {

    var self: Module = this;
    assert(typeof filePath === 'string', 'path must be a string');
    assert(filePath, 'missing path');
    let ext = path.extname(filePath);
    if (isCss(ext)) {
        let cssFilePhysicalPath: string;
        if (path.isAbsolute(filePath)) {
            cssFilePhysicalPath = filePath;
        }
        else {
            let filename = self.filename;
            let dirname = path.dirname(filename);
            cssFilePhysicalPath = path.join(dirname, filePath);
        }

        if (!fs.existsSync(cssFilePhysicalPath))
            throw errors.fileNotExists(cssFilePhysicalPath);

        console.assert(self.parent != null, `Module '${filePath}' parent is null.`);

        let themePhysicalPath = (global as any)[ThemePhysicalPathName];
        if (!themePhysicalPath) throw new Error('Theme physical path is null.');

        var cssRelativePath = path.relative(themePhysicalPath, cssFilePhysicalPath);
        moduleCSS[self.id] = moduleCSS[self.id] || [];
        if (moduleCSS[self.id].indexOf(cssRelativePath) < 0) {
            moduleCSS[self.id].push(cssRelativePath);
        }

        return {};
    }

    let module = self.constructor._load(filePath, self);
    return module;

}

function isCss(ext: string) {
    let exts = [".css", ".sass", ".less", ".scss"];
    let b = exts.indexOf(ext) >= 0;
    return b;
}

class Errors {
    fileNotExists(filePath: string) {
        let msg = `File '${filePath}' is not exists.`;
        return new Error(msg);
    }
}

export let errors = new Errors();
