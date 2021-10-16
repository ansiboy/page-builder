// import { DataListPage, DataListPageState } from "maishu-data-page";
// import { rules } from "maishu-dilu";
// import { DataSource } from "maishu-toolkit";
// import { DataControlField, DataControlFieldParams } from "maishu-wuzhui";
// import React = require("react");
// import { HtmlSnippet } from "../../entities";
// import { dataSources } from "../services";
// import { PageProps } from "maishu-chitu-react";
// import ReactDOM = require("react-dom");
// import { hideDialog, showDialog } from "maishu-ui-toolkit";
// import { FormValidator } from "maishu-dilu-react";

// interface State extends DataListPageState {
//     quickAddShown: boolean,
// }

// export default class HtmlSnippetPage extends DataListPage<HtmlSnippet, PageProps, State>{
//     constructor(props: HtmlSnippetPage["props"]) {
//         super(props);

//         this.state = { quickAddShown: false };
//     }

//     dataSource: DataSource<HtmlSnippet> = dataSources.htmlSnippet;
//     columns: DataControlField<HtmlSnippet, DataControlFieldParams>[] = [
//         this.boundField({
//             dataField: "url", headerText: "链接", emptyText: "请输入页面链接（支持正则表达式）",
//             itemStyle: { width: "180px" },
//             validation: { rules: [rules.required("请输入页面链接")] },
//             sortExpression: "url",
//         }),
//         this.boundField({
//             dataField: "isRegex",
//             headerText: "正则",
//             itemStyle: { textAlign: "center", width: "50px" },
//             createControl() {
//                 let element = document.createElement("div");
//                 element.className = "checkbox";
//                 element.style.marginTop = "0";
//                 element.innerHTML = `<label style="width:unset;">
//                     <input type="checkbox">
//                     <span> 使用正则表达式 </span>
//                 </label>`;

//                 let input = element.querySelector("input");

//                 return {
//                     element: element,
//                     get value() {
//                         return input.checked;
//                     },
//                     set value(value) {
//                         input.checked = value == true;
//                     }
//                 }
//             },
//             renderCell(cell, dataItem) {
//                 ReactDOM.render(<>{dataItem.isRegex ? <i className={"fa fa-check text-success"} style={{ marginTop: 4 }} /> : null}</>, cell.element);
//             }
//         }),
//         this.boundField({
//             dataField: "code", headerText: "代码", emptyText: "请添加插入到页面的代码",
//             createControl() {
//                 let element = document.createElement("textarea");
//                 element.className = "form-control";
//                 element.style.minHeight = "120px";
//                 return {
//                     element,
//                     get value() {
//                         return element.value
//                     },
//                     set value(value) {
//                         element.value = value || "";
//                     }
//                 }
//             },
//             renderCell(cell, dataItem) {
//                 cell.element.innerText = dataItem.code;
//             },
//             validation: { rules: [rules.required("请添加插入到页面的代码")] },
//         }),
//         this.boundField({
//             dataField: "target",
//             headerText: "位置",
//             itemStyle: { width: "100px" },
//             createControl() {
//                 let select = document.createElement("select");
//                 select.className = "form-control";
//                 ["head", "body"].map(t => {
//                     let option = document.createElement("option");
//                     option.value = t;
//                     option.innerHTML = t;
//                     return option;
//                 }).forEach(o => select.appendChild(o));
//                 return {
//                     element: select,
//                     get value() {
//                         return select.value;
//                     },
//                     set value(value) {
//                         value = value || "head";
//                         select.value = value;
//                     }
//                 }
//             }
//         }),
//         this.boundField({
//             dataField: "replacement",
//             headerText: "替换",
//             itemStyle: { width: "200px" },
//             emptyText: "请输入要替换的元素，使用 CSS 选择器"
//         })

//     ];

//     showKeywordsDialog() {
//         KeywordsDialog.show();
//         this.setState({ quickAddShown: false });
//     }

//     showDescriptionDialog() {
//         showDialog(descriptionDialogElement);
//         this.setState({ quickAddShown: false });
//     }

//     showTitleDialog() {

//     }

//     renderToolbarRight() {
//         let { quickAddShown } = this.state;

