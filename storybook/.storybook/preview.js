import { html } from "lit-html";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (story) => html`
    <pos-app>
      <ion-app>
        <ion-content>
          <div style="padding: 1rem">${story()}</div>
        </ion-content>
      </ion-app>
    </pos-app>
  `,
];
