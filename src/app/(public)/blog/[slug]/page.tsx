import { client } from "@/lib/sanity";
import { BLOG_POST_BY_SLUG_QUERY } from "@/lib/queries";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PortableTextContent from "@/components/ui/PortableTextContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let post = null;
  try {
    post = await client.fetch(BLOG_POST_BY_SLUG_QUERY, { slug });
  } catch (error) {
    console.warn("Could not fetch blog post metadata from Sanity.", error);
  }
  
  if (!post) return { title: "Blog Post | Celebration Finds" };

  return {
    title: `${post.metaTitle || post.title} | Celebration Finds`,
    description: post.metaDescription || post.excerpt || "Read our latest blog post from Celebration Finds.",
  };
}

export default async function BlogPostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  let post = null;
  try {
    post = await client.fetch(BLOG_POST_BY_SLUG_QUERY, { slug });
  } catch (error) {
    console.warn(`Could not fetch blog post with slug: ${slug} from Sanity.`, error);
  }
  
  if (!post) {
    return notFound();
  }

  const blogPostLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: post.mainImage || "",
    datePublished: post.publishedAt,
    author: {
      "@type": "Organization",
      name: "Celebration Finds",
    },
    description: post.excerpt || post.metaDescription,
  };

  return (
    <div className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostLd) }}
      />
      
      {/* Header / Post Meta */}
      <section className="pt-40 pb-20 bg-slate-50 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center space-y-12">
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-4">
              {post.categories?.map((cat: any) => (
                <Link
                  key={cat.slug}
                  href={`/blog/category/${cat.slug}`}
                  className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary"
                >
                  {cat.title}
                </Link>
              ))}
              <span className="text-slate-300">|</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-8xl font-bold text-accent tracking-tighter leading-none max-w-5xl mx-auto">
              {post.title}
            </h1>
          </div>
          
          <div className="max-w-3xl mx-auto pt-4 relative aspect-[16/6] md:aspect-[21/9] overflow-hidden shadow-2xl">
            {post.mainImage ? (
              <Image
                src={post.mainImage}
                alt={post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            ) : (
                <div className="w-full h-full bg-slate-900 border-b border-secondary/5 relative overflow-hidden text-center flex flex-col items-center justify-center font-serif italic text-slate-300">
                    Celebration Finds
                </div>
            )}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/4 h-full bg-primary/5 -skew-x-12 transform translate-x-1/2 opacity-20" />
      </section>

      {/* Content Section */}
      <section className="py-24 md:py-32 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto space-y-16">
          <PortableTextContent value={post.body} />
          
          <div className="pt-20 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-4">
              <h4 className="font-serif text-2xl font-bold text-accent">Like this story?</h4>
              <p className="text-sm text-slate-500 font-medium">Keep exploring more celebration stories or find inspiration for your own event.</p>
            </div>
            <div className="flex items-center space-x-6">
                <Link 
                    href="/blog" 
                    className="px-10 py-5 border-2 border-accent text-accent font-bold uppercase tracking-widest text-[10px] hover:bg-accent hover:text-white transition-all shadow-xl"
                >
                    Back to Blog
                </Link>
                <Link 
                    href="/portfolio" 
                    className="px-10 py-5 bg-primary text-white font-bold uppercase tracking-widest text-[10px] hover:bg-accent transition-all shadow-xl"
                >
                    View Lookbook
                </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer CTA */}
      <section className="bg-slate-900 py-32 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-12">
            <h2 className="font-serif text-4xl md:text-6xl font-bold tracking-tight">Designing your next big <span className="italic text-secondary">moment?</span></h2>
            <p className="text-slate-400 font-medium max-w-2xl mx-auto">From custom candles to elegant favors, we're here to help you create unforgettable gifts.</p>
            <div className="pt-4">
                <Link 
                    href="/shop" 
                    className="px-12 py-7 bg-secondary text-white font-bold uppercase tracking-widest text-[11px] hover:bg-white hover:text-secondary transition-all shadow-2xl"
                >
                    Discover the Collection
                </Link>
            </div>
        </div>
      </section>
    </div>
  );
}
