const {
  createRoutesFromFolders,
} = require("@remix-run/v1-route-convention");
var term = require('terminal-kit').terminal;

// to determine if we're on the local development server
const isDevelopment = process.env.NODE_ENV === "development";

// to show environment condition

if (isDevelopment) {
  term.slowTyping('Wake up Neo...\n', { flashStyle: term.brightWhite }, function () {
    setTimeout(() => {
      term.clear();
      term.slowTyping('The matrix has you...\n', { flashStyle: term.brightWhite }, function () {
        setTimeout(() => {
          term.clear();
          term.slowTyping('Follow the white rabbit...\n', { flashStyle: term.brightWhite }, function () {
            setTimeout(() => {
              term.clear();
              term.slowTyping('Knock Knock!\n', { flashStyle: term.brightWhite }, function () {
                setTimeout(() => {
                  term.clear();
                }, 2000); // Adjust the delay as needed
              });
            }, 2000); // Adjust the delay as needed
          });
        }, 2000); // Adjust the delay as needed
      });
    }, 2000); // Adjust the delay as needed
  });
}

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  // When running locally in development mode, we use the built-in remix
  // server. This does not understand the vercel lambda module format,
  // so we default back to the standard build output.
  server: process.env.NODE_ENV === "development" ? undefined : "./server.ts",
  serverBuildPath: "api/index.js",
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  serverModuleFormat: "cjs",
  serverDependenciesToBundle: [
    "axios",
    "@azure/msal-react",
    // "Path2D",
    "chalk"
  ],
  tailwind: true,
  routes(defineRoutes) {
    // uses the v1 convention, works in v1.15+ and v2
    return createRoutesFromFolders(defineRoutes);
  },
  future: {
    v2_dev: true,
    v2_errorBoundary: true,
    v2_headers: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
};
exports.appDirectory = "./app";

/**
 *  routes(defineRoutes) {
   return defineRoutes((route) => {
     route("/", "_index.tsx", { index: true });
   });
 },
 */
