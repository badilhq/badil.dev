import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { Boxes, FolderGit2, GitBranch, GitMerge, GitPullRequest, Pin } from 'lucide-react'
// Imported part by part rather than from kit/index, so the build carries
// only what the scene uses
import { Stage } from '../kit/stage'
import { Bar } from '../kit/window'
import { Badge } from '../kit/controls/Badge'
import { Spinner } from '../kit/parts/Spinner'
import { States } from '../kit/motion/States'
import type { Act } from '../kit/act'
import type { Rect } from '../kit/measure'
import { useDark } from './useDark'
import './flow.css'

// The plan (written before the code; started from the stageshow
// `annotations` gold: measured nodes, routes derived from rect(), a fixed
// route under a moving phase, short plain labels beside the lines).
//
// A small looping diagram for the homepage hero: badil builds ONE preview
// across apps and across commits. Two pull requests in two repos (on the
// same branch, feature/pricing) land in the same preview, each pinning its
// own service; Argo CD deploys it; on merge it is gone.
//   - Medium: a loop (~15s), full-width hero on the white (or dark) page,
//     the page is the ground: no plate. Wide 1100x352 at 1:1.
//   - Focal object: badil's card, centre, the only hero shadow and the
//     largest type: `feature-pricing`, three rows (backend, front,
//     postgres). Four small nodes, symmetric around it: the two pull
//     requests on the left (repo name first), gitops repo over Argo CD on
//     the right. Five thin neutral lines, a word each; a dot travels its
//     line during its beat, accent in flight, neutral where it lands.
//   - The key moment: the second pull request's label arrives and the
//     `front` row changes in place from `main` to pinned `9f8e7d6c`.
//   - Payoff (the poster): two pinned rows from two repos and postgres on
//     main, all green, `ready in 3m 28s`, both pull requests
//     `Deployment · Success`, Argo CD `Synced · Healthy`.
// Beats: 1 backend PR labelled, dot in, badil composes (backend pinned,
// front and postgres on main), writes the file · 2 front PR labelled, dot
// in, the front row pins 9f8e7d6c, badil writes the same file again · 3 Argo
// CD syncs, healthy back, rows green, ready, both PRs Success (poster) · 4
// both merge, badil deletes the file, Argo CD idle, the card clears: rest.
// Designs: wide 1100 (PRs | badil | repo over Argo CD), mid 760 (the same
// lane, tightened: shorter words on the lines, the path on two lines),
// phone 358 (the two PRs side by side, then badil, repo, Argo CD; `healthy`
// returns up a lane on the right).

export type Variant = 'wide' | 'mid' | 'phone'
type Line = 'pr1' | 'pr2' | 'write' | 'sync' | 'back'
type Dot = 'none' | 'set' | 'ok'
type Pr = 'idle' | 'success' | 'merged'
type Argo = 'idle' | 'syncing' | 'healthy'
/** One line's travelling dot: `n` counts trips (each trip is a new dot, the
 * last one fades where it rested), `dir` 1 runs from the line's start to its
 * end, -1 back. */
type Trip = { n: number; dir: 1 | -1; pdir: 1 | -1; on: boolean }

type S = {
  chip: [boolean, boolean]
  pr: [Pr, Pr]
  head: boolean
  rows: number
  pin: boolean
  flash: boolean
  dots: Dot[]
  ready: boolean
  file: boolean
  touch: boolean
  del: boolean
  argo: Argo
  merged: boolean
  live: Line[]
  trips: Record<Line, Trip>
}

const SERVICES = [
  { name: 'backend', w: [52, 84] },
  { name: 'front', w: [40, 40] },
  { name: 'postgres', w: [56, 40] },
] as const

const PRS = [
  { repo: 'acme/backend', num: '#42', line: 'pr1' },
  { repo: 'acme/front', num: '#17', line: 'pr2' },
] as const

const LINES: Line[] = ['pr1', 'pr2', 'write', 'sync', 'back']
const T0: Trip = { n: 0, dir: 1, pdir: 1, on: false }
const T1: Trip = { n: 1, dir: 1, pdir: 1, on: true }
const NONE: Dot[] = ['none', 'none', 'none']
const initial: S = {
  chip: [false, false], pr: ['idle', 'idle'], head: false, rows: 0, pin: false, flash: false, dots: NONE, ready: false,
  file: false, touch: false, del: false, argo: 'idle', merged: false, live: [],
  trips: { pr1: T0, pr2: T0, write: T0, sync: T0, back: T0 },
}
const POSTER: S = {
  ...initial, chip: [true, true], pr: ['success', 'success'], head: true, rows: 3, pin: true, dots: ['ok', 'ok', 'ok'], ready: true,
  file: true, argo: 'healthy',
  trips: { pr1: T1, pr2: T1, write: T1, sync: T1, back: T1 },
}

