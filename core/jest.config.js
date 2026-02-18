/** @returns {Promise<import('jest').Config>} */
export default async () => {
  return {
    transformIgnorePatterns: [
      "/node_modules/(?!(@solid-data-modules|mime|url-template)/)",
    ],
  };
};
