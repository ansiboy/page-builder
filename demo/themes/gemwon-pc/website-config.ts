// import { WebsiteConfig as BaseWebsiteConfig } from "maishu-chitu-scaffold/static/website-config";

interface ComponentInfo {
    displayName?: string;
    type: string;
    path: string;
    editor?: string;
    design?: string;
    layout?: string;
    sortNumber?: number;
    icon?: string;
    introduce?: string;
    group?: string;
    data?: import("maishu-jueying-core").ComponentData
}

type WebsiteConfig = { components: ComponentInfo[], requirejs?: any };
export let components: ComponentInfo[] = [

];

let w: WebsiteConfig = {
    components: [
        {
            displayName: "HTML",
            icon: "fa fa-text-width",
            type: "HtmlView",
            path: "../generic/components/html-view/html-view",
            editor: "../generic/editors/html-view/prop-editor",
            layout: '../generic/component-editor-renders/html'
        },
        {
            // displayName: '菜单',
            icon: 'fa fa-text-width',
            introduce: '页面导航菜单。',
            type: 'Menu',
            path: 'components/menu/menu',
            design: "design/menu"
        },
        {
            // displayName: '页脚',
            icon: 'fa fa-text-width',
            introduce: '页面底部。',
            type: 'Footer',
            path: './components/footer/footer'
        },
        {
            // displayName: '首页',
            icon: 'fa fa-text-width',
            introduce: '首页',
            type: 'Home',
            path: './components/home/home'
        },
        {
            // displayName: '导航',
            icon: 'fa fa-text-width',
            type: 'Navigation',
            path: './components/home/navigation'
        },
        {
            // displayName: '轮播',
            icon: 'fa fa-text-width',
            type: 'Carousel',
            path: './components/home/carousel',
            editor: './editors/carousel/index',
            design: './design/carousel'
        },
        {
            // displayName: "图片导航",
            icon: "fa fa-text-width",
            type: "ButtonTextImageNavigation",
            path: "./components/home/image-navigation/button-text",
            editor: "./editors/image-navigation/button-text",
        },
        {
            // displayName: "图片导航2",
            icon: "fa fa-text-width",
            type: "SimpleImageNavigation",
            path: "./components/home/image-navigation/simple",
            editor: "./editors/image-navigation/simple",
        },
        {
            displayName: "商品列表",
            icon: "fa fa-text-width",
            type: "ProductList",
            path: "./components/product/product-list",
            editor: "./editors/product-list/index",
            layout: "./layout/product-list",
            design: "./design/product/product-list"
        },
        {
            displayName: "标签页商品",
            icon: "fa fa-text-width",
            type: "TabProducts",
            path: "./components/product/tab-products",
            editor: "./editors/tab-products/index",
            layout: "./layout/tab-products",
            design: "./design/product/tab-products"
        },
        {
            // displayName: "商品列表页",
            icon: "fa fa-text-width",
            type: "ProductListView",
            path: "./components/product/product-list-view"
        },
        {
            // displayName: "商品页",
            icon: "fa fa-text-width",
            type: "ProductInfo",
            path: "./components/product/product-info",
            // design: "./design/product-info"
        },
        {
            // displayName: "PC登录",
            icon: "fa fa-text-width",
            type: "login",
            path: "./components/users/login"
        },
        {
            // displayName: "PC註冊",
            icon: "fa fa-text-width",
            type: "register",
            path: "./components/users/register"
        },
        {
            // displayName: "付款成功",
            icon: "fa fa-text-width",
            type: "success",
            path: "./components/cart/success"
        }
        ,
        {
            // displayName: "付款失敗",
            icon: "fa fa-text-width",
            type: "failure",
            path: "./components/cart/failure"
        }
        ,
        {
            //displayName: "忘记密码",
            icon: "fa fa-text-width",
            type: "forgot",
            path: "./components/users/forgot"
        }
        , {
            //displayName: "忘记密码-验证邮箱",
            icon: "fa fa-text-width",
            type: "LimitEmail",
            path: "./components/users/limit-email"
        }
        ,
        {
            // displayName: "找回密码",
            icon: "fa fa-text-width",
            type: "reset",
            path: "./components/users/reset"
        }
        ,
        {
            // displayName: "个人中心",
            icon: "fa fa-text-width",
            type: "Account",
            path: "./components/account/account"
        }, {
            // displayName: "收藏夹列表",
            icon: "fa fa-text-width",
            type: "WishList",
            path: "./components/account/wish-list"
        }, {
            // displayName: "积分列表",
            icon: "fa fa-text-width",
            type: "GrowthPoints",
            path: "./components/account/growth-points"
        },
        {
            // displayName: "订单列表",
            icon: "fa fa-text-width",
            type: "OrderList",
            path: "./components/account/order-list"
        },
        {
            // displayName: "订单详细页",
            icon: "fa fa-text-width",
            type: "OrderDetail",
            path: "./components/account/order-detail"
        },
        {
            // displayName: "订单评论页",
            icon: "fa fa-text-width",
            type: "ProductEvaluation",
            path: "./components/account/product-evaluation"
        },
        {
            // displayName: "购物车",
            icon: "fa fa-text-width",
            type: "ShoppingCart",
            path: "./components/cart/shopping-cart"
        },
        {
            // displayName: "右侧导航",
            icon: "fa fa-text-width",
            type: "RightSideNav",
            path: "./components/menu/right-side-nav"

        },
        {
            // displayName: "地址列表",
            icon: "fa fa-text-width",
            type: "ReceiptList",
            path: "./components/account/receipt-list"
        },
        {
            // displayName: "结账",
            icon: "fa fa-text-width",
            type: "CheckoutView",
            path: "./components/cart/checkouts-view"
        },
        {
            // displayName: "修改密码",
            icon: "fa fa-text-width",
            type: "ChangePassword",
            path: "./components/account/change-password"
        },
        {
            // displayName: "博客列表",
            icon: "fa fa-text-width",
            type: "BlogList",
            path: "./components/blog/blog-list"
        }
        ,
        {
            // displayName: "博客详情",
            icon: "fa fa-text-width",
            type: "BlogDetail",
            path: "./components/blog/blog-detail"
        }, {
            // displayName: "关于我们",
            icon: "fa fa-text-width",
            type: "AboutUs",
            path: "./components/about/about-us",
            editor: "./editors/about/about-editor",
            layout: '../generic/component-editor-renders/about'
        },
        {
            // displayName: "关于卓旺",
            icon: "fa fa-text-width",
            type: "AboutGemwon",
            path: "./components/about/about-gemwon"
        },
        {
            // displayName: "卓旺条款",
            icon: "fa fa-text-width",
            type: "ServiceAgreement",
            path: "./components/about/service-agreement",
            editor: "./editors/about/about-editor",
            layout: '../generic/component-editor-renders/about'

        },
        {
            // displayName: "业务",
            icon: "fa fa-text-width",
            type: "Business",
            path: "./components/about/business"
        },
        {
            // displayName: "联系方式",
            icon: "fa fa-text-width",
            type: "Telephone",
            path: "./components/about/telephone",
            editor: "./editors/about/about-editor",
            layout: '../generic/component-editor-renders/about'
        },
        {
            // displayName: "留言",
            icon: "fa fa-text-width",
            type: "Leaving",
            path: "./components/about/leaving"
        },
        {
            // displayName: "付款方式",
            icon: "fa fa-text-width",
            type: "Pay",
            path: "./components/about/pay",
            editor: "./editors/about/about-editor",
            layout: '../generic/component-editor-renders/about'
        },
        {
            // displayName: "付款方法",
            icon: "fa fa-text-width",
            type: "Method",
            path: "./components/about/method",
            editor: "./editors/about/about-editor",
            layout: '../generic/component-editor-renders/about'
        },
        {
            // displayName: "条款和条件",
            icon: "fa fa-text-width",
            type: "Terms",
            path: "./components/about/terms",
            editor: "./editors/about/about-editor",
            layout: '../generic/component-editor-renders/about'
        },
        {
            // displayName: "退款政策",
            icon: "fa fa-text-width",
            type: "Refunds",
            path: "./components/about/refunds",
            editor: "./editors/about/about-editor",
            layout: '../generic/component-editor-renders/about'
        },
        {
            // displayName: "交互政策",
            icon: "fa fa-text-width",
            type: "ShippingDeliveryPolicy",
            path: "./components/about/shipping-delivery-policy",
            editor: "./editors/about/about-editor",
            layout: '../generic/component-editor-renders/about'
        },
        {
            // displayName: "隐私政策",
            icon: "fa fa-text-width",
            type: "PrivacyPolicy",
            path: "./components/about/privacy-policy",
            editor: "./editors/about/about-editor",
            layout: '../generic/component-editor-renders/about'
        },
        {
            // displayName: "运输说明",
            icon: "fa fa-text-width",
            type: "ShippingInstructions",
            path: "./components/about/shipping-instructions",
            editor: "./editors/about/about-editor",
            layout: '../generic/component-editor-renders/about'
        },
        {
            // displayName: "关键词",
            icon: "fa fa-text-width",
            type: "PopularKeywords",
            path: "./components/product/popular-keywords"
        },
        {
            //displayName: "支付",
            icon: "fa fa-text-width",
            type: "PaymentView",
            path: "./components/cart/payment-view",
        },
        {
            //displayName: "购物",
            icon: "fa fa-text-width",
            type: "ShippingView",
            path: "./components/cart/shipping-view",
        },
        {
            // displayName: "404",
            icon: "fa fa-text-width",
            type: "ErropPage",
            path: "./components/error-page"
        },
        {
            //displayName: "上新",
            icon: "fa fa-text-width",
            type: "NewArrivals",
            path: "./components/product/product-new-arrivals"
        },
        {
            displayName: "关键词",
            icon: "fa fa-text-width",
            type: "PopularKeywords",
            path: "./components/product/popular-keywords"
        }
    ],
    requirejs: {
        baseUrl: "/",
        paths: {
            "maishu-dilu-react": "/node_modules/maishu-dilu-react/dist/index.min",
            "js-cookie": "/node_modules/js-cookie/src/js.cookie",
            "maishu-image-components": "/node_modules/maishu-image-components/dist/index.min",
            "maishu-image-components/out": "/node_modules/maishu-image-components/out",
            "maishu-ui-toolkit/out": "/node_modules/maishu-ui-toolkit/out",
            "maishu-toolkit/out": "/node_modules/maishu-toolkit/out",
            "video-react": "/node_modules/video-react/dist/video-react.min",
            "video-react/dist": "/node_modules/video-react/dist",
            "redux": "/node_modules/redux/dist/redux.min"
        }
    },
    // mode: "development"
}

export default w;