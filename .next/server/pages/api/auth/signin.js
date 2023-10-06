"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/auth/signin";
exports.ids = ["pages/api/auth/signin"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ "cookies-next":
/*!*******************************!*\
  !*** external "cookies-next" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("cookies-next");

/***/ }),

/***/ "jose":
/*!***********************!*\
  !*** external "jose" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("jose");

/***/ }),

/***/ "validator":
/*!****************************!*\
  !*** external "validator" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("validator");

/***/ }),

/***/ "(api)/./pages/api/auth/signin.ts":
/*!**********************************!*\
  !*** ./pages/api/auth/signin.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var validator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! validator */ \"validator\");\n/* harmony import */ var validator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(validator__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! bcrypt */ \"bcrypt\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(bcrypt__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var jose__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! jose */ \"jose\");\n/* harmony import */ var jose__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(jose__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var cookies_next__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! cookies-next */ \"cookies-next\");\n/* harmony import */ var cookies_next__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(cookies_next__WEBPACK_IMPORTED_MODULE_4__);\n\n\n\n\n\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_1__.PrismaClient();\nasync function handler(req, res) {\n    if (req.method === \"POST\") {\n        const errors = [];\n        const { email , password  } = req.body;\n        const validationSchema = [\n            {\n                valid: validator__WEBPACK_IMPORTED_MODULE_0___default().isEmail(email),\n                errorMessage: \"Email is invalid.\"\n            },\n            {\n                valid: validator__WEBPACK_IMPORTED_MODULE_0___default().isLength(password, {\n                    min: 1\n                }),\n                errorMessage: \"Password is invalid.\"\n            }\n        ];\n        validationSchema.forEach((item)=>{\n            if (!item.valid) {\n                errors.push(item.errorMessage);\n            }\n        });\n        if (errors.length) {\n            return res.status(400).json({\n                errorMessage: errors[0]\n            });\n        }\n        const user = await prisma.user.findUnique({\n            where: {\n                email\n            }\n        });\n        if (!user) {\n            return res.status(401).json({\n                errorMessage: \"Email or password is invalid.\"\n            });\n        }\n        const isMatch = await bcrypt__WEBPACK_IMPORTED_MODULE_2___default().compare(password, user.password);\n        if (!isMatch) {\n            return res.status(401).json({\n                errorMessage: \"Email or password is invalid.\"\n            });\n        }\n        const alg = \"HS256\";\n        const secret = new TextEncoder().encode(process.env.JWT_SECRET);\n        const token = await new jose__WEBPACK_IMPORTED_MODULE_3__.SignJWT({\n            email: user.email\n        }).setProtectedHeader({\n            alg\n        }).setExpirationTime(\"24h\").sign(secret);\n        (0,cookies_next__WEBPACK_IMPORTED_MODULE_4__.setCookie)(\"jwt\", token, {\n            req,\n            res,\n            maxAge: 60 * 6 * 24\n        });\n        return res.status(200).json({\n            firstName: user.first_name,\n            lastName: user.last_name,\n            email: user.email,\n            phone: user.phone,\n            city: user.city\n        });\n    }\n    return res.status(404).json({\n        errorMessage: \"Unknown Endpoint\"\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvYXV0aC9zaWduaW4udHMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFDa0M7QUFDWTtBQUNsQjtBQUNDO0FBQ1k7QUFFekMsTUFBTUssU0FBUyxJQUFJSix3REFBWUE7QUFFaEIsZUFBZUssUUFDNUJDLEdBQW1CLEVBQ25CQyxHQUFvQixFQUNwQjtJQUNBLElBQUlELElBQUlFLE1BQU0sS0FBSyxRQUFRO1FBQ3pCLE1BQU1DLFNBQW1CLEVBQUU7UUFDM0IsTUFBTSxFQUFFQyxNQUFLLEVBQUVDLFNBQVEsRUFBRSxHQUFHTCxJQUFJTSxJQUFJO1FBQ3BDLE1BQU1DLG1CQUFtQjtZQUN2QjtnQkFDRUMsT0FBT2Ysd0RBQWlCLENBQUNXO2dCQUN6Qk0sY0FBYztZQUNoQjtZQUNBO2dCQUNFRixPQUFPZix5REFBa0IsQ0FBQ1ksVUFBVTtvQkFBRU8sS0FBSztnQkFBRTtnQkFDN0NGLGNBQWM7WUFDaEI7U0FDRDtRQUNESCxpQkFBaUJNLE9BQU8sQ0FBQyxDQUFDQyxPQUFTO1lBQ2pDLElBQUksQ0FBQ0EsS0FBS04sS0FBSyxFQUFFO2dCQUNmTCxPQUFPWSxJQUFJLENBQUNELEtBQUtKLFlBQVk7WUFDL0IsQ0FBQztRQUNIO1FBQ0EsSUFBSVAsT0FBT2EsTUFBTSxFQUFFO1lBQ2pCLE9BQU9mLElBQUlnQixNQUFNLENBQUMsS0FBS0MsSUFBSSxDQUFDO2dCQUFFUixjQUFjUCxNQUFNLENBQUMsRUFBRTtZQUFDO1FBQ3hELENBQUM7UUFFRCxNQUFNZ0IsT0FBTyxNQUFNckIsT0FBT3FCLElBQUksQ0FBQ0MsVUFBVSxDQUFDO1lBQ3hDQyxPQUFPO2dCQUNMakI7WUFDRjtRQUNGO1FBQ0EsSUFBSSxDQUFDZSxNQUFNO1lBQ1QsT0FBT2xCLElBQ0pnQixNQUFNLENBQUMsS0FDUEMsSUFBSSxDQUFDO2dCQUFFUixjQUFjO1lBQWdDO1FBQzFELENBQUM7UUFDRCxNQUFNWSxVQUFVLE1BQU0zQixxREFBYyxDQUFDVSxVQUFVYyxLQUFLZCxRQUFRO1FBQzVELElBQUksQ0FBQ2lCLFNBQVM7WUFDWixPQUFPckIsSUFDSmdCLE1BQU0sQ0FBQyxLQUNQQyxJQUFJLENBQUM7Z0JBQUVSLGNBQWM7WUFBZ0M7UUFDMUQsQ0FBQztRQUNELE1BQU1jLE1BQU07UUFDWixNQUFNQyxTQUFTLElBQUlDLGNBQWNDLE1BQU0sQ0FBQ0MsUUFBUUMsR0FBRyxDQUFDQyxVQUFVO1FBQzlELE1BQU1DLFFBQVEsTUFBTSxJQUFJbkMseUNBQVksQ0FBQztZQUNuQ1EsT0FBT2UsS0FBS2YsS0FBSztRQUNuQixHQUNHNkIsa0JBQWtCLENBQUM7WUFBRVQ7UUFBSSxHQUN6QlUsaUJBQWlCLENBQUMsT0FDbEJDLElBQUksQ0FBQ1Y7UUFFUjVCLHVEQUFTQSxDQUFDLE9BQU9rQyxPQUFPO1lBQUUvQjtZQUFLQztZQUFLbUMsUUFBUSxLQUFLLElBQUk7UUFBRztRQUV4RCxPQUFPbkMsSUFBSWdCLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUM7WUFDMUJtQixXQUFXbEIsS0FBS21CLFVBQVU7WUFDMUJDLFVBQVVwQixLQUFLcUIsU0FBUztZQUN4QnBDLE9BQU9lLEtBQUtmLEtBQUs7WUFDakJxQyxPQUFPdEIsS0FBS3NCLEtBQUs7WUFDakJDLE1BQU12QixLQUFLdUIsSUFBSTtRQUNqQjtJQUNGLENBQUM7SUFDRCxPQUFPekMsSUFBSWdCLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUM7UUFBRVIsY0FBYztJQUFtQjtBQUNqRSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vb3BlbnRhYmxlbmV4dGpzLy4vcGFnZXMvYXBpL2F1dGgvc2lnbmluLnRzP2M0ZDAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dEFwaVJlcXVlc3QsIE5leHRBcGlSZXNwb25zZSB9IGZyb20gJ25leHQnO1xuaW1wb3J0IHZhbGlkYXRvciBmcm9tICd2YWxpZGF0b3InO1xuaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSAnQHByaXNtYS9jbGllbnQnO1xuaW1wb3J0IGJjcnlwdCBmcm9tICdiY3J5cHQnO1xuaW1wb3J0ICogYXMgam9zZSBmcm9tICdqb3NlJztcbmltcG9ydCB7IHNldENvb2tpZSB9IGZyb20gJ2Nvb2tpZXMtbmV4dCc7XG5cbmNvbnN0IHByaXNtYSA9IG5ldyBQcmlzbWFDbGllbnQoKTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihcbiAgcmVxOiBOZXh0QXBpUmVxdWVzdCxcbiAgcmVzOiBOZXh0QXBpUmVzcG9uc2Vcbikge1xuICBpZiAocmVxLm1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgY29uc3QgZXJyb3JzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGNvbnN0IHsgZW1haWwsIHBhc3N3b3JkIH0gPSByZXEuYm9keTtcbiAgICBjb25zdCB2YWxpZGF0aW9uU2NoZW1hID0gW1xuICAgICAge1xuICAgICAgICB2YWxpZDogdmFsaWRhdG9yLmlzRW1haWwoZW1haWwpLFxuICAgICAgICBlcnJvck1lc3NhZ2U6ICdFbWFpbCBpcyBpbnZhbGlkLicsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWxpZDogdmFsaWRhdG9yLmlzTGVuZ3RoKHBhc3N3b3JkLCB7IG1pbjogMSB9KSxcbiAgICAgICAgZXJyb3JNZXNzYWdlOiAnUGFzc3dvcmQgaXMgaW52YWxpZC4nLFxuICAgICAgfSxcbiAgICBdO1xuICAgIHZhbGlkYXRpb25TY2hlbWEuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgaWYgKCFpdGVtLnZhbGlkKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGl0ZW0uZXJyb3JNZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoZXJyb3JzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgZXJyb3JNZXNzYWdlOiBlcnJvcnNbMF0gfSk7XG4gICAgfVxuXG4gICAgY29uc3QgdXNlciA9IGF3YWl0IHByaXNtYS51c2VyLmZpbmRVbmlxdWUoe1xuICAgICAgd2hlcmU6IHtcbiAgICAgICAgZW1haWwsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGlmICghdXNlcikge1xuICAgICAgcmV0dXJuIHJlc1xuICAgICAgICAuc3RhdHVzKDQwMSlcbiAgICAgICAgLmpzb24oeyBlcnJvck1lc3NhZ2U6ICdFbWFpbCBvciBwYXNzd29yZCBpcyBpbnZhbGlkLicgfSk7XG4gICAgfVxuICAgIGNvbnN0IGlzTWF0Y2ggPSBhd2FpdCBiY3J5cHQuY29tcGFyZShwYXNzd29yZCwgdXNlci5wYXNzd29yZCk7XG4gICAgaWYgKCFpc01hdGNoKSB7XG4gICAgICByZXR1cm4gcmVzXG4gICAgICAgIC5zdGF0dXMoNDAxKVxuICAgICAgICAuanNvbih7IGVycm9yTWVzc2FnZTogJ0VtYWlsIG9yIHBhc3N3b3JkIGlzIGludmFsaWQuJyB9KTtcbiAgICB9XG4gICAgY29uc3QgYWxnID0gJ0hTMjU2JztcbiAgICBjb25zdCBzZWNyZXQgPSBuZXcgVGV4dEVuY29kZXIoKS5lbmNvZGUocHJvY2Vzcy5lbnYuSldUX1NFQ1JFVCk7XG4gICAgY29uc3QgdG9rZW4gPSBhd2FpdCBuZXcgam9zZS5TaWduSldUKHtcbiAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgIH0pXG4gICAgICAuc2V0UHJvdGVjdGVkSGVhZGVyKHsgYWxnIH0pXG4gICAgICAuc2V0RXhwaXJhdGlvblRpbWUoJzI0aCcpXG4gICAgICAuc2lnbihzZWNyZXQpO1xuXG4gICAgc2V0Q29va2llKCdqd3QnLCB0b2tlbiwgeyByZXEsIHJlcywgbWF4QWdlOiA2MCAqIDYgKiAyNCB9KTtcblxuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICBmaXJzdE5hbWU6IHVzZXIuZmlyc3RfbmFtZSxcbiAgICAgIGxhc3ROYW1lOiB1c2VyLmxhc3RfbmFtZSxcbiAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgcGhvbmU6IHVzZXIucGhvbmUsXG4gICAgICBjaXR5OiB1c2VyLmNpdHksXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgZXJyb3JNZXNzYWdlOiAnVW5rbm93biBFbmRwb2ludCcgfSk7XG59XG4iXSwibmFtZXMiOlsidmFsaWRhdG9yIiwiUHJpc21hQ2xpZW50IiwiYmNyeXB0Iiwiam9zZSIsInNldENvb2tpZSIsInByaXNtYSIsImhhbmRsZXIiLCJyZXEiLCJyZXMiLCJtZXRob2QiLCJlcnJvcnMiLCJlbWFpbCIsInBhc3N3b3JkIiwiYm9keSIsInZhbGlkYXRpb25TY2hlbWEiLCJ2YWxpZCIsImlzRW1haWwiLCJlcnJvck1lc3NhZ2UiLCJpc0xlbmd0aCIsIm1pbiIsImZvckVhY2giLCJpdGVtIiwicHVzaCIsImxlbmd0aCIsInN0YXR1cyIsImpzb24iLCJ1c2VyIiwiZmluZFVuaXF1ZSIsIndoZXJlIiwiaXNNYXRjaCIsImNvbXBhcmUiLCJhbGciLCJzZWNyZXQiLCJUZXh0RW5jb2RlciIsImVuY29kZSIsInByb2Nlc3MiLCJlbnYiLCJKV1RfU0VDUkVUIiwidG9rZW4iLCJTaWduSldUIiwic2V0UHJvdGVjdGVkSGVhZGVyIiwic2V0RXhwaXJhdGlvblRpbWUiLCJzaWduIiwibWF4QWdlIiwiZmlyc3ROYW1lIiwiZmlyc3RfbmFtZSIsImxhc3ROYW1lIiwibGFzdF9uYW1lIiwicGhvbmUiLCJjaXR5Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./pages/api/auth/signin.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/auth/signin.ts"));
module.exports = __webpack_exports__;

})();