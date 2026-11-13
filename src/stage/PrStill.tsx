import { GitPullRequest, Rocket } from 'lucide-react'
// Imported part by part, as the other stages do (the kit index also pulls in
// the brand artwork)
import { Stage } from '../kit/stage'
import { Bar, Text } from '../kit/window'
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
// inset a gutter from the top and sides of a warm well, running off the
// bottom. The focal object is badil's comment; under it the deployment row,
// then the merge box's filler, which the crop cuts. No cursor, no motion.
//
// Real strings: the repo, the title and number, the preview label, badil's
// comment (author, bot tag, heading, three services, the note) and the
// deployment row. Everything else is placeholder lines.

const SERVICES = [
  { name: 'backend', pinned: true, ref: 'a1b2c3d4', link: 'backend-feature-pricing.example.com' },
  { name: 'front', pinned: true, ref: '9f8e7d6c', link: 'front-feature-pricing.example.com' },
  { name: 'postgres', pinned: false, ref: 'main', link: null },
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
        <Avatar size={18} plain />
        <Bar w={compact ? 96 : 150} h={6} tone={2} />
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
        <Bar w={compact ? 40 : 54} h={5} tone={2} />
      </div>
      <div className="ps-card__body">
        <div className="ps-comment__title">Preview: feature-pricing</div>
        <div className="ps-services">
          {SERVICES.map((v) => (
            <div key={v.name} className="ps-svc">
              <code className="ps-svc__name">{v.name}</code>
              <span className="ps-svc__ref">
                {v.pinned ? 'pinned at' : 'tracking'} <code className="ps-code">{v.ref}</code>
              </span>
              {v.link && <span className="ps-link">{v.link}</span>}
            </div>
          ))}
        </div>
        <div className="ps-note">A pinned service starts once CI has pushed the image for its commit.</div>
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
        <Bar w={compact ? 132 : 220} h={6} tone={3} />
        <Bar w={compact ? 96 : 160} h={5} tone={2} />
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
      height={540}
      compact={{ below: 600, width: 350, height: 570 }}
      theme={dark ? 'dark' : 'light'}
      className="ps"
    >
      {(_s, _rect, layout) => <Page layout={layout} />}
    </Stage>
  )
}
