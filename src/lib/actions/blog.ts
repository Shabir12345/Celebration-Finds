'use server'

import { writeClient } from '@/lib/sanity-server'
import { revalidatePath } from 'next/cache'

export async function createBlogCategory(data: {
  title: string
  slug: string
  description?: string
}) {
  try {
    const result = await writeClient.create({
      _type: 'blogCategory',
      title: data.title,
      slug: { _type: 'slug', current: data.slug },
      description: data.description,
    })
    revalidatePath('/admin/dashboard/blog')
    return { success: true, id: result._id }
  } catch (error: any) {
    console.error('Error creating blog category:', error)
    return { success: false, error: error.message }
  }
}

export async function updateBlogCategory(id: string, data: {
  title?: string
  slug?: string
  description?: string
}) {
  try {
    const updateData: any = {}
    if (data.title) updateData.title = data.title
    if (data.slug) updateData.slug = { _type: 'slug', current: data.slug }
    if (data.description !== undefined) updateData.description = data.description

    await writeClient.patch(id).set(updateData).commit()
    revalidatePath('/admin/dashboard/blog')
    return { success: true }
  } catch (error: any) {
    console.error('Error updating blog category:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteBlogCategory(id: string) {
  try {
    await writeClient.delete(id)
    revalidatePath('/admin/dashboard/blog')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting blog category:', error)
    return { success: false, error: error.message }
  }
}

export async function createBlogPost(data: {
  title: string
  slug: string
  mainImage?: any
  categories?: string[]
  publishedAt?: string
  excerpt?: string
  body?: any
  metaTitle?: string
  metaDescription?: string
}) {
  try {
    const result = await writeClient.create({
      _type: 'blogPost',
      title: data.title,
      slug: { _type: 'slug', current: data.slug },
      mainImage: data.mainImage,
      categories: data.categories?.map(id => ({ _type: 'reference', _ref: id, _key: id })),
      publishedAt: data.publishedAt || new Date().toISOString(),
      excerpt: data.excerpt,
      body: data.body,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
    })
    revalidatePath('/blog')
    revalidatePath('/admin/dashboard/blog')
    return { success: true, id: result._id }
  } catch (error: any) {
    console.error('Error creating blog post:', error)
    return { success: false, error: error.message }
  }
}

export async function updateBlogPost(id: string, data: {
  title?: string
  slug?: string
  mainImage?: any
  categories?: string[]
  publishedAt?: string
  excerpt?: string
  body?: any
  metaTitle?: string
  metaDescription?: string
}) {
  try {
    const updateData: any = {}
    if (data.title) updateData.title = data.title
    if (data.slug) updateData.slug = { _type: 'slug', current: data.slug }
    if (data.mainImage !== undefined) updateData.mainImage = data.mainImage
    if (data.categories !== undefined) {
      updateData.categories = data.categories.map(catId => ({ _type: 'reference', _ref: catId, _key: catId }))
    }
    if (data.publishedAt) updateData.publishedAt = data.publishedAt
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt
    if (data.body !== undefined) updateData.body = data.body
    if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle
    if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription

    await writeClient.patch(id).set(updateData).commit()
    revalidatePath('/blog')
    revalidatePath('/admin/dashboard/blog')
    return { success: true }
  } catch (error: any) {
    console.error('Error updating blog post:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await writeClient.delete(id)
    revalidatePath('/blog')
    revalidatePath('/admin/dashboard/blog')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting blog post:', error)
    return { success: false, error: error.message }
  }
}

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
