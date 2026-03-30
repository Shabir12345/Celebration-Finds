'use client'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { product } from '@/sanity/schemas/product'
import { category } from '@/sanity/schemas/category'
import { customizationField, customizationSchema } from '@/sanity/schemas/customizationSchema'
import { portfolioEntry } from '@/sanity/schemas/portfolioEntry'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

export default defineConfig({
  basePath: '/admin/studio',
  projectId,
  dataset,
  title: 'Celebration Finds Studio',
  schema: {
    types: [product, category, customizationField, customizationSchema, portfolioEntry],
  },
  plugins: [
    structureTool(),
    visionTool({ defaultApiVersion: '2024-03-24' }),
  ],
})
