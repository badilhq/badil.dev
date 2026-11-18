import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DocsBody, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/notebook/page';
import { getMDXComponents } from '@/components/mdx';
import { source } from '@/lib/source';

type Props = { params: Promise<{ slug?: string[] }> };

export default async function Page({ params }: Props) {
  const page = source.getPage((await params).slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full} breadcrumb={{ enabled: false }}>
      <DocsTitle className="docs-title">{page.data.title}</DocsTitle>
      <DocsBody className="docs-body">
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const page = source.getPage(slug);
  if (!page) notFound();

  // The home's tab reads "badil docs" (its page title is Overview); the other pages read "<title> | badil".
  return { title: slug?.length ? page.data.title : { absolute: 'badil docs' }, description: page.data.description };
}
