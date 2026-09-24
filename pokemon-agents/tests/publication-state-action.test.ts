import { describe, expect, test } from "bun:test";
import { SYSTEM_ACTIVITY_ACTION_CODES, createInternalActivity } from "../web/lib/agent-role-registry";
import { THREADS_PROJECTABLE_AUDIT_EVENT_TYPES, mapBridgeAuditEvent } from "../web/lib/threads-activity-consumer";
import { normalizeThreadsActivityEvent } from "../web/lib/threads-activity-projector";

describe("Threads projectable system actions", () => {
  test("accepts all 14 current Bridge event types including publication_state", () => {
    expect(THREADS_PROJECTABLE_AUDIT_EVENT_TYPES).toHaveLength(14);
    for (const [index, eventType] of THREADS_PROJECTABLE_AUDIT_EVENT_TYPES.entries()) {
      expect(SYSTEM_ACTIVITY_ACTION_CODES).toContain(eventType);
      const event = mapBridgeAuditEvent("acct_fixture", {
        event_id: `event-${index}`, event_type: eventType, entity_id: `item-${index}`,
        entity_version: 1, created_at: "2026-09-24T03:00:00Z", detail: {},
      });
      expect(() => createInternalActivity(normalizeThreadsActivityEvent(event))).not.toThrow();
      if (eventType === "publication_state") {
        const activity = normalizeThreadsActivityEvent(event);
        expect(activity).toMatchObject({ action: "publication_state", agent_id: null, agent_role: "editorial_runner" });
      }
    }
  });

  test("keeps unknown Bridge events fail-closed", () => {
    expect(() => mapBridgeAuditEvent("acct_fixture", {
      event_id: "event-unknown", event_type: "unknown_event", entity_id: null,
      entity_version: null, created_at: "2026-09-24T03:00:00Z", detail: {},
    })).toThrow("UNSUPPORTED_EVENT_TYPE");
  });
});
