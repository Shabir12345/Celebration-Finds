import { client } from "@/lib/sanity";
import { BLOG_POSTS_BY_CATEGORY_QUERY, BLOG_CATEGORIES_QUERY } from "@/lib/queries";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await client.fetch(BLOG_CATEGORIES_QUERY);
  const category = categories.find((c: any) => c.slug === slug);
  
  if (!category) return { title: "Category | Celebration Finds" };

  return {
    title: `${category.title} Stories | Celebration Finds`,
    description: `Explore all our blog posts in the ${category.title} category only at Celebration Finds.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  
  let posts = [];
  let categories = [];
  let currentCategory = null;

  try {
    [posts, categories] = await Promise.all([
      client.fetch(BLOG_POSTS_BY_CATEGORY_QUERY, { categorySlug: slug }),
      client.fetch(BLOG_CATEGORIES_QUERY),
    ]);
    currentCategory = categories.find((c: any) => c.slug === slug);
  } catch (error) {
    console.error("Error fetching blog category data:", error);
  }

  if (!currentCategory) {
    return notFound();
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="pt-40 pb-20 bg-slate-900 border-b border-white/5 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">
              Category Archive
            </p>
            <h1 className="font-serif text-5xl md:text-8xl font-bold text-white tracking-tighter leading-none">
              <span className="italic text-secondary">{currentCategory.title}</span> Stories.
            </h1>
            <p className="font-sans text-sm md:text-lg text-slate-400 max-w-2xl mx-auto font-medium tracking-wide leading-relaxed">
              {currentCategory.description || `Exploring all things ${currentCategory.title.toLowerCase()}. Find inspiration for your next special occasion.`}
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/5 -skew-x-12 transform translate-x-1/2 opacity-20" />
      </section>

      {/* Category Filter */}
      <section className="sticky top-[80px] z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 py-6 overflow-x-auto">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-start md:justify-center space-x-8 whitespace-nowrap">
          <Link 
            href="/blog" 
            className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 hover:text-accent transition-colors pb-1"
          >
            All Stories
          </Link>
          {categories.map((category: any) => (
            <Link 
              key={category._id}
              href={`/blog/category/${category.slug}`}
              className={`text-[10px] font-bold uppercase tracking-[0.3em] pb-1 transition-all ${
                category.slug === slug 
                  ? "text-accent border-b-2 border-secondary" 
                  : "text-slate-400 hover:text-accent transition-colors"
              }`}
            >
              {category.title}
            </Link>
          ))}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-24 container mx-auto px-4 md:px-6">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {posts.map((post: any) => (
              <Link 
                key={post._id} 
                href={`/blog/${post.slug}`}
                className="group flex flex-col space-y-6"
              >
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-700">
                  {post.mainImage ? (
                    <Image
                      src={post.mainImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center font-serif italic text-slate-300">
                      Celebration Finds
                    </div>
                  )}
                  <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-2 py-1">
                        {currentCategory.title}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  
                  <h3 className="font-serif text-2xl font-bold text-accent tracking-tight group-hover:text-primary transition-colors leading-tight">
                    {post.title}
                  </h3>
                  
                  <p className="text-slate-500 text-sm leading-relaxed font-medium line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <div className="pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent border-b border-accent/20 group-hover:border-primary transition-all group-hover:text-primary">
                      Read Article
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-slate-50 rounded-xl space-y-6">
            <h3 className="font-serif text-4xl font-bold text-accent">More stories coming to <span className="italic">{currentCategory.title}</span> soon.</h3>
            <p className="text-slate-500 max-w-sm mx-auto font-medium">Head over to the Studio to start crafting beautiful content for your celebrations.</p>
            <div className="pt-8">
              <Link
                href="/blog"
                className="px-10 py-5 bg-accent text-white font-bold uppercase tracking-widest text-[10px] hover:bg-primary transition-all shadow-xl"
              >
                Back to all Stories
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
