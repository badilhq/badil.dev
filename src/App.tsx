import FlowDemo from './stage/FlowDemo'
import PrStill from './stage/PrStill'
import { Monitor, Moon, Sun } from 'lucide-react'
import { setThemeChoice, useTheme, type ThemeChoice } from './theme'
// The official Kubernetes icon (cncf/artwork, projects/kubernetes/icon/color), used
// under the Linux Foundation trademark guidelines to show previews run on Kubernetes.
import kubernetesIcon from './logos/kubernetes-icon.svg'

// The landing page. The hero is the live preview loop (FlowDemo), set in a
// panel under the headline; the pull request section shows badil's comment
// (PrStill).

const REPO = 'https://github.com/badilhq/badil'
const INSTALL = 'https://github.com/badilhq/badil/blob/main/docs/INSTALL.md'
const STORY = 'https://medium.com/@aminebenseddik/ai-writes-code-in-hours-it-still-takes-weeks-to-ship-7fb07f87cc07'
const ADVISORY = 'https://github.com/badilhq/badil/security/advisories/new'

const STEPS = [
  {
    title: 'Label the pull request',
    body: <>Your CI builds and pushes the image as it does today. Adding the <code>preview</code> label to a pull request asks for a preview.</>,
  },
  {
    title: 'badil composes the stack',
    body: <>It pins the pull request's service at its commit, keeps every other service on its branch from <code>badil.yaml</code> (<code>main</code> by default), commits <code>previews/&lt;slug&gt;/values.yaml</code> to your gitops repo and comments the links.</>,
  },
  {
    title: 'More pull requests can join',
    body: <>A pull request on the same branch in another repo, or with the same <code>preview:&lt;name&gt;</code> label, pins its own service in the same preview.</>,
  },
  {
    title: 'Deploy and clean up',
    body: <>Argo CD deploys each preview to its own namespace. Merging or closing a pull request, or removing its label, removes its pin; the preview goes with its last pull request, and a sweep, hourly by default, clears stale ones and keeps every preview in sync with <code>badil.yaml</code> (services added or removed, branches, hosts).</>,
  },
]

const WHY = [
  {
    title: 'One preview across repos',
    body: <>Pull requests from several repos share one preview. Each pins its own service at its own commit, and every other service runs on its branch from <code>badil.yaml</code>, <code>main</code> by default. Use the same branch name, or a <code>preview:&lt;name&gt;</code> label.</>,
  },
  {
    title: 'Your CI builds the images',
    body: <>badil only writes desired state to git. It never builds images: a pinned service runs the image your CI pushed for its commit.</>,
  },
  {
    title: 'Your Argo CD deploys from git',
    body: <>badil never touches your cluster. Argo CD deploys every preview from your gitops repo.</>,
  },
]

// The file badil writes for the preview in the hero, as it lands in the gitops
// repo (same shape as a real one; neutral names, illustrative commits).
const VALUES = `apiVersion: badil.dev/v1beta1
services:
  - name: backend
    repoURL: https://github.com/acme/backend.git
    branch: main
    commitSha: a1b2c3d4e5f60718293a4b5c6d7e8f9012345678
    host: backend-feature-pricing.example.com
    metadata:
      pr-author: dana
      pr-url: https://github.com/acme/backend/pull/42
      pr-number: "42"
      created-at: "2026-11-14T09:12:00Z"
      updated-at: "2026-11-14T10:41:00Z"
      vcs.ref.name: feature/pricing
      cicd.pipeline.run.url: https://github.com/acme/backend/actions/runs/2071
  - name: front
    repoURL: https://github.com/acme/front.git
    branch: main
    commitSha: 9f8e7d6c5b4a39281706f5e4d3c2b1a098765432
    host: front-feature-pricing.example.com
    metadata:
      pr-author: dana
      pr-url: https://github.com/acme/front/pull/17
      pr-number: "17"
      created-at: "2026-11-14T09:40:00Z"
      updated-at: "2026-11-14T10:58:00Z"
      vcs.ref.name: feature/pricing
      cicd.pipeline.run.url: https://github.com/acme/front/actions/runs/2088
  - name: postgres
    repoURL: https://github.com/acme/postgres.git
    branch: main`

