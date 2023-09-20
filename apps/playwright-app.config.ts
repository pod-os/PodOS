import config from "./playwright-base.config";

config.use.baseURL = "http://localhost:3000";

config.webServer = [
  {
    command: "npm start",
    port: 3000,
  },
  {
    command: "npm run start:solid-server",
    port: 4000,
  },
];
export default config;
