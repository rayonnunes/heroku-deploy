module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 690:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(389);
const { promisify } = __nccwpck_require__(669);

const exec = promisify(__nccwpck_require__(129).exec);

async function loginHeroku() {
  const login = core.getInput('email');
  const password = core.getInput('api_key');

  try {	
    await exec(`echo ${password} | docker login --username=${login} registry.heroku.com --password-stdin`);	
    console.log('Logged in succefully ✅');	
  } catch (error) {	
    core.setFailed(`Authentication process faild. Error: ${error.message}`);	
  }	
}

async function buildPushAndDeploy() {
  const appName = core.getInput('app_name');
  const dockerFilePath = core.getInput('dockerfile_path');
  const buildOptions = core.getInput('options') || '';
  const herokuAction = herokuActionSetUp(appName);
  const formation = core.getInput('formation');
  
  try {
    await exec(`docker build --file Dockerfile ${buildOptions} --tag registry.heroku.com/${appName}/${formation} ./${dockerFilePath}`);
    console.log('Image built 🛠');

    await exec(herokuAction('push'));
    console.log('Container pushed to Heroku Container Registry ⏫');

    await exec(herokuAction('release'));
    console.log('App Deployed successfully 🚀');
  } catch (error) {
    core.setFailed(`Something went wrong building your image. Error: ${error.message}`);
  } 
}

/**
 * 
 * @param {string} appName - Heroku App Name
 * @returns {function}
 */
function herokuActionSetUp(appName) {
  /**
   * @typedef {'push' | 'release'} Actions
   * @param {Actions} action - Action to be performed
   * @returns {string}
   */
  return function herokuAction(action) {
    const HEROKU_API_KEY = core.getInput('api_key');
    const exportKey = `HEROKU_API_KEY=${HEROKU_API_KEY}`;
  
    return `${exportKey} heroku container:${action} web --app ${appName}` 
  }
}

loginHeroku()
  .then(() => buildPushAndDeploy())
  .catch((error) => {
    console.log({ message: error.message });
    core.setFailed(error.message);
  })


/***/ }),

/***/ 389:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 129:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");;

/***/ }),

/***/ 669:
/***/ ((module) => {

"use strict";
module.exports = require("util");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__nccwpck_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __nccwpck_require__(690);
/******/ })()
;