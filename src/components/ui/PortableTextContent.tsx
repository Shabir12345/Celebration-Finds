import { PortableText, PortableTextComponents } from '@portabletext/react'
import { urlFor } from '@/lib/sanity'
import Image from 'next/image'

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null
      return (
        <div className="relative w-full aspect-video my-12 overflow-hidden rounded-xl shadow-lg group">
          <Image
            src={urlFor(value).width(1200).url()}
            alt={value.alt || 'Blog Image'}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        </div>
      )
    },
  },
  block: {
    h1: ({ children }) => (
      <h1 className="font-serif text-4xl md:text-6xl font-bold mt-16 mb-8 text-accent tracking-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-serif text-3xl md:text-5xl font-bold mt-12 mb-6 text-accent tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-serif text-2xl md:text-3xl font-bold mt-10 mb-4 text-accent tracking-tight">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="font-sans text-lg md:text-xl text-slate-600 leading-relaxed mb-8">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-8 my-12 py-4 italic font-serif text-2xl text-slate-400 leading-snug">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-outside ml-6 mb-8 space-y-4 text-slate-600 text-lg">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-outside ml-6 mb-8 space-y-4 text-slate-600 text-lg">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined
      return (
        <a
          href={value.href}
          rel={rel}
          className="text-primary underline decoration-2 underline-offset-4 hover:decoration-secondary transition-all"
        >
          {children}
        </a>
      )
    },
  },
}

interface PortableTextContentProps {
  value: any
}

export default function PortableTextContent({ value }: PortableTextContentProps) {
  return (
    <div className="prose-custom max-w-none">
      <PortableText value={value} components={components} />
    </div>
  )
}
