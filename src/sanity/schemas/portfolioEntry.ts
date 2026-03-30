import { defineType, defineField } from "sanity";

export const portfolioEntry = defineType({
  name: "portfolioEntry",
  title: "Portfolio Entry",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title (Event Name)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "eventType",
      title: "Event Type",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "eventDate",
      title: "Event Date",
      type: "date",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "guestCount",
      title: "Guest Count",
      type: "number",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "images",
      title: "Editorial Gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "productsUsed",
      title: "Products Used",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),
    defineField({
      name: "plannerName",
      title: "Planner Name",
      type: "string",
    }),
    defineField({
      name: "plannerQuote",
      title: "Planner Quote",
      type: "text",
    }),
    defineField({
      name: "isFeatured",
      title: "Featured in Lookbook",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
