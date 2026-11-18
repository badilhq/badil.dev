// The docs home's parts (content/docs/index.mdx, written by scripts/content.mjs): the Install card and the
// architecture map. Every statement on the map comes from badil's docs/ARCHITECTURE.md.
import Link from 'next/link';
import type { ReactNode } from 'react';
import { source } from '@/lib/source';

function Arrow() {
  return (
    <svg className="arrow-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export function InstallCard({ href, children }: { href: string; children: ReactNode }) {
  return (
    <div className="install-card not-prose">
      <span className="install-card__icon" aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 2v8M4.5 6.5 8 10l3.5-3.5M3 13.5h10" />
        </svg>
      </span>
      <div className="install-card__text">
        <p className="install-card__title">Start with Install</p>
        <p className="install-card__desc">{children}</p>
      </div>
      <Link className="ink-pill" href={href}>
        Read Install
        <Arrow />
      </Link>
    </div>
  );
}

type MapNode = { name: string; body: ReactNode; pages: string[]; side?: boolean };

const NODES: MapNode[] = [
  {
    name: 'GitHub',
    body: (
      <>
        Pull request labelled <code>preview</code>
      </>
    ),
    pages: ['install'],
  },
  {
    name: 'badil',
    body: (
      <>
        <code>badil serve</code> receives your GitHub App’s webhooks
      </>
    ),
    pages: ['events', 'api'],
    side: true,
  },
  {
    name: 'gitops repo',
    body: (
      <>
        {/* Break points after the slashes, so the path wraps at a segment in a narrow node. */}
        <code>
          previews/<wbr />
          &lt;slug&gt;/<wbr />
          values.yaml
        </code>
        , one file per preview
      </>
    ),
    pages: ['contract', 'configuration'],
    side: true,
  },
  {
    name: 'Argo CD',
    body: (
      <>
        An ApplicationSet on <code>previews/*</code> renders the <code>preview-apps</code> chart
      </>
    ),
    pages: ['services', 'cleanup'],
    side: true,
  },
  {
    name: 'Preview namespace',
    body: 'One Application per service and one per dependency',
    pages: ['operations'],
    side: true,
  },
];

const EDGES = ['webhook', 'write', 'watch', 'deploy'];

// What goes back to GitHub, from which node: drawn as lanes under the row, or as a line in the node when stacked.
const RETURNS: Record<string, { label: string; optional?: boolean }> = {
  badil: { label: 'PR comment' },
  'Argo CD': { label: 'deployment status', optional: true },
};

function NodeLinks({ slugs }: { slugs: string[] }) {
  // A link shows only when the page exists at the badil ref the docs are built from.
  const pages = slugs.flatMap((slug) => {
    const page = source.getPage([slug]);
    return page ? [page] : [];
  });
  if (pages.length === 0) return null;
  return (
    <ul className="map-node__links">
      {pages.map((page) => (
        <li key={page.url}>
          <Link href={page.url}>
            {page.data.title}
            <Arrow />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ReturnArrow() {
  return (
    <svg className="map-node__back-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13 13V7.5a2 2 0 0 0-2-2H3.5" strokeDasharray="2.5 2" />
      <path d="M6 2.5 3 5.5l3 3" />
    </svg>
  );
}

function Node({ node }: { node: MapNode }) {
  const back = RETURNS[node.name];
  return (
    <div className="map-node">
      <h3 className="map-node__name">{node.name}</h3>
      <p className="map-node__body">{node.body}</p>
      {back && (
        <p className="map-node__back">
          <ReturnArrow />
          <span>
            {back.label} to GitHub{back.optional && <span className="map-faint"> · optional</span>}
          </span>
        </p>
      )}
      <NodeLinks slugs={node.pages} />
    </div>
  );
}

function Edge({ label }: { label: string }) {
  return (
    <div className="map-edge" aria-hidden="true">
      <span className="map-edge__label">{label}</span>
      <span className="map-edge__line" />
    </div>
  );
}

export function ArchitectureMap() {
  const [github, ...side] = NODES;
  const architecture = source.getPage(['architecture']);
  return (
    <figure className="map not-prose" aria-label="How a preview flows from GitHub to the preview namespace">
      <div className="map__stage">
        <div className="map__flow">
          <Node node={github} />
          <Edge label={EDGES[0]} />
          <div className="map__side">
            <span className="map__side-label">Your side</span>
            {side.map((node, i) => (
              <div className="map__step" key={node.name}>
                {i > 0 && <Edge label={EDGES[i]} />}
                <Node node={node} />
              </div>
            ))}
          </div>
        </div>
        <div className="map__returns" aria-hidden="true">
          <span className="map__lane map__lane--comment">
            <span className="map__lane-label">PR comment</span>
          </span>
          <span className="map__lane map__lane--status">
            <span className="map__lane-label">
              deployment status <span className="map-faint">· optional</span>
            </span>
          </span>
        </div>
      </div>
      <ul className="map__notes">
        <li>Each service repo’s CI builds and pushes its images, and makes no deploy call.</li>
        <li>badil never talks to the cluster or to Argo CD. Argo CD does every deploy and deletion.</li>
        {architecture && (
          <li>
            <span>
              Every step, from label to teardown: <Link href={architecture.url}>{architecture.data.title}</Link>.
            </span>
          </li>
        )}
      </ul>
    </figure>
  );
}
