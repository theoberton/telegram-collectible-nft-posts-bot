import { SessionData } from "/src/types/mod.ts";

export function initialSession(): SessionData {
  return { userId: null, editionDraft: {}, page: 1 };
}
