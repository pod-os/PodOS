import config from "./playwright-base.config";

// assumes a running instance of PodOS elements dev server
config.use.baseURL = "http://localhost:3333";

config.webServer = [
  {
    command: "npm run start:solid-server",
    port: 4000,
  },
];
export default config;
