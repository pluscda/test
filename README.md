# Aotter Player SDK

Aotter Player SDK is the bare-bones Express and Webpack boilerplate with ES6+ babel transpilation, ESLint linting, Hot Module Reloading, and Jest test framework enabled.

Aotter Player SDK has two build modes: Development and Production.

When you run `npm run buildDev`, Javascript, HTML, and CSS files are unminified and not uglified, meaning that you can easily inspect them in Chrome Dev Tools. Hot Module Reloading is enabled via `webpack-dev-middleware` and `webpack-hot-middleware`. 

When you run `npm run buildProd`, Javascript, HTML, and CSS files are all minified and uglified, and images are encoded as Base64 directly into your CSS file, which results in less calls to the server for image files. 


## Installation & Usage

    git clone https://github.com/pluscda/test
    cd test
    npm install
    
    npm run buildDev  && npm start       // for development navigate to localhost:8080 for local dev
        // OR
    npm run buildProd && npm start     //  for testing with Vue example navigate to localhost:8080 for local example
