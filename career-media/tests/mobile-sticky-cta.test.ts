import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MobileStickyCta } from "@/components/MobileStickyCta";
import { ARTICLE_GUIDES } from "@/lib/article-guides";
import { buildConsultationUrl } from "@/lib/consultation";

const render = (props: Parameters<typeof MobileStickyCta>[0]) => renderToStaticMarkup(createElement(MobileStickyCta, props));
const decode = (html: string) => html.replace(/&amp;/g, "&");

describe("mobile sticky CTA on articles", () => {
  it.each(Object.entries(ARTICLE_GUIDES))("keeps the consultation topic of %s in the server-rendered href (works without JavaScript)", (slug, guide) => {
    const html = decode(render({ contentSlug: slug, consultHref: buildConsultationUrl("article-sticky", slug), consultLabel: "相談する", topic: guide.topic }));
    expect(html).toContain(`href="/consultation/apply?placement=article-sticky__${slug}#support-${guide.topic}"`);
    expect(html).toContain('data-cta-placement="article-sticky"');
  });

  it("matches the topic that the article-bottom CTA passes", () => {
    for (const [slug, guide] of Object.entries(ARTICLE_GUIDES)) {
      const sticky = decode(render({ contentSlug: slug, consultHref: buildConsultationUrl("article-sticky", slug), topic: guide.topic }));
      expect(sticky.match(/#support-([a-z-]+)"/)?.[1], slug).toBe(guide.topic);
    }
  });

  it("leaves the link without a topic when the article has none", () => {
    const html = decode(render({ contentSlug: "yukyu-tenshoku", consultHref: buildConsultationUrl("article-sticky", "yukyu-tenshoku") }));
    expect(html).toContain('href="/consultation/apply?placement=article-sticky__yukyu-tenshoku"');
    expect(html).not.toContain("#support-");
  });

  it("never rewrites an external (approved live) URL", () => {
    const external = "https://partner.example/apply?utm_content=article-sticky__x";
    expect(decode(render({ contentSlug: "x", consultHref: external, topic: "conditions" }))).toContain(`href="${external}"`);
  });
});
