import { NextRequest, NextResponse } from 'next/server'
import { adminSanityClient } from '@/lib/admin-sanity'

export async function POST(req: NextRequest) {
  try {
    const { 
      name, description, categoryId, priceBase, minQuantity, 
      isFeatured, isActive, images, customizationSchemaId,
      customizationBuilder 
    } = await req.json()

    let schemaRef = customizationSchemaId

    // Helper to ensure all array items have _key for Sanity
    const prepareStepsForSanity = (steps: any[]) => {
      if (!steps) return steps;
      return steps.map((step, sIdx) => ({
        ...step,
        _key: step._key || `step_${Date.now()}_${sIdx}`,
        fields: step.fields?.map((field: any, fIdx: number) => ({
          ...field,
          _key: field._key || `field_${Date.now()}_${sIdx}_${fIdx}`,
          options: field.options?.map((opt: any, oIdx: number) => ({
             ...opt,
             _key: opt._key || `opt_${Date.now()}_${sIdx}_${fIdx}_${oIdx}`
          }))
        }))
      }))
    };

    // 1. If builder data provided, create a schema document
    if (customizationBuilder && customizationBuilder.length > 0) {
      const formattedSteps = prepareStepsForSanity(customizationBuilder);
      const schemaDoc = await adminSanityClient.create({
        _type: 'customizationSchema',
        title: `Schema for ${name}`,
        steps: formattedSteps
      })
      schemaRef = schemaDoc._id
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const doc = await adminSanityClient.create({
      _type: 'product',
      name,
      slug: { _type: 'slug', current: slug },
      description: description || '',
      category: { _type: 'reference', _ref: categoryId },
      priceBase: Number(priceBase),
      minQuantity: Number(minQuantity) || 25,
      isFeatured: Boolean(isFeatured),
      isActive: isActive !== false,
      images: images || [],
      ...(schemaRef && { customizationSchema: { _type: 'reference', _ref: schemaRef } }),
    })

    return NextResponse.json({ success: true, id: doc._id })
  } catch (err) {
    console.error('Product create error:', err)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updates } = body

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    // Build patch operations
    const patchSet: Record<string, unknown> = {}
    if (updates.name !== undefined)        patchSet.name = updates.name
    if (updates.description !== undefined) patchSet.description = updates.description
    if (updates.priceBase !== undefined)   patchSet.priceBase = Number(updates.priceBase)
    if (updates.minQuantity !== undefined) patchSet.minQuantity = Number(updates.minQuantity)
    if (updates.isFeatured !== undefined)  patchSet.isFeatured = Boolean(updates.isFeatured)
    if (updates.isActive !== undefined)    patchSet.isActive = Boolean(updates.isActive)
    if (updates.categoryId !== undefined)  {
      patchSet.category = { _type: 'reference', _ref: updates.categoryId }
    }

    // Handle Customization Builder
    if (updates.customizationBuilder !== undefined) {
      // Helper to ensure all array items have _key for Sanity
      const prepareStepsForSanity = (steps: any[]) => {
        if (!steps) return steps;
        return steps.map((step, sIdx) => ({
          ...step,
          _key: step._key || `step_${Date.now()}_${sIdx}`,
          fields: step.fields?.map((field: any, fIdx: number) => ({
            ...field,
            _key: field._key || `field_${Date.now()}_${sIdx}_${fIdx}`,
            options: field.options?.map((opt: any, oIdx: number) => ({
               ...opt,
               _key: opt._key || `opt_${Date.now()}_${sIdx}_${fIdx}_${oIdx}`
            }))
          }))
        }))
      };

      // Fetch current product to check for existing schema
      const currentProduct = await adminSanityClient.fetch(`*[_id == $id][0] { "schemaId": customizationSchema._ref }`, { id })
      
      if (updates.customizationBuilder) {
        const formattedSteps = prepareStepsForSanity(updates.customizationBuilder);
        if (currentProduct?.schemaId) {
          // Update existing
          await adminSanityClient.patch(currentProduct.schemaId).set({ steps: formattedSteps }).commit()
        } else {
          // Create new and link
          const schemaDoc = await adminSanityClient.create({
            _type: 'customizationSchema',
            title: `Schema for ${updates.name || 'Product'}`,
            steps: formattedSteps
          })
          patchSet.customizationSchema = { _type: 'reference', _ref: schemaDoc._id }
        }
      }
    } else if (updates.customizationSchemaId !== undefined) {
      if (updates.customizationSchemaId) {
        patchSet.customizationSchema = { _type: 'reference', _ref: updates.customizationSchemaId }
      }
    }

    if (updates.images !== undefined) patchSet.images = updates.images

    await adminSanityClient.patch(id).set(patchSet).commit()
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Product update error:', err)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}


export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    await adminSanityClient.delete(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Product delete error:', err)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
