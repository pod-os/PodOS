import type { PlaywrightTestOptions, PlaywrightWorkerOptions } from "@playwright/test";
import type { PlaywrightTestConfig } from "@playwright/test";
import config from "./playwright-base.config";
import type { TestOptions } from "./tests/fixtures";

const appConfig: PlaywrightTestConfig<
  PlaywrightTestOptions & TestOptions,
  PlaywrightWorkerOptions & TestOptions
> = {
  ...config,
  use: {
    ...config.use,
    baseURL: "http://localhost:3000",
    includesServiceWorker: true,
  },
  webServer: [
    {
      command: "npm start",
      port: 3000,
    },
    {
      command: "npm run start:solid-server",
      port: 4000,
    },
  ],
};
export default appConfig;
