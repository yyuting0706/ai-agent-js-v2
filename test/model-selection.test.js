import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_MODEL,
  DEFAULT_MODEL_SETTINGS,
  DEFAULT_REASONING,
  FOUNDATION_MODEL,
  RAG_AGENT_MODEL,
} from "../lib/models.js";

test("課程在 3.3 切換成 gpt-5.4-mini low reasoning", () => {
  assert.equal(FOUNDATION_MODEL, "gpt-5.6-luna");
  assert.equal(RAG_AGENT_MODEL, "gpt-5.4-mini");
  assert.equal(DEFAULT_MODEL, "gpt-5.4-mini");
  assert.deepEqual(DEFAULT_REASONING, { effort: "low" });
  assert.deepEqual(DEFAULT_MODEL_SETTINGS, {
    reasoning: { effort: "low" },
  });
});
