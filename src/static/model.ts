import { ComponentData as SourceComponentData, PageData as SourcePageData } from "maishu-jueying-core";

export type ComponentData = Omit<SourceComponentData, "children"> & { parentId?: string };

// export interface ComponentInfo {
//     displayName?: string;
//     type: string;
//     path?: string;
//     editor?: string;
//     design?: string;
//     layout?: string;
//     sortNumber?: number;
//     icon?: string;
//     introduce?: string;
//     group?: string;
//     data?: ComponentData,
//     renderSide?: "both" | "server" | "client"
// }

export type PageData = Omit<SourceComponentData, "children"> & { children: ComponentData[] };