/** Beats for the page around the stage (the How it works steps). */
const beat = (n: number) => {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('badil:beat', { detail: n }))
}

/* ---- Routes: measured from the nodes, straight runs, no crossings ---- */

type Pt = { x: number; y: number }
type Route = { d: string; len: number; label: Pt; side: 'above' | 'right' | 'left' }
const GAP = 6
const R = 8

const right = (r: Rect) => r.x + r.width
const bottom = (r: Rect) => r.y + r.height
const cy = (r: Rect) => r.y + r.height / 2
const cx = (r: Rect) => r.x + r.width / 2

function straight(a: Pt, b: Pt, side: Route['side']): Route {
  const len = Math.hypot(b.x - a.x, b.y - a.y)
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
  return { d: `M${a.x} ${a.y}L${b.x} ${b.y}`, len, label: mid, side }
}

/** Out of `a` to the right, up a lane at `lane`, back left into `b`. */
function lane(a: Pt, b: Pt, x: number, label: Pt): Route {
  const up = Math.sign(b.y - a.y)
  const d = `M${a.x} ${a.y}H${x - R}Q${x} ${a.y} ${x} ${a.y + up * R}V${b.y - up * R}Q${x} ${b.y} ${x - R} ${b.y}H${b.x}`
  const len = (x - a.x) + Math.abs(b.y - a.y) + (x - b.x)
  return { d, len, label, side: 'left' }
}

function routes(v: Variant, rect: (n: string) => Rect): Record<Line, Route> | null {
  const p1 = rect('pr1'), p2 = rect('pr2'), hub = rect('hub'), git = rect('git'), argo = rect('argo')
  if (![p1, p2, hub, git, argo].every((r) => r.width > 0)) return null
  if (v !== 'phone') {
    return {
      pr1: straight({ x: right(p1) + GAP, y: cy(p1) }, { x: hub.x - GAP, y: cy(p1) }, 'above'),
      pr2: straight({ x: right(p2) + GAP, y: cy(p2) }, { x: hub.x - GAP, y: cy(p2) }, 'above'),
      write: straight({ x: right(hub) + GAP, y: cy(git) }, { x: git.x - GAP, y: cy(git) }, 'above'),
      sync: straight({ x: git.x + 40, y: bottom(git) + GAP }, { x: git.x + 40, y: argo.y - GAP }, 'right'),
      back: straight({ x: argo.x - GAP, y: cy(argo) }, { x: right(hub) + GAP, y: cy(argo) }, 'above'),
    }
  }
  const x = hub.x + 36
  const gapMid = (bottom(hub) + git.y) / 2
  const laneX = right(hub) + 22
  return {
    pr1: straight({ x: p1.x + 36, y: bottom(p1) + GAP }, { x: p1.x + 36, y: hub.y - GAP }, 'right'),
    pr2: straight({ x: p2.x + 36, y: bottom(p2) + GAP }, { x: p2.x + 36, y: hub.y - GAP }, 'right'),
    write: straight({ x, y: bottom(hub) + GAP }, { x, y: git.y - GAP }, 'right'),
    sync: straight({ x, y: bottom(git) + GAP }, { x, y: argo.y - GAP }, 'right'),
    back: lane({ x: right(argo) + GAP, y: cy(argo) }, { x: right(hub) + GAP, y: bottom(hub) - 40 }, laneX, { x: laneX - 10, y: gapMid }),
  }
}

/* ---- The script ---- */

const live = (l: Line, on: boolean) => (s: S) => ({ live: on ? [...s.live.filter((x) => x !== l), l] : s.live.filter((x) => x !== l) })
const send = (l: Line, dir: 1 | -1) => (s: S) => {
  const t = s.trips[l]
  return { trips: { ...s.trips, [l]: { n: t.n + 1, dir, pdir: t.dir, on: true } }, ...live(l, true)(s) }
}
const dot = (i: number, d: Dot) => (s: S) => ({ dots: s.dots.map((x, j) => (j === i ? d : x)) })
const two = <T,>(pair: [T, T], i: number, v: T): [T, T] => (i === 0 ? [v, pair[1]] : [pair[0], v])
/** How long a dot takes on a route: by distance, unhurried. */
const TRAVEL = (len: number) => Math.round(Math.min(1400, 520 + len * 2))

