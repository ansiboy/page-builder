"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const out_1 = require("../out");
let themeHost = "127.0.0.1:6839"; //"finememo.com/themes";//
out_1.start({
    port: 5227,
    themesPath: path.join(__dirname, "themes"),
});
