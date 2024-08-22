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
  assetsBuildDirectory: "./public/build",
  publicPath: "/build/",
  serverModuleFormat: "cjs",
  serverDependenciesToBundle: [
    "axios",
    "@azure/msal-react",
    "Path2D",
    "chalk"
  ],
  tailwind: true,
  routes(defineRoutes) {
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
/** browserNodeBuiltinsPolyfill: {
    modules: {
      _stream_duplex: true,
      _stream_passthrough: true,
      _stream_readable: true,
      _stream_transform: true,
      _stream_writable: true,
      assert: true,
      "assert/strict": true,
      buffer: true,
      console: true,
      constants: true,
      crypto: "empty",
      diagnostics_channel: true,
      domain: true,
      events: true,
      fs: "empty",
      "fs/promises": "empty",
      http: true,
      https: true,
      module: true,
      os: true,
      path: true,
      "path/posix": true,
      "path/win32": true,
      perf_hooks: true,
      process: true,
      punycode: true,
      querystring: true,
      stream: true,
      "stream/promises": true,
      "stream/web": true,
      string_decoder: true,
      sys: true,
      timers: true,
      "timers/promises": true,
      tty: true,
      url: true,
      util: true,
      "util/types": true,
      vm: true,
      wasi: true,
      worker_threads: true,
      zlib: true,
      Path2D: true,
    },
    globals: {
      Buffer: true,
    },
  }, */
