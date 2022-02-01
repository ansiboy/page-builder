requirejs.config({
    paths: {
        "css": "/node_modules/maishu-requirejs-plugins/src/css",
        "react": "https://unpkg.com/react@17.0.2/umd/react.development",
        "react-dom": "https://unpkg.com/react-dom@17.0.2/umd/react-dom.development",
        "react-router-dom": "https://unpkg.com/react-router-dom@6.2.1/umd/react-router-dom.production.min",
        "react-router": "https://unpkg.com/react-router@6.2.1/umd/react-router.production.min",
        "history": "https://unpkg.com/history@5.2.0/umd/history.production.min"
    }
})

requirejs(["./index"])