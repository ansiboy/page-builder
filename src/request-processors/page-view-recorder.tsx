import { RequestContext, RequestProcessor, RequestResult } from "maishu-node-mvc";

export class PageViewRecorder implements RequestProcessor {
    priority?: number;
    execute(ctx: RequestContext): RequestResult | Promise<RequestResult> {
        throw new Error("Method not implemented.");
    }

}