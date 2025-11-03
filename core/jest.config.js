/** @returns {Promise<import('jest').Config>} */
module.exports = async () => {
  return {
    transformIgnorePatterns: ["/node_modules/(?!(@solid-data-modules|mime)/)"],
  };
};
