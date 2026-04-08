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

export async function uploadBlogImage(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) return { success: false, error: 'No file provided' };

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const asset = await writeClient.assets.upload('image', buffer, {
      filename: file.name,
      contentType: file.type,
    });
    return { success: true, asset };
  } catch (error: any) {
    console.error('Asset upload error:', error);
    return { success: false, error: error.message };
  }
}

