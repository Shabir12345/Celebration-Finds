import { groq } from "next-sanity";

// All Products
export const ALL_PRODUCTS_QUERY = groq`*[_type == "product"] {
  _id,
  name,
  "slug": slug.current,
  price,
  "images": images[].asset->url,
  "category": category->name,
  is_featured
} | order(_createdAt desc)`;

// Single Product with Customization Schema
export const PRODUCT_BY_SLUG_QUERY = groq`*[_type == "product" && slug.current == $slug][0] {
  _id,
  name,
  description,
  price,
  "images": images[].asset->url,
  "category": category->name,
  customization_schema-> {
    schema_id,
    "product_id": _id,
    fields[] {
      field_key,
      field_type,
      label,
      placeholder,
      is_required,
      options[] {
        value,
        label,
        icon
      },
      validation,
      display_order
    }
  }
}`;

// Portfolio Entries
export const PORTFOLIO_ENTRIES_QUERY = groq`*[_type == "portfolioEntry"] {
  _id,
  title,
  "slug": slug.current,
  event_type,
  "main_image": main_image.asset->url,
  "gallery": gallery[].asset->url,
  description,
  date,
  location
} | order(date desc)`;