const THEMES: { choice: ThemeChoice; label: string; Icon: typeof Sun }[] = [
  { choice: 'system', label: 'System theme', Icon: Monitor },
  { choice: 'light', label: 'Light theme', Icon: Sun },
  { choice: 'dark', label: 'Dark theme', Icon: Moon },
]

/** System, Light or Dark: applied at once to the page and the illustrations,
 * and remembered for the visitor (see src/theme.ts). */
function ThemeControl() {
  const { choice } = useTheme()
  return (
    <div className="theme" role="group" aria-label="Theme">
      {THEMES.map(({ choice: c, label, Icon }) => (
        <button
          key={c}
          type="button"
          className="theme__btn"
          aria-label={label}
          title={label}
          aria-pressed={choice === c}
          onClick={() => setThemeChoice(c)}
        >
          <Icon aria-hidden />
        </button>
      ))}
    </div>
  )
}

/** badil's mark: production (the solid panel) and its double, the preview
 * (the dashed twin in front). "badil" means double. */
function Mark() {
  return (
    <svg className="wordmark__mark" viewBox="0 0 414 444" aria-hidden="true" focusable="false">
      <path className="mark__prod" d="M8.00 173.83 Q8.00 133.83 44.49 117.44L251.51 24.40 Q288.00 8.00 288.00 48.00L288.00 198.00 Q288.00 238.00 251.51 254.40L44.49 347.44 Q8.00 363.83 8.00 323.83Z" />
      <path className="mark__knock" d="M126.00 245.83 Q126.00 205.83 162.49 189.44L369.51 96.40 Q406.00 80.00 406.00 120.00L406.00 270.00 Q406.00 310.00 369.51 326.40L162.49 419.44 Q126.00 435.83 126.00 395.83Z" />
      <path className="mark__twin" d="M126.00 245.83 Q126.00 205.83 162.49 189.44L369.51 96.40 Q406.00 80.00 406.00 120.00L406.00 270.00 Q406.00 310.00 369.51 326.40L162.49 419.44 Q126.00 435.83 126.00 395.83Z" />
    </svg>
  )
}

export function App() {
  const hero = 'Two pull requests in two repos, acme/backend #42 and acme/front #17, both on the branch feature/pricing, get the preview label. badil builds one preview, feature-pricing: backend pinned at a1b2c3d4 from the first pull request, then front pinned at 9f8e7d6c from the second, postgres on main, and writes it to the gitops repo as one file, updated by the second pull request. Argo CD syncs it and reports Synced and Healthy back to badil: every service turns green, badil shows ready in 3m 28s and both pull requests show Deployment Success. When both are merged, badil deletes the file and Argo CD removes the preview.'
  const still = "The pull request Add tiered pricing #42 in acme/backend, labelled preview. badil's comment, Preview feature-pricing, is a table of the preview's services: backend runs a1b2c3d4 from #42 at backend-feature-pricing.example.com, front runs 9f8e7d6c from acme/front#17 at front-feature-pricing.example.com, and postgres runs main. Under it: Pinned services start once CI has pushed their image, and Written in acme/gitops@50ea4e0. Below the comment, the deployment preview-feature-pricing-backend shows Success and View deployment."
  return (
    <>
      <header className="nav">
        <div className="wrap nav__inner">
          <a className="wordmark" href="/" aria-label="badil home"><Mark /><span className="wordmark__name">badil</span></a>
          <div className="nav__end">
            <nav className="nav__links" aria-label="Main">
              <a href={INSTALL}>Install guide</a>
              <a href={REPO}>GitHub</a>
            </nav>
            <ThemeControl />
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="wrap hero__copy">
            <h1>Give your AI agents a full-stack preview to run and test every pull request.</h1>
            <p className="lede">
              badil writes each preview to your gitops repo and your Argo CD deploys it, so agents and reviewers run QA against the real stack before you
              merge. Open source and self-hosted.
            </p>
            <div className="actions">
              <a className="btn btn--primary" href={INSTALL}>Read the install guide</a>
              <a className="btn btn--quiet" href={REPO}>View on GitHub</a>
            </div>
          </div>
          <div className="wrap hero__wrap">
            <div className="hero__panel">
              <div className="hero__stage" role="img" aria-label={hero}>
                <FlowDemo />
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="how">
          <div className="wrap split split--file">
            <div className="split__lead">
              <h2>How it works</h2>
              <p>Trigger a preview with a label on the pull request. badil commits it to your gitops repo and your Argo CD deploys it.</p>
              <figure className="file">
                <figcaption className="file__path">acme/gitops · previews/feature-pricing/values.yaml</figcaption>
                <pre className="file__code"><code>{VALUES}</code></pre>
              </figure>
            </div>
            <ol className="steps">
              {STEPS.map((s) => (
                <li key={s.title} className="step">
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section section--tint" id="pr">
          <div className="wrap pr">
            <div className="pr__copy">
              <h2>The links land on the pull request</h2>
              <p>
                badil comments once with every service in the preview, the commit each one runs and its link, and keeps the comment current as pull requests
                join. Agents and reviewers start their QA from there.
              </p>
              <p>With Argo CD notifications, the pull request also shows its service's deployment: success once it is healthy, failure when it is Degraded, and error when its sync fails.</p>
            </div>
            <div className="pr__still" role="img" aria-label={still}>
              <PrStill />
            </div>
          </div>
        </section>

        <section className="section" id="why">
          <div className="wrap">
            <h2 className="why__title">What badil does, and what it leaves to you</h2>
            <p className="why__lead">badil only writes to git. Your CI builds the images and your Argo CD deploys them.</p>
            <dl className="evidence">
              <div className="evidence__item">
                <div className="evidence__ui" aria-hidden="true">
                  <div className="ui-row"><span className="ui-strong">acme/backend #42</span><span className="ui-chip">preview</span><code className="ui-faint">feature/pricing</code></div>
                  <div className="ui-row"><span className="ui-strong">acme/front #17</span><span className="ui-chip">preview</span><code className="ui-faint">feature/pricing</code></div>
                </div>
                <dt>One preview across repos</dt>
                <dd>{WHY[0].body}</dd>
              </div>
              <div className="evidence__item">
                <div className="evidence__ui" aria-hidden="true">
                  <div className="ui-row"><span className="ui-dot ui-dot--ok" /><span className="ui-strong">CI</span><span>acme/backend</span><code className="ui-pin">a1b2c3d4</code></div>
                  <div className="ui-row"><span className="ui-note">image pushed for the pull request's commit</span></div>
                </div>
                <dt>Your CI builds the images</dt>
                <dd>{WHY[1].body}</dd>
              </div>
              <div className="evidence__item">
                <div className="evidence__ui" aria-hidden="true">
                  <div className="ui-row ui-row--wrap"><code className="ui-faint">50ea4e0</code><span>chore(preview): create feature-pricing preview</span></div>
                  <div className="ui-row"><span className="ui-strong">feature-pricing-backend</span><span className="ui-dot ui-dot--ok" /><span className="ui-ok">Synced · Healthy</span></div>
                  <div className="ui-row"><img className="ui-logo" src={kubernetesIcon} width={14} height={14} alt="" /><span className="ui-note">namespace</span><code className="ui-faint">feature-pricing</code></div>
                </div>
                <dt>Your Argo CD deploys from git</dt>
                <dd>{WHY[2].body}</dd>
              </div>
            </dl>
            <div className="compare">
              <h3>Why not Argo CD's Pull Request generator?</h3>
              <p>
                It creates an Application for each open pull request of one repository. badil builds on Argo CD to preview the whole stack: the pull
                request's service at its commit and every other service at its branch from <code>badil.yaml</code> (<code>main</code> by default), in one namespace. Pull requests from several repos can share a
                preview, badil posts the links on each one, and previews are torn down on merge and swept when stale.
              </p>
            </div>
          </div>
        </section>

        <section className="section close">
          <div className="wrap close__inner">
            <h2>Run it on your cluster</h2>
            <p>You need a Kubernetes cluster with Argo CD 3.1 or later, a gitops repo and a GitHub App. badil is pre-1.0 and Apache-2.0.</p>
            <div className="actions">
              <a className="btn btn--primary" href={INSTALL}>Read the install guide</a>
              <a className="btn btn--quiet" href={STORY}>Why we built it</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer__inner">
          <span className="wordmark wordmark--small"><Mark />badil</span>
          <ul className="footer__links">
            <li>Apache-2.0</li>
            <li><a href={REPO}>GitHub</a></li>
            <li><a href={STORY}>Why we built it</a></li>
            <li><a href={ADVISORY}>Report a vulnerability</a></li>
          </ul>
        </div>
      </footer>
    </>
  )
}