async function trip(a: Act<S>, l: Line, dir: 1 | -1, len: () => number) {
  await a.set(send(l, dir))
  await a.wait(TRAVEL(len()))
  await a.set(live(l, false))
}

async function script(a: Act<S>, v: Variant) {
  const len = (l: Line) => () => routes(v, (n) => a.rect(n, { layout: true }))?.[l].len ?? 120
  beat(0)
  a.mark('rest')
  await a.wait(300)

  // 1. The backend pull request gets the label; badil composes the preview
  //    around its commit (brisk) and writes it to the gitops repo
  beat(1)
  a.mark('label')
  await a.set((s) => ({ chip: two(s.chip, 0, true) }))
  await a.wait(320)
  await trip(a, 'pr1', 1, len('pr1'))
  a.mark('compose')
  await a.set({ head: true })
  await a.wait(320)
  await a.set((s) => ({ rows: 1, ...dot(0, 'set')(s) }))
  await a.wait(480)
  for (let i = 1; i < SERVICES.length; i++) {
    await a.set((s) => ({ rows: i + 1, ...dot(i, 'set')(s) }))
    await a.wait(220)
  }
  beat(2)
  a.mark('write')
  await trip(a, 'write', 1, len('write'))
  await a.set({ file: true })
  await a.wait(300)

  // 2. The front pull request, same branch, another repo: the same preview,
  //    its front row pinned in place at the PR's commit; the same file again
  beat(1)
  a.mark('second')
  await a.set((s) => ({ chip: two(s.chip, 1, true) }))
  await a.wait(320)
  await trip(a, 'pr2', 1, len('pr2'))
  a.mark('pin')
  await a.set({ flash: true })
  await a.wait(160)
  await a.set({ pin: true })
  await a.wait(1200)
  await a.set({ flash: false })
  beat(2)
  await trip(a, 'write', 1, len('write'))
  await a.set({ touch: true })
  await a.wait(360)
  await a.set({ touch: false })

  // 3. Deploy: Argo CD syncs, reports healthy, badil says ready on both
  beat(3)
  a.mark('deploy')
  await trip(a, 'sync', 1, len('sync'))
  await a.set({ argo: 'syncing' })
  await a.wait(600)
  await a.set({ argo: 'healthy' })
  await a.wait(160)
  await trip(a, 'back', 1, len('back'))
  await a.stagger([0, 1, 2], (i) => a.set(dot(i, 'ok')), 70)
  await a.wait(100)
  await a.set({ ready: true })
  await a.wait(280)
  await a.set((s) => ({ pr: two(s.pr, 0, 'success') }))
  await a.wait(90)
  await a.set((s) => ({ pr: two(s.pr, 1, 'success') }))
  a.mark('ready')
  await a.wait(1600)

  // 4. Both merge: badil deletes the file, Argo CD prunes, the card clears
  beat(4)
  a.mark('merge')
  await a.set({ pr: ['merged', 'merged'], merged: true })
  await a.wait(200)
  await a.set(send('pr1', 1))
  await a.wait(90)
  await trip(a, 'pr2', 1, len('pr2'))
  await a.set(live('pr1', false))
  await trip(a, 'write', 1, len('write'))
  await a.set({ del: true })
  await a.wait(280)
  a.mark('teardown')
  await a.set({ file: false, argo: 'idle', ready: false })
  await a.wait(100)
  await a.stagger([2, 1, 0], (i) => a.set((s) => ({ rows: Math.min(s.rows, i), ...dot(i, 'none')(s) })), 70)
  await a.set((s) => ({
    head: false, pr: ['idle', 'idle'], chip: [false, false], del: false, merged: false,
    trips: Object.fromEntries(LINES.map((l) => [l, { ...s.trips[l], on: false }])) as S['trips'],
  }))
  await a.wait(400)
  // Unseen: the last dots have faded, the front row's words are hidden
  await a.snap({ trips: initial.trips, pin: false })
  await a.wait(100)
}

/* ---- Pieces ---- */

/** A placeholder and its words in one cell: the bar fades as they arrive. */
function Slot({ on, bar, children, className }: { on: boolean; bar: ReactNode; children: ReactNode; className?: string }) {
  return (
    <span className={`fd-slot${className ? ` ${className}` : ''}`} data-on={on || undefined}>
      <span className="fd-slot__bar" aria-hidden>{bar}</span>
      <span className="fd-slot__real">{children}</span>
    </span>
  )
}

