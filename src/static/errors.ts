import { Errors as BaseErrors } from "maishu-toolkit";

class Errors extends BaseErrors {
    pageRecordNotExists(id: string) {
        let msg = `Page data record with id '${id}' is not exists.`;
        return new Error(msg);
    }
    urlParameterEmpty(name: string) {
        let msg = `Url parameter '${name}' is null or empty.`;
        return new Error(msg);
    }
    canntFindComponentInfo(typeName: string) {
        let msg = `Can not find component info for component '${typeName}'.`;
        return new Error(msg);
    }
    moduleNotExport(modulePath: string, memberName: string) {
        let msg = `Module '${modulePath}' has not export member '${memberName}'.`;
        return new Error(msg);
    }
    pageNameCanntEmpty() {
        let msg = `Page name can not be null or empty.`;
        return new Error(msg);
    }
    fileNotExists(filePath: string) {
        let msg = `File '${filePath}' is not exists.`;
        return new Error(msg);
    }
    loadModuleFail(modulePath: string) {
        let msg = `Load module '${modulePath}' fail.`;
        return new Error(msg);
    }
    applicationIdNotMatch(expected: string, actual: string) {
        let msg = `Application id is not match, expected: ${expected}, acutal: ${actual}.`;
        let error = new Error(msg);
        return error;
    }
    objectNotExists(objectName: string, id: string) {
        let msg = `${objectName} with id '${id}' is not exists.`;
        return new Error(msg);
    }
    domainExists(domain: string) {
        let msg = `Domain '${domain}' is exists.`;
        return new Error(msg);
    }
    componentsConfigNull() {
        let msg = `Components of website config is null.`;
        return new Error(msg);
    }
    canntFindDomain(appId: string) {
        let msg = `Can not find domain for application '${appId}'`;
        return new Error(msg);
    }
    componentTypeNotExists(name: string) {
        let msg = `Component '${name}' not exists.`;
        return new Error(msg);
    }
}

export let errors = new Errors();

