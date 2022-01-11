module.exports = {
  "extends": [
    'stylelint-config-standard',
    'stylelint-config-recess-order',
    'stylelint-config-prettier',
    "stylelint-config-standard-scss"
  ],
  plugins: ['stylelint-scss'],
  ignoreFiles: ['**/node_modules/**'],
  rules: {
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    // ↑ここまでは stylelint-scss の推奨ルール。
    // ↓あとはお好みの設定を記述しましょう。
  },
};