/** Marks that share one 14px cell and crossfade. */
function Marks({ value, marks }: { value: string; marks: Record<string, ReactNode> }) {
  return (
    <span className="fd-marks">
      {Object.entries(marks).map(([k, m]) => <span key={k} className="fd-mark" data-on={k === value || undefined}>{m}</span>)}
    </span>
  )
}

const I = { size: 14, strokeWidth: 2 } as const

function Hub({ s }: { s: S }) {
  return (
    <section className="fd-hub" data-target="hub">
      <div className="fd-hub__title"><span>badil</span></div>
      <div className="fd-hub__body">
        <div className="fd-hub__head">
          <span className="fd-hub__kind">Preview</span>
          <Slot on={s.head} bar={<Bar w={128} h={8} r={4} tone={2} />} className="fd-hub__name">feature-pricing</Slot>
        </div>
        <div className="fd-rows">
          {SERVICES.map((svc, i) => {
            const pinned = i === 0 || (i === 1 && s.pin)
            const sha = i === 0 ? 'a1b2c3d4' : '9f8e7d6c'
            return (
              <div key={svc.name} className="fd-row" data-flash={(i === 1 && s.flash) || undefined}>
                <Slot on={i < s.rows} bar={<Bar w={svc.w[0]} h={7} r={3.5} tone={2} />} className="fd-row__name">{svc.name}</Slot>
                <Slot on={i < s.rows} bar={<Bar w={svc.w[1]} h={7} r={3.5} tone={1} />} className="fd-row__ref">
                  {i === 2 ? (
                    <span className="fd-ref"><GitBranch {...I} /><code>main</code></span>
                  ) : (
                    <States
                      align="start"
                      value={pinned ? 'pin' : 'main'}
                      states={{
                        main: <span className="fd-ref"><GitBranch {...I} /><code>main</code></span>,
                        pin: <span className="fd-ref fd-ref--pin"><Pin {...I} /><code className="fd-sha">{sha}</code></span>,
                      }}
                    />
                  )}
                </Slot>
                <i className="fd-row__dot" data-d={s.dots[i]} />
              </div>
            )
          })}
        </div>
        <div className="fd-hub__foot">
          <Slot on={s.ready} bar={<Bar w={104} h={7} r={3.5} tone={1} />} className="fd-hub__ready">ready in 3m 28s</Slot>
        </div>
      </div>
    </section>
  )
}

const PR_TEXT: Record<Exclude<Pr, 'idle'>, string> = { success: 'Deployment · Success', merged: 'Merged' }

function PullRequest({ s, i }: { s: S; i: 0 | 1 }) {
  const p = PRS[i]
  const st = s.pr[i]
  const merged = st === 'merged'
  return (
    <section className={`fd-node fd-pr fd-pr--${i + 1}`} data-target={p.line}>
      <div className="fd-node__name">
        <span className="fd-pr__icon" data-merged={merged || undefined}>
          <Marks value={merged ? 'merged' : 'open'} marks={{ open: <GitPullRequest {...I} />, merged: <GitMerge {...I} /> }} />
        </span>
        <span className="fd-pr__repo">{p.repo}</span>
        <span className="fd-pr__num fd-pr__num--name">{p.num}</span>
      </div>
      <div className="fd-pr__labels">
        <span className="fd-pr__num fd-pr__num--labels">{p.num}</span>
        <code className="fd-pr__branch">feature/pricing</code>
        <span className="fd-pr__chip" data-on={s.chip[i] || undefined}><Badge tone="accent">preview</Badge></span>
      </div>
      <div className="fd-node__line" data-k={st}>
        <Slot on={st !== 'idle'} bar={<Bar w={i === 0 ? 112 : 96} h={7} r={3.5} tone={2} />}>
          <Marks value={st} marks={{ success: <i className="fd-ok" />, merged: <GitMerge {...I} /> }} />
          <States align="start" value={st === 'idle' ? 'success' : st} states={PR_TEXT} />
        </Slot>
      </div>
    </section>
  )
}

function Gitops({ s }: { s: S }) {
  return (
    <section className="fd-node fd-git" data-target="git">
      <div className="fd-node__name"><FolderGit2 {...I} /><span>Gitops repo</span></div>
      <div className="fd-node__line" data-del={s.del || undefined} data-touch={s.touch || undefined}>
        <Slot on={s.file} bar={<Bar w={150} h={7} r={3.5} tone={2} />}>
          <span className="fd-path">previews/<wbr />feature-pricing/<wbr />values.yaml</span>
        </Slot>
      </div>
    </section>
  )
}

