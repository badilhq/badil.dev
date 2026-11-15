import { GitPullRequest, Rocket } from 'lucide-react'
// Imported part by part, as the other stages do (the kit index also pulls in
// the brand artwork)
import { Stage } from '../kit/stage'
import { Text } from '../kit/window'
import { Avatar } from '../kit/parts/Avatar'
import { Button } from '../kit/controls/Button'
import type { Layout } from '../kit/looks'
import { useDark } from './useDark'
import './pr-still.css'

// A still for the "On the pull request" section: what developers see on the
// pull request once badil has commented.
//
// Plan. A feature card beside copy (pinned, bottom bleed, from the
// static-card gold): a generic code host's pull request page, chromeless,
// inset a gutter from the top and sides, running off the bottom under a
// fade. The focal object is badil's comment; under it the deployment row,
// then the merge box, which the fade takes. No cursor, no motion.
//
// Real strings: the repo, the title and number, the preview label, badil's
// comment (author, bot tag, heading, the service table, the note, the gitops
// commit) and the deployment row. Everything else is placeholder lines.

// badil's comment as it renders on the code host: a markdown table, one row
// per service (pinned at its commit, with the pull request that pinned it, or
// on main), then the note and the gitops commit that wrote the preview.
const SERVICES = [
  { name: 'backend', ref: 'a1b2c3d4', from: '#42', link: 'backend-feature-pricing.example.com' },
  { name: 'front', ref: '9f8e7d6c', from: 'acme/front#17', link: 'front-feature-pricing.example.com' },
  { name: 'postgres', ref: 'main', from: null, link: null },
]

function Header({ compact }: { compact: boolean }) {
  return (
    <div className="ps-head">
      <div className="ps-crumb">
        <Text className="ps-crumb__org">acme</Text>
        <span className="ps-crumb__sep">/</span>
        <Text className="ps-crumb__repo">backend</Text>
      </div>
      <div className="ps-title">
        <Text className="ps-title__text">Add tiered pricing</Text>
        <Text className="ps-title__num">#42</Text>
      </div>
      <div className="ps-meta">
        <span className="ps-state"><GitPullRequest size={14} strokeWidth={2} /></span>
        <span className="ps-meta__text">{compact ? 'dana wants to merge into main' : 'dana wants to merge 3 commits into main from feature/pricing'}</span>
        <span className="ps-label">preview</span>
      </div>
    </div>
  )
}

function Comment({ compact }: { compact: boolean }) {
  return (
    <div className="ps-card ps-comment">
      <div className="ps-card__head">
        {!compact && <Avatar name="badil" tone="accent" size={22} className="ps-bot-avatar" />}
        <Text className="ps-card__name">badil</Text>
        <span className="ps-bot">bot</span>
        <span className="ps-card__when">commented 2 minutes ago</span>
      </div>
      <div className="ps-card__body">
        <div className="ps-comment__title">Preview <code className="ps-code ps-code--title">feature-pricing</code></div>
        <div className="ps-services" role="table" aria-label="Services in the preview">
          {!compact && (
            <div className="ps-svc ps-svc--head" role="row">
              <span role="columnheader">Service</span>
              <span role="columnheader">Runs</span>
              <span role="columnheader">Link</span>
            </div>
          )}
          {SERVICES.map((v) => (
            <div key={v.name} className="ps-svc" role="row">
              <span className="ps-svc__name" role="cell">{v.name}</span>
              <span className="ps-svc__ref" role="cell">
                <code className={v.from ? 'ps-code ps-code--pin' : 'ps-code'}>{v.ref}</code>
                {v.from && <span className="ps-link">{v.from}</span>}
              </span>
              <span role="cell">{v.link && <span className="ps-link">{v.link}</span>}</span>
            </div>
          ))}
        </div>
        <div className="ps-note">Pinned services start once CI has pushed their image. Until then their link may not respond.</div>
        <div className="ps-written">Written in <span className="ps-link">acme/gitops@50ea4e0</span></div>
      </div>
    </div>
  )
}

function MergeBox({ compact }: { compact: boolean }) {
  return (
    <div className="ps-card ps-mergebox">
      <div className="ps-deploy">
        <span className="ps-deploy__icon"><Rocket size={16} strokeWidth={1.75} /></span>
        <code className="ps-deploy__env">preview-feature-pricing-backend</code>
        <span className="ps-deploy__end">
          <span className="ps-success"><i className="ps-dot" />Success</span>
          <Button size="small">View deployment</Button>
        </span>
      </div>
      <div className="ps-merge">
        <span className="ps-merge__title">This branch has no conflicts with the base branch</span>
        <span className="ps-merge__sub">Merging removes its pin; the preview goes with its last pull request.</span>
      </div>
    </div>
  )
}

function Page({ layout }: { layout: Layout }) {
  const compact = layout === 'compact'
  return (
    <div className="ps-page">
      <Header compact={compact} />
      <div className="ps-timeline">
        <Comment compact={compact} />
        <MergeBox compact={compact} />
      </div>
    </div>
  )
}

export default function PrStill() {
  const dark = useDark()
  return (
    <Stage
      width={680}
      height={660}
      compact={{ below: 600, width: 350, height: 640 }}
      theme={dark ? 'dark' : 'light'}
      className="ps"
    >
      {(_s, _rect, layout) => <Page layout={layout} />}
    </Stage>
  )
}
