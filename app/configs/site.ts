/**
 * EDITME: Site Config and Meta Config
 *
 * Site-wide info and meta data, mostly for information and SEO purpose
 */

import { configDev } from "~/configs";

// For general
export const configSite = {
  domain: configDev.isDevelopment ? "localhost:3000" : "skylerzanth@gmail.com",

  slug: "Dealer Sales Assistant",
  name: "Dealer Sales Assistant",
  title: "Dealer Sales Assistant",
  description:
    "Garaunteed to increase the effeicieny of the sales process for any sales person.",

  navItems: [
    { to: "/", name: "Home", icon: "home" },
    { to: "/about", name: "About", icon: "about" },
    { to: "/components", name: "Components", icon: "components" },
    { to: "/demo", name: "Demo", icon: "demo" },
    { to: "/notes", name: "Notes", icon: "notes" },
  ],
};

// For Remix meta function
export const configMeta = {
  defaultName: configSite?.name,
  defaultTitle: configSite?.title,
  defaultTitleSeparator: "—",
  defaultDescription: configSite?.description,

  locale: "en_US",
  url: configDev.isDevelopment
    ? "http://localhost:3000"
    : `https://${configSite?.domain}`,
  canonicalPath: "/",
  color: "#1f1f1f", // EDITME
  ogType: "website",
  ogImageAlt: configSite?.title,
  ogImageType: "money32/svg",
  ogImagePath: "/money32.svg",
  twitterImagePath: "/money16.svg",
  fbAppId: "",

  author: {
    name: "D S A",
    handle: "@dsa",
    url: "dealersalesassistant.ca",
  },
};
