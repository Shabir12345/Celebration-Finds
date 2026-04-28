import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "vae4tg27";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
  console.warn("SANITY_API_WRITE_TOKEN is missing in environment variables.");
}

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-03-24",
  useCdn: false,
  token,
});



