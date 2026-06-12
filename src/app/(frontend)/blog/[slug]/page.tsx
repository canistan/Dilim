import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, Clock, User, ArrowLeft, Share2 } from 'lucide-react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import STATIC_BLOGS from '@/data/blog.json'

// ISR
export const revalidate = 3600

// Sayfa için dinamik SEO Metadata üretimi
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'blog' as any,
    where: { slug: { equals: slug } },
  })

  const post = docs[0] as any
  if (!post) return { title: 'Yazı Bulunamadı' }
  
  let rawText = '';
  if (Array.isArray(post.content)) {
    const extractText = (nodes: any[]): string => nodes.map((n: any) => n.text || (n.children ? extractText(n.children) : '')).join(' ');
    rawText = extractText(post.content);
  } else if (typeof post.content === 'string') {
    rawText = post.content;
  }
  const generatedExcerpt = rawText.length > 150 ? rawText.substring(0, 150) + '...' : rawText;
  
  return {
    title: post.seo?.metaTitle || `${post.title} | Dilim Blog`,
    description: post.seo?.metaDescription || generatedExcerpt,
    keywords: post.seo?.metaKeywords || '',
    openGraph: {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || generatedExcerpt,
    }
  }
}

// Next.js static generation için statik yolları belirtme
export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'blog' as any,
    limit: 100,
  })

  return docs.map((post: any) => ({
    slug: post.slug,
  }))
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'blog' as any,
    where: { slug: { equals: slug } },
  })

  const post = docs[0] as any
  if (!post) {
    notFound()
  }

  const staticBlog = STATIC_BLOGS.find((b) => b.title === post.title)
  const imageToUse = (post.image && typeof post.image === 'object' && post.image.url) 
    ? post.image.url 
    : (staticBlog?.image || '/placeholder.png')

  const contentNodes = Array.isArray(post.content) ? post.content : [];
  const rawContent = typeof post.content === 'string' ? post.content : '';

  const renderNode = (node: any, idx: number): React.ReactNode => {
    if (node.text) return <span key={idx}>{node.text}</span>;
    if (!node.children) return null;
    const children = node.children.map((child: any, i: number) => renderNode(child, i));
    switch (node.type) {
      case 'h1': return <h1 key={idx} className="text-4xl font-bold mt-12 mb-6 text-dilim-siyah">{children}</h1>;
      case 'h2': return <h2 key={idx} className="text-3xl font-bold mt-12 mb-6 text-dilim-siyah">{children}</h2>;
      case 'h3': return <h3 key={idx} className="text-2xl font-bold mt-8 mb-4 text-dilim-siyah">{children}</h3>;
      case 'paragraph': return <p key={idx} className="mb-6 whitespace-pre-wrap">{children}</p>;
      default: return <div key={idx} className="mb-4">{children}</div>;
    }
  };

  return (
    <div className="flex flex-col w-full bg-background min-h-screen pt-24">
      
      {/* Article Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-12">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-dilim-portakal transition-colors mb-8 font-medium">
          <ArrowLeft className="w-4 h-4" /> Blog'a Dön
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-dilim-siyah mb-8 leading-tight">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 font-medium pb-8 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" /> {staticBlog?.author || 'Dilim Pastaneleri'}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" /> {new Date(post.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" /> {staticBlog?.readTime || '3 dk okuma'}
          </div>
          <button className="ml-auto flex items-center gap-2 text-dilim-portakal hover:text-dilim-turuncu transition-colors bg-orange-50 px-4 py-2 rounded-full">
            <Share2 className="w-4 h-4" /> Paylaş
          </button>
        </div>
      </div>

      {/* Featured Image */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl mb-16">
        <div className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl bg-gray-100">
          <Image 
            src={imageToUse} 
            alt={post.title} 
            fill 
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl pb-24">
        <article className="prose prose-lg prose-gray max-w-none prose-headings:font-serif prose-headings:text-dilim-siyah prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-dilim-portakal hover:prose-a:text-dilim-turuncu">
          {/* Payload CMS Slate (richText) Renderer */}
          {contentNodes.length > 0 ? (
            contentNodes.map((node: any, idx: number) => renderNode(node, idx))
          ) : (
            /* Fallback for old string content */
            rawContent.split('\n\n').map((paragraph: string, idx: number) => {
              if (paragraph.startsWith('## ')) {
                return <h2 key={idx} className="text-3xl font-bold mt-12 mb-6 text-dilim-siyah">{paragraph.replace('## ', '')}</h2>
              }
              if (paragraph.startsWith('# ')) {
                return <h1 key={idx} className="text-4xl font-bold mt-12 mb-6 text-dilim-siyah">{paragraph.replace('# ', '')}</h1>
              }
              return <p key={idx} className="mb-6 whitespace-pre-wrap">{paragraph}</p>
            })
          )}
        </article>
        
        {/* Author Box */}
        <div className="mt-16 p-8 bg-gray-50 rounded-3xl border border-gray-100 flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-dilim-yaldiz flex items-center justify-center text-white shrink-0 shadow-lg">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-dilim-siyah mb-1">{staticBlog?.author || 'Dilim Pastaneleri'}</h4>
            <p className="text-gray-500 text-sm">Dilim Pastaneleri bünyesinde özel gün pastaları ve geleneksel tatlılar konusunda uzman içerik üreticisi.</p>
          </div>
        </div>
      </div>

    </div>
  )
}
