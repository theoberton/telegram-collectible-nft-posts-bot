import { uuid } from "uuidv4";
import { Schema, Document } from "mongoose";

export function idPlugin(schema: Schema) {
  schema.add({ _id: "string" });

  schema.pre("save", function generateId(this: Document, next: Function) {
    if (!this._id) {
      this._id = uuid();
    }

    next();
  });
  schema.pre("insertMany", (next: Function, documents: Document[]) => {
    documents.forEach((doc: Document) => {
      const newDoc = doc;

      if (!newDoc._id) {
        newDoc._id = uuid();
      }

      return newDoc;
    });

    next();
  });
}
