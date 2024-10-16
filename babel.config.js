module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // reanimated 사용하려면 추가하라는듯?
    plugins: ["react-native-reanimated/plugin"],
  };
};
