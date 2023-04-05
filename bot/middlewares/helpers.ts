import { SessionData } from "/types/mod.ts";

export function initial(): SessionData {
  return { currentCommand: null };
}
