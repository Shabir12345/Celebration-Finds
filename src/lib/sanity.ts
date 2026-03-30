import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "vae4tg27";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-03-24",
  useCdn: true,
});

const builder = (createImageUrlBuilder as any)(client);

export function urlFor(source: any) {
  return builder.image(source);
}
