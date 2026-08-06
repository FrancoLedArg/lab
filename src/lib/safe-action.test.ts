import { describe, expect, it } from "vitest";

import { ActionError } from "@/lib/safe-action";

describe("ActionError", () => {
  it("carries a message for safe-action mapping", () => {
    const error = new ActionError("Active organization required");
    expect(error.message).toBe("Active organization required");
  });
});
