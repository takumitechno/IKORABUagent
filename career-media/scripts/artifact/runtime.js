// アーティファクト版の画面遷移・検索・メニュー・相談ボタンのデモ表示。
// 各ページの HTML は <template data-route="..."> に入っており、ここで1枚のページの中で切り替える。
(function () {
  "use strict";
  var cfg = window.__ARTIFACT__;
  var app = document.getElementById("app");
  var templates = {};
  document.querySelectorAll("template[data-route]").forEach(function (t) {
    templates[t.getAttribute("data-route")] = t;
  });
  var cache = {};
  var current = null;
  var currentRoute = null;

  // ルート <-> URL の hash（アーティファクトのリンクで使える文字だけにする）
  function routeToHash(route) {
    return route === "/" ? "#top" : "#" + route.replace(/^\//, "").replace(/\//g, "~");
  }
  function hashToRoute(hash) {
    var token = (hash || "").replace(/^#/, "");
    if (!token || token === "top") return "/";
    if (!/^[A-Za-z0-9._~-]+$/.test(token)) return null;
    var route = "/" + token.replace(/~/g, "/");
    return templates[route] ? route : null;
  }

  function mountView(route) {
    if (cache[route]) return cache[route];
    var tpl = templates[route] || templates["/404"];
    var node = document.createElement("div");
    node.appendChild(tpl.content.cloneNode(true));
    cache[route] = node;
    if (route === "/check") {
      var root = node.querySelector("#condition-check-root");
      if (root && window.__mountConditionCheck) {
        try {
          window.__mountConditionCheck(root, cfg.checkConsultHref, cfg.checkConsultLabel);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return node;
  }

  function show(node, title) {
    if (current && current !== node && current.parentNode) current.parentNode.removeChild(current);
    if (node.parentNode !== app) app.appendChild(node);
    current = node;
    if (title) document.title = title;
    closeMenu();
    updateSticky();
  }

  function render(route, anchor) {
    var tpl = templates[route] ? route : "/404";
    currentRoute = tpl;
    show(mountView(tpl), templates[tpl].getAttribute("data-title"));
    scrollToAnchor(anchor);
  }

  function scrollToAnchor(anchor) {
    if (anchor && current) {
      var el = current.querySelector("#" + CSS.escape(anchor));
      if (el) {
        setTimeout(function () {
          el.scrollIntoView({ block: "start" });
        }, 0);
        return;
      }
    }
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------------- 検索
  function norm(s) {
    return (s || "").normalize("NFKC").toLowerCase();
  }
  function score(item, query) {
    var terms = norm(query).split(/[\s　]+/).filter(Boolean);
    if (!terms.length) return 0;
    var total = 0;
    for (var i = 0; i < terms.length; i++) {
      var t = terms[i];
      var s = 0;
      if (norm(item.title).indexOf(t) >= 0) s += 10;
      if (norm(item.summary).indexOf(t) >= 0) s += 4;
      if (norm(item.text).indexOf(t) >= 0) s += 1;
      if (!s) return 0;
      total += s;
    }
    return total;
  }
  function renderSearch(query) {
    var q = query.trim().slice(0, 100);
    var node = document.createElement("div");
    node.appendChild(templates["/articles"].content.cloneNode(true));
    var hits = cfg.searchIndex
      .map(function (item) {
        return { item: item, s: score(item, q) };
      })
      .filter(function (x) {
        return x.s > 0;
      })
      .sort(function (a, b) {
        return b.s - a.s;
      });
    var h1 = node.querySelector("h1");
    if (h1) {
      h1.textContent = "「" + q + "」の検索結果";
      var count = h1.nextElementSibling;
      if (count) count.textContent = hits.length + "件の記事が見つかりました。";
    }
    var input = node.querySelector('input[name="q"]');
    if (input) input.value = q;
    var list = node.querySelector("ul.divide-y");
    if (list) {
      if (hits.length) {
        list.innerHTML = hits
          .map(function (x) {
            return x.item.rowHtml;
          })
          .join("");
      } else {
        var box = list.parentNode;
        box.innerHTML =
          '<div class="py-12 text-center"><p class="font-bold text-ink">該当する記事が見つかりませんでした</p><p class="mt-2 text-sm text-muted">別のキーワードで探すか、テーマから記事を選んでください。</p><a href="/articles" class="mt-4 inline-block text-sm font-bold text-brand-strong underline">すべての記事を見る</a></div>';
      }
    }
    currentRoute = "/articles";
    show(node, "「" + q + "」の検索結果｜" + cfg.siteName);
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------------- 遷移と履歴
  // アーティファクトは iframe の中で動くため、ブラウザの「戻る」がページ内の移動に使えないことがある。
  // そこでページ内に履歴（どの画面を・どこまでスクロールして見ていたか）を持ち、「戻る」ボタンで1つ前に戻す。
  // history.pushState が使える環境では、ブラウザの「戻る」も同じ履歴で動く。
  var stack = [];
  var entry = null; // { route, anchor } または { search }
  var pushed = 0; // pushState できた回数（まだ戻っていない分）

  function draw(e, scroll) {
    if (e.search !== undefined) renderSearch(e.search);
    else render(e.route, scroll === undefined ? e.anchor : "");
    if (scroll !== undefined) {
      setTimeout(function () {
        window.scrollTo(0, scroll);
      }, 0);
    }
  }
  function sameEntry(a, b) {
    return !!a && !!b && a.route === b.route && a.search === b.search && (a.anchor || "") === (b.anchor || "");
  }
  function go(next) {
    if (sameEntry(entry, next)) return draw(next);
    if (entry) stack.push({ entry: entry, scroll: window.scrollY });
    entry = next;
    try {
      history.pushState({ artifactDepth: stack.length }, "", next.search !== undefined ? "#articles" : routeToHash(next.route));
      pushed++;
    } catch (err) {}
    draw(next);
  }
  function restorePrevious() {
    var prev = stack.pop();
    if (!prev) return false;
    entry = prev.entry;
    draw(prev.entry, prev.scroll);
    return true;
  }
  function goBack(fallbackHref) {
    if (!stack.length) return navigate(fallbackHref || "/");
    if (pushed > 0) {
      history.back(); // popstate で restorePrevious する
      return;
    }
    restorePrevious();
  }
  window.addEventListener("popstate", function () {
    if (pushed > 0 && stack.length) {
      pushed--;
      restorePrevious();
      return;
    }
    var route = hashToRoute(location.hash);
    if (route) {
      entry = { route: route, anchor: "" };
      render(route, "");
    }
  });

  function navigate(href) {
    var url = new URL(href, "https://local.invalid");
    var route = url.pathname.replace(/\/$/, "") || "/";
    var q = url.searchParams.get("q");
    if (route === "/articles" && q && q.trim()) return go({ search: q.trim().slice(0, 100) });
    var anchor = url.hash ? decodeURIComponent(url.hash.slice(1)) : "";
    go({ route: templates[route] ? route : "/404", anchor: anchor });
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var href = a.getAttribute("href");
    if (a.hasAttribute("data-back")) {
      e.preventDefault();
      goBack(href);
      return;
    }
    if (href.indexOf(cfg.consultPrefix) === 0) {
      e.preventDefault();
      openConsultDialog(href);
      return;
    }
    if (href.charAt(0) === "#") {
      e.preventDefault();
      scrollToAnchor(decodeURIComponent(href.slice(1)));
      return;
    }
    if (href.charAt(0) === "/") {
      e.preventDefault();
      navigate(href);
    }
  });

  document.addEventListener("submit", function (e) {
    var form = e.target;
    if (form.getAttribute("action") === "/articles") {
      e.preventDefault();
      var input = form.querySelector('input[name="q"]');
      var q = input ? input.value.trim().slice(0, 100) : "";
      if (q) go({ search: q });
      else navigate("/articles");
    }
  });

  // ---------------------------------------------------------------- スマホメニュー
  var menu = document.getElementById("mobile-menu");
  var menuButton = document.querySelector('[aria-controls="mobile-menu"]');
  function closeMenu() {
    if (menu) menu.hidden = true;
    if (menuButton) menuButton.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("menu-open");
  }
  if (menuButton && menu) {
    menuButton.addEventListener("click", function () {
      var open = menu.hidden;
      menu.hidden = !open;
      menuButton.setAttribute("aria-expanded", String(open));
      document.documentElement.classList.toggle("menu-open", open);
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeMenu();
      closeConsultDialog();
    }
  });

  // ---------------------------------------------------------------- 記事のスマホ追従 CTA
  function updateSticky() {
    if (!current) return;
    var bar = current.querySelector(".fixed.inset-x-0.bottom-0");
    if (!bar) return;
    var visible = window.scrollY > 700;
    bar.classList.toggle("translate-y-0", visible);
    bar.classList.toggle("translate-y-full", !visible);
  }
  window.addEventListener("scroll", updateSticky, { passive: true });

  // ---------------------------------------------------------------- 相談ボタン（デモ）
  var dialog = document.getElementById("consult-dialog");
  function openConsultDialog(href) {
    var content = "";
    try {
      var u = new URL(href, location.href);
      content = u.searchParams.get("placement") || u.searchParams.get("utm_content") || "";
    } catch (e) {}
    var place = dialog.querySelector("[data-placement]");
    place.textContent = content || "—";
    dialog.hidden = false;
    dialog.querySelector("button").focus();
  }
  function closeConsultDialog() {
    if (dialog) dialog.hidden = true;
  }
  dialog.addEventListener("click", function (e) {
    if (e.target === dialog || e.target.closest("[data-close]")) closeConsultDialog();
    if (e.target.closest("a[href]")) closeConsultDialog();
  });

  // ---------------------------------------------------------------- 初期表示
  var initial = hashToRoute(location.hash) || "/";
  entry = { route: initial, anchor: "" };
  render(initial, "");
})();
