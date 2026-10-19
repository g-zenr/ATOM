import { describe, expect, it } from "vitest";
import {
  durationSeconds,
  formatDuration,
  noteSchema,
  parseFormData,
  taskSchema,
  timeEntryClockInSchema,
} from ".";

describe("formatDuration", () => {
  it("formats minutes and seconds", () => {
    expect(formatDuration(0)).toBe("0:00");
    expect(formatDuration(125)).toBe("2:05");
  });

  it("formats hours when present", () => {
    expect(formatDuration(3661)).toBe("1:01:01");
    expect(formatDuration(8 * 3600)).toBe("8:00:00");
  });
});

describe("durationSeconds", () => {
  it("computes whole seconds between timestamps", () => {
    const start = new Date("2026-01-01T09:00:00.000Z");
    const end = new Date("2026-01-01T10:30:30.000Z");
    expect(durationSeconds(start, end)).toBe(5430);
  });

  it("never returns negative durations", () => {
    const now = new Date();
    expect(durationSeconds(now, now)).toBe(0);
  });
});

describe("noteSchema", () => {
  it("requires a non-blank title", () => {
    expect(noteSchema.safeParse({ title: "   " }).success).toBe(false);
  });

  it("defaults content and tags", () => {
    expect(noteSchema.parse({ title: "Hello" })).toEqual({
      title: "Hello",
      content: "",
      tags: [],
    });
  });
});

describe("taskSchema", () => {
  it("applies status and priority defaults", () => {
    const task = taskSchema.parse({ title: "Ship it" });
    expect(task.status).toBe("TODO");
    expect(task.priority).toBe("MEDIUM");
  });

  it("coerces ISO due dates", () => {
    const task = taskSchema.parse({
      title: "Ship it",
      dueDate: "2026-02-01T00:00:00.000Z",
    });
    expect(task.dueDate).toBeInstanceOf(Date);
  });

  it("rejects unknown statuses", () => {
    expect(taskSchema.safeParse({ title: "x", status: "LATER" }).success).toBe(
      false,
    );
  });
});

describe("timeEntryClockInSchema", () => {
  it("allows an empty payload", () => {
    expect(timeEntryClockInSchema.parse({}).note).toBeUndefined();
  });
});

describe("parseFormData", () => {
  it("parses and trims a FormData payload", () => {
    const formData = new FormData();
    formData.set("title", "  Hello  ");
    formData.set("content", "");

    const result = parseFormData(noteSchema, formData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ title: "Hello", content: "", tags: [] });
    }
  });

  it("returns a validation error for missing fields", () => {
    const result = parseFormData(noteSchema, new FormData());
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain("title");
    }
  });
});