function ArgoCD({ s }: { s: S }) {
  return (
    <section className="fd-node fd-argo" data-target="argo">
      <div className="fd-node__name"><Boxes {...I} /><span>Argo CD</span></div>
      <div className="fd-node__line" data-k={s.argo}>
        <Slot on={s.argo !== 'idle'} bar={<Bar w={92} h={7} r={3.5} tone={2} />}>
          <Marks value={s.argo} marks={{ syncing: <Spinner size={12} />, healthy: <i className="fd-ok" /> }} />
          <States align="start" value={s.argo === 'healthy' ? 'healthy' : 'syncing'} states={{ syncing: 'Syncing', healthy: 'Synced · Healthy' }} />
        </Slot>
      </div>
    </section>
  )
}

/** Each line's word, per design; the PR lines and the write line say
 * something else on merge. A label keeps the footprint of its longest word,
 * so it never slides. */
const LABELS = (v: Variant): Record<Line, { start: string; end: string }> => ({
  pr1: { start: 'label', end: 'merged' },
  pr2: { start: 'label', end: 'merged' },
  write: v === 'mid' ? { start: 'writes', end: 'deletes' } : { start: 'writes the preview', end: 'deletes' },
  sync: { start: 'syncs', end: 'syncs' },
  back: { start: 'healthy', end: 'healthy' },
})

function Flow({ id, r, s, v }: { id: Line; r: Route; s: S; v: Variant }) {
  const words = LABELS(v)[id]
  const t = s.trips[id]
  const dur = TRAVEL(r.len)
  const dotStyle = (dir: 1 | -1) => ({
    offsetPath: `path('${r.d}')`,
    '--fd-from': dir === 1 ? '0%' : '100%',
    '--fd-to': dir === 1 ? '100%' : '0%',
    '--fd-travel': `${dur}ms`,
  }) as CSSProperties
  const isLive = s.live.includes(id)
  return (
    <>
      <svg className="fd-route" aria-hidden><path d={r.d} /></svg>
      <span className="fd-label" data-side={r.side} data-live={isLive || undefined} style={{ left: r.label.x, top: r.label.y }}>
        {words.start !== words.end
          ? <States value={s.merged ? 'end' : 'start'} states={words} align={r.side === 'above' ? 'center' : 'start'} />
          : words.start}
      </span>
      {t.n > 1 && (
        <span key={t.n - 1} className="fd-trip" data-old style={dotStyle(t.pdir)}><i className="fd-dot" /></span>
      )}
      {t.n > 0 && (
        <span key={t.n} className="fd-trip" data-old={!t.on || undefined} style={dotStyle(t.dir)}><i className="fd-dot" /></span>
      )}
    </>
  )
}

function Flows({ s, v, rect }: { s: S; v: Variant; rect: (n: string) => Rect }) {
  const r = routes(v, rect)
  if (!r) return null
  return (
    <div className="fd-flows">
      {LINES.map((l) => <Flow key={l} id={l} r={r[l]} s={s} v={v} />)}
    </div>
  )
}

function Scene({ s, v, rect }: { s: S; v: Variant; rect: (n: string) => Rect }) {
  return (
    <div className="fd-scene" data-v={v}>
      <PullRequest s={s} i={0} />
      <PullRequest s={s} i={1} />
      <Hub s={s} />
      <Gitops s={s} />
      <ArgoCD s={s} />
      <Flows s={s} v={v} rect={rect} />
    </div>
  )
}

function useMedia(q: string) {
  const [on, setOn] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const f = () => setOn(mq.matches)
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [q])
  return on
}

const SIZE: Record<Variant, [number, number]> = {
  wide: [1100, 352],
  mid: [768, 352],
  phone: [358, 692],
}

const SCRIPTS: Record<Variant, (a: Act<S>) => Promise<void>> = {
  wide: (a) => script(a, 'wide'),
  mid: (a) => script(a, 'mid'),
  phone: (a) => script(a, 'phone'),
}

export default function FlowDemo() {
  const dark = useDark()
  const mid = useMedia('(max-width: 1147px)')
  const phone = useMedia('(max-width: 599px)')
  const v: Variant = phone ? 'phone' : mid ? 'mid' : 'wide'
  const [w, h] = SIZE[v]
  return (
    <Stage<S>
      key={v}
      width={w}
      height={h}
      theme={dark ? 'dark' : 'light'}
      initial={initial}
      poster={POSTER}
      script={SCRIPTS[v]}
      className={`fd fd--${v}`}
    >
      {(s, rect) => <Scene s={s} v={v} rect={rect} />}
    </Stage>
  )
}
