import coreConfigFactory from "./core/jest.config.js";
import elementsConfig from "./elements/jest.config.js";
import contactsConfig from "./contacts/jest.config.js";

/** @returns {Promise<import('jest').Config>} */
export default async () => {
  const coreConfig = await coreConfigFactory();

  return {
    projects: [
      {
        displayName: "core",
        rootDir: "./core",
        ...coreConfig,
      },
      {
        displayName: "elements",
        rootDir: "./elements",
        ...elementsConfig,
      },
      {
        displayName: "contacts",
        rootDir: "./contacts",
        ...contactsConfig,
      },
      {
        displayName: "service-worker",
        rootDir: "./service-worker",
      },
    ],
  };
};
