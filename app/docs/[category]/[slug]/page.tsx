import { redirect } from 'next/navigation'

// Legacy route — redirect to new clean URL: /docs/[slug]
export default function LegacyArticlePage({ params }: { params: { slug: string } }) {
  redirect(`/docs/${params.slug}`)
}
