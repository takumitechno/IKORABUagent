// React 17+ の自動 JSX ランタイムを UMD の React.createElement で代替する
const R = window.React;
function jsx(type, props, key) {
  const p = Object.assign({}, props);
  if (key !== undefined) p.key = key;
  return R.createElement(type, p);
}
module.exports = { jsx, jsxs: jsx, jsxDEV: jsx, Fragment: R.Fragment };
