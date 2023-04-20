// @ts-check
const fs = require("fs");
const path = require("path");

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    domains: ["images.clerk.dev"]
  },

  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en"
  },

  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  swcMinify: true,
  webpack: (config) => {
    const fileLoaderRule = config.module.rules.find(
      (/** @type {{ test: { test: (arg0: string) => any; }; }} */ rule) => rule.test && rule.test.test(".svg")
    );
    fileLoaderRule.exclude = /\.inline\.svg$/;
    // config.module.rules.push({
    //   test: /\.inline\.svg$/,
    //   use: ['@svgr/webpack'],
    // });
    // Only inline svgs used to be manipulated before. Now we do all
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });
    return config;
  }
};

module.exports = () => {
  preStartFunction();
  return config;
};

function preStartFunction() {
  console.log("Generate Popup file");
  try {
    let fileText = fs
      .readFileSync(path.join(__dirname, "public", "js", "clickout.js"))
      .toString();

    fileText = fileText.replace(
      /const FRONTEND_URL = .+/g,
      "const FRONTEND_URL = '" + process.env.NEXT_PUBLIC_FRONTEND_URL + "';"
    );
    fileText = fileText.replace(
      /const BASE_URL = .+/g,
      "const BASE_URL = '" + process.env.NEXT_PUBLIC_BACKEND_URL + "/session';"
    );

    fs.writeFileSync(
      path.join(__dirname, "public", "js", "clickout_final.js"),
      fileText
    );
  } catch (err) {
    console.log("Error while modifying the file");
  }
}

