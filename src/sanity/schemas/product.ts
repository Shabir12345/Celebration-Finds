import { defineType, defineField } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "priceBase",
      title: "Base Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "minQuantity",
      title: "Minimum Order Quantity",
      type: "number",
      initialValue: 25,
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
        name: "images",
        title: "Product Images",
        type: "array",
        of: [{ type: "image", options: { hotspot: true } }],
        validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "customizationSchema",
      title: "Customization Schema",
      type: "reference",
      to: [{ type: "customizationSchema" }],
    }),
    defineField({
        name: "isFeatured",
        title: "Featured Product",
        type: "boolean",
        initialValue: false,
    }),
    defineField({
        name: "isActive",
        title: "Active",
        type: "boolean",
        initialValue: true,
    }),
  ],
});
