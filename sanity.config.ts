import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes, singletonTypes } from "./src/sanity/schemas";
import { structure } from "./src/sanity/structure";
import { apiVersion, dataset, projectId } from "./src/sanity/env";

export default defineConfig({
  name: "default",
  title: "RenovaAura Admin",
  basePath: "/studio",
  projectId: projectId || "missing",
  dataset,
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  schema: {
    types: schemaTypes,
    // Hide singleton document types from "New document" menus.
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    // Prevent duplicating/deleting only true singletons. Collections such as
    // procedures must retain Sanity's default create/edit/delete actions.
    actions: (input, context) => {
      const schemaType = context.schemaType;

      if (schemaType === "procedure") return input;
      if (!schemaType || !singletonTypes.has(schemaType)) return input;

      return input.filter(
        ({ action }) => action !== "duplicate" && action !== "delete",
      );
    },
  },
});
