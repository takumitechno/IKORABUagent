import { describe, expect, it } from "vitest";
import { checkConsultationTopic, withConsultationTopic } from "@/lib/consultation-topics";

describe("check consultation context", () => {
  it.each(["income", "holidays"])("keeps the explicit %s priority, including people without work experience", (priority) => {
    expect(checkConsultationTopic({ priority: [priority], experiences: ["sales_service"] })).toBe("conditions");
    expect(checkConsultationTopic({ priority: [priority], experiences: ["none"] })).toBe("conditions");
  });
  it("offers preparation for a first job without classifying part-time workers as inexperienced", () => {
    expect(checkConsultationTopic({ priority: ["stability"], experiences: ["none"] })).toBe("first-job");
    expect(checkConsultationTopic({ status: ["parttime"], priority: ["growth"], experiences: ["sales_service"] })).toBe("experience");
    expect(checkConsultationTopic({})).toBe("experience");
  });
  it("preserves placement and replaces only a local demo topic", () => {
    expect(withConsultationTopic("/consultation/apply?placement=check-result#support-experience", "conditions")).toBe("/consultation/apply?placement=check-result#support-conditions");
    expect(withConsultationTopic("/consultation/apply", "first-job")).toBe("/consultation/apply#support-first-job");
  });
  it.each(["https://partner.example/apply?utm_content=check-result", "//partner.example/apply", "/consultation/apply-other", "/consultation"])("never changes approved external or other routes: %s", (href) => {
    expect(withConsultationTopic(href, "conditions")).toBe(href);
  });
});
