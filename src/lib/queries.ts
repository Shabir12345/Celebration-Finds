import { groq } from "next-sanity";

// All Products
export const ALL_PRODUCTS_QUERY = groq`*[_type == "product"] {
  _id,
  name,
  "slug": slug.current,
  "price": priceBase,
  "images": images[].asset->url,
  "category": category->name,
  isFeatured
} | order(_createdAt desc)`;

// Single Product with Customization Schema
export const PRODUCT_BY_SLUG_QUERY = groq`*[_type == "product" && slug.current == $slug][0] {
  _id,
  name,
  description,
  "price": priceBase,
  "images": images[].asset->url,
  "category": category->name,
  "customization_schema": customizationSchema-> {
    schema_id,
    "product_id": _id,
    steps[] {
      title,
      description,
      fields[] {
        field_key,
        field_type,
        label,
        placeholder,
        is_required,
        options[] {
          value,
          label,
          icon,
          hexColor,
          priceModifier,
          stockAvailable
        },
        validation,
        display_order
      }
    }
  }
}`;

// Portfolio Entries
export const PORTFOLIO_ENTRIES_QUERY = groq`*[_type == "portfolioEntry"] {
  _id,
  title,
  "slug": slug.current,
  category,
  "main_image": images[0].asset->url,
  "gallery": images[].asset->url,
  description,
  "date": completionDate,
  clientType
} | order(date desc)`;

// Blog Queries
export const BLOG_POSTS_QUERY = groq`*[_type == "blogPost"] {
  _id,
  title,
  "slug": slug.current,
  "mainImage": mainImage.asset->url,
  "categories": categories[]-> { title, "slug": slug.current },
  publishedAt,
  excerpt
} | order(publishedAt desc)`;

export const BLOG_POST_BY_SLUG_QUERY = groq`*[_type == "blogPost" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  "mainImage": mainImage.asset->url,
  "categories": categories[]-> { title, "slug": slug.current },
  publishedAt,
  excerpt,
  body,
  metaTitle,
  metaDescription
}`;

export const BLOG_CATEGORIES_QUERY = groq`*[_type == "blogCategory"] {
  _id,
  title,
  "slug": slug.current,
  description
}`;

export const BLOG_POSTS_BY_CATEGORY_QUERY = groq`*[_type == "blogPost" && references(*[_type == "blogCategory" && slug.current == $categorySlug]._id)] {
  _id,
  title,
  "slug": slug.current,
  "mainImage": mainImage.asset->url,
  "categories": categories[]-> { title, "slug": slug.current },
  publishedAt,
  excerpt
} | order(publishedAt desc)`;
