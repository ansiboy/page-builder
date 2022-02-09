import { PropertyEditorInfo } from "maishu-jueying";
import * as React from "react";

let htmlProp = "html";

export default function (propEditors: PropertyEditorInfo[]): JSX.Element {
    let htmlEditor = propEditors.filter(o => o.prop == htmlProp)[0];
    console.assert(htmlEditor != null);

    return <div className="form-group">
        {htmlEditor.editor}
    </div>
}