// next/link の代わりに普通の <a> を出す。画面遷移は runtime.js がクリックを拾って行う
const R = window.React;
function Link(props) {
  const { href, prefetch, replace, scroll, shallow, passHref, legacyBehavior, ...rest } = props;
  return R.createElement("a", Object.assign({ href: typeof href === "string" ? href : String(href) }, rest));
}
module.exports = { __esModule: true, default: Link };