//         return [
//             <div className="btn-group">
//                 <button type="button" className="btn btn-primary btn-sm dropdown-toggle"
//                     data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
//                     onClick={() => {
//                         this.setState({ quickAddShown: !quickAddShown })
//                     }}>
//                     <i className="fa fa-flash" />
//                     <span>快速添加</span>
//                     <span className="fa fa-sort-down" style={{ marginLeft: 4, top: -2, position: "relative" }}></span>
//                 </button>
//                 <ul className="dropdown-menu" style={{ display: quickAddShown ? "inherit" : "none" }}>
//                     <li><a href="script:" onClick={() => this.showKeywordsDialog()}>关键词</a></li>
//                     <li><a href="script:" onClick={() => this.showDescriptionDialog()}>描述</a></li>
//                     <li><a href="script:" onClick={() => this.showTitleDialog()}>标题</a></li>
//                 </ul>
//             </div>,
//             ...super.renderToolbarRight(),
//         ]
//     }
// }

// class KeywordsDialog extends React.Component<{}, { url?: string, keywords?: string }> {

//     private static validator: FormValidator = new FormValidator();
//     private static keywordsDialogElement: HTMLElement;

//     constructor(props: KeywordsDialog["props"]) {
//         super(props);

//         this.state = {};
//     }

//     private static async addKeywords(instance: KeywordsDialog) {
//         let { url, keywords } = instance.state;
//         if (!this.validator.check())
//             return;

//         let item: HtmlSnippet = {
//             url: url,
//             code: `<meta name="keywords" content="${keywords}">`,
//             target: "head",
//         } as HtmlSnippet;

//         await dataSources.htmlSnippet.insert(item);
//         hideDialog(KeywordsDialog.keywordsDialogElement);
//         instance.setState({ url: "", keywords: "" });
//     }

//     static show() {
//         this.validator.clearErrors();
//         if (!this.keywordsDialogElement) {
//             this.keywordsDialogElement = document.createElement("div");
//             this.keywordsDialogElement.className = "modal fade";
//             ReactDOM.render(<KeywordsDialog />, this.keywordsDialogElement);
//             document.body.appendChild(this.keywordsDialogElement);
//         }

//         showDialog(this.keywordsDialogElement);
//     }

//     static hide() {
//         hideDialog(this.keywordsDialogElement)
//     }

//     render() {
//         let { url, keywords } = this.state;
//         let validator = KeywordsDialog.validator;
//         return <div className="modal-dialog">
//             <div className="modal-content">
//                 <div className="modal-header">
//                     <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
//                     <h4 className="modal-title">添加关键词</h4>
//                 </div>
//                 <div className="modal-body">
//                     <div className="form-group clearfix input-control">
//                         <label>链接</label>
//                         <span>
//                             <input className="form-control" name="url" placeholder="请输入页面链接（支持正则表达式）"
//                                 onChange={e => {
//                                     this.setState({ url: e.target.value })
//                                 }} />
//                             {validator.field(url, [rules.required("请输入页面链接")])}
//                         </span>
//                     </div>
//                     <div className="form-group clearfix input-control">
//                         <label>关键词</label>
//                         <span>
//                             <textarea className="form-control" placeholder="请输入关键词，多个关键词请用 , 隔开"
//                                 onChange={e => {
//                                     this.setState({ keywords: e.target.value });
//                                 }} />
//                             {validator.field(keywords, [rules.required("请输入关键词")])}
//                         </span>
//                     </div>
//                 </div>
//                 <div className="modal-footer">
//                     <button type="button" className="btn btn-default"
//                         onClick={() => KeywordsDialog.hide()}>
//                         <i className="fa fa-reply" />
//                         <span>取消</span>
//                     </button>
//                     <button type="button" className="btn btn-primary"
//                         onClick={() => KeywordsDialog.addKeywords(this)}>
//                         <i className="fa fa-save" />
//                         <span>确定</span>
//                     </button>
//                 </div>
//             </div>
//         </div>
//     }
// }

// class DescriptionDialog extends React.Component {
//     render() {
//         return <div className="modal-dialog">
//             <div className="modal-content">
//                 <div className="modal-header">
//                     <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
//                     <h4 className="modal-title">Modal title</h4>
//                 </div>
//                 <div className="modal-body">
//                     <p>One fine body&hellip;</p>
//                 </div>
//                 <div className="modal-footer">
//                     <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
//                     <button type="button" className="btn btn-primary">Save changes</button>
//                 </div>
//             </div>
//         </div>
//     }
// }

// class TitleDialog extends React.Component {
//     constructor(props) {
//         super(props);
//     }

//     render() {
//         return <>

//         </>
//     }
// }




// let descriptionDialogElement = document.createElement("div");
// descriptionDialogElement.className = "modal fade";
// document.body.appendChild(descriptionDialogElement);

// ReactDOM.render(<DescriptionDialog />, descriptionDialogElement);