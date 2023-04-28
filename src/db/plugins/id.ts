import { uuidv4 } from "/src/utils/mod.ts";
import { Schema, Document,  } from "mongoose";

export function idPlugin(schema: Schema) {
  schema.add({ _id: "string" });

  schema.pre("save", function generateId(this: Document, next: (err?: Error) => void) {
    if (!this._id) {
      this._id = uuidv4();
    }

    next();
  });
  schema.pre("insertMany", (next: (err?: Error) => void, documents: Document[]) => {
    documents.forEach((doc: Document) => {
      const newDoc = doc;

      if (!newDoc._id) {
        newDoc._id = uuidv4();
      }

      return newDoc;
    });

    next();
  });
}
