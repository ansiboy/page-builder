import { processorPriorities, RequestContext, RequestProcessor, RequestResult, StaticFileProcessor } from "maishu-node-mvc";
import { JavaScriptProcessor } from "maishu-nws-js";
import * as fs from "fs";

export class JavaScriptProcessorWrapper implements RequestProcessor {
    priority?: number;
    private themesDirectoryName: string;
    private reactFactory: string;

    constructor(themesDirectoryName: string, reactFactory: string) {
        this.themesDirectoryName = themesDirectoryName;
        this.reactFactory = reactFactory;
    }

    execute(ctx: RequestContext): RequestResult | Promise<RequestResult> {



        let componentFileRegex = new RegExp(`/${this.themesDirectoryName}/\\S+/components/\\S+`);
        if (!componentFileRegex.test(ctx.virtualPath) || !ctx.virtualPath.endsWith(".js"))
            return null;

        let pathWidthoutExt: string = ctx.virtualPath;
        pathWidthoutExt = pathWidthoutExt.substring(0, pathWidthoutExt.length - ".js".length);
        let tsxVirtualPath = pathWidthoutExt + ".tsx";

        let staticDirectory = ctx.rootDirectory.findDirectory("static");
        if (staticDirectory == null)
            throw new Error(`Static directory is not exists.`);

        let physicalPath = staticDirectory.findFile(tsxVirtualPath);
        if (physicalPath == null)
            return null;// throw new Error(`File '${physicalPath}' is not exists.`);

        let buffer = fs.readFileSync(physicalPath);
        let code = buffer.toString();
        let options: babel.TransformOptions = {
            "presets": [
                ["@babel/preset-env", {
                    "targets": { chrome: 58 }
                }],
            ],
            plugins: [
                ["@babel/plugin-transform-typescript", { isTSX: true }],
                ["@babel/plugin-transform-react-jsx", { "pragma": this.reactFactory, "pragmaFrag": "React.Fragment" }],
                ["@babel/plugin-transform-modules-amd", { noInterop: true }],
            ]
        };

        let newCode = JavaScriptProcessor.transformTS(code, options);
        newCode = `// Physical Path:${physicalPath}\r\n${newCode}`;

        const encoding = 'UTF-8';
        return { content: newCode, headers: { "content-type": `application/x-javascript; charset=${encoding}` } };
    }
}