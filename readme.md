# About this project
ShaderLEGO:
Web-based shader programming node system.


## Environment
- Node.js v14.17.1
- Webpack 
- Three.js
- javascript-state-machine 3.1.0

## How to build

Install node.js follow [this](https://nodejs.dev/learn/how-to-install-nodejs) guide.
Install Webpack with command `npm install -g webpack`
Install Three.js with command `npm install --save three`
Install javascript-state-machin with command `npm install --save-dev javascript-state-machine`

Compile the code: `npx webpack --mode=development`
Run the server `node index.js`

## Code structure
- `index.js` Server javascript file
- `static/dist/` Compiled js file by webpack
- `static/js/lib` Libraries, Two.js does not provide a npm pack, so we direct download and put this in the project.
