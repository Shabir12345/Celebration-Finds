import { defineType, defineField } from "sanity";

export const portfolioEntry = defineType({
  name: "portfolioEntry",
  title: "Design Portfolio",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Design Name / Title",
      type: "string",
      description: "e.g., 'Organic Curve Collection' or 'The Silver Mist Series'",
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
      name: "category",
      title: "Design Category",
      type: "string",
      options: {
        list: [
          { title: "Sculpted & Organic", value: "sculpted" },
          { title: "Minimalist & Clean", value: "minimalist" },
          { title: "Luxury & Metallic", value: "luxe" },
          { title: "Corporate & Branded", value: "branded" },
          { title: "Other Styles", value: "other" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "completionDate",
      title: "Completion Date",
      type: "date",
    }),
    defineField({
      name: "clientType",
      title: "Client / Partnership Type",
      type: "string",
      description: "e.g., Boutique Winery, Luxury Hotel, Private Collector",
    }),
    defineField({
      name: "description",
      title: "Design Concept & Story",
      type: "text",
      description: "Explain the aesthetic goals and materials used.",
    }),
    defineField({
      name: "images",
      title: "Design Gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "productsFeatured",
      title: "Products Featured",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),
    defineField({
      name: "partnerQuote",
      title: "Partner/Client Testimonial",
      type: "text",
    }),
    defineField({
      name: "isFeatured",
      title: "Featured in Main Showcase",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
