import { defineType, defineField } from "sanity";

export const customizationField = defineType({
  name: "customizationField",
  title: "Customization Field",
  type: "object",
  fields: [
    defineField({
      name: "fieldKey",
      title: "Field Key",
      type: "string",
      description: "Unique identifier for this field (e.g., 'ribbon_color')",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "label",
      title: "Display Label",
      type: "string",
      description: "Label shown to the user (e.g., 'Ribbon Colour')",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fieldType",
      title: "Field Type",
      type: "string",
      options: {
        list: [
          { title: "Text Input", value: "text" },
          { title: "Color Swatch Picker", value: "color_swatch" },
          { title: "Scent Selector", value: "scent_selector" },
          { title: "Photo Upload", value: "photo_upload" },
          { title: "Dropdown", value: "dropdown" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isRequired",
      title: "Required",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "placeholder",
      title: "Placeholder Text",
      type: "string",
    }),
    defineField({
      name: "options",
      title: "Options (for Swatch/Scent/Dropdown)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string" },
            { name: "value", type: "string" },
            { name: "icon", type: "string", description: "Emoji or Lucide icon name" },
          ],
        },
      ],
      hidden: ({ parent }) => 
        !["color_swatch", "scent_selector", "dropdown"].includes(parent?.fieldType),
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
  ],
});

export const customizationSchema = defineType({
  name: "customizationSchema",
  title: "Customization Schema",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Schema Title",
      type: "string",
      description: "e.g., 'Standard Candle Form'",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fields",
      title: "Fields",
      type: "array",
      of: [{ type: "customizationField" }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
});
