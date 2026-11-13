import FlowDemo from './stage/FlowDemo'
import PrStill from './stage/PrStill'
import { Monitor, Moon, Sun } from 'lucide-react'
import { setThemeChoice, useTheme, type ThemeChoice } from './theme'

// The hero: a small looping diagram, badil's card in the middle with the
// pull requests, the gitops repo and Argo CD as small nodes and a dot on
// each line.

const REPO = 'https://github.com/badilhq/badil'
const INSTALL = 'https://github.com/badilhq/badil/blob/main/docs/INSTALL.md'
const STORY = 'https://medium.com/@aminebenseddik/ai-writes-code-in-hours-it-still-takes-weeks-to-ship-7fb07f87cc07'
const ADVISORY = 'https://github.com/badilhq/badil/security/advisories/new'

const STEPS = [
  {
    title: 'CI builds, a label asks',
    body: <>Your CI builds and pushes the image as it does today. Adding the <code>preview</code> label to a pull request asks for a preview.</>,
  },
  {
    title: 'badil composes the stack',
    body: <>It pins the pull request's service at its commit, keeps every other service on <code>main</code>, commits <code>previews/&lt;slug&gt;/values.yaml</code> to your gitops repo and comments the links.</>,
  },
  {
    title: 'More pull requests can join',
    body: <>A pull request on the same branch in another repo, or with the same <code>preview:&lt;name&gt;</code> label, pins its own service in the same preview.</>,
  },
  {
    title: 'Argo CD deploys, merge removes',
    body: <>Argo CD deploys each preview to its own namespace. Merging or closing a pull request, or removing its label, removes its pin; the preview goes with its last pull request, and a sweep clears stale ones.</>,
  },
]

const WHY = [
  {
    title: 'One preview across apps and commits',
    body: <>Pull requests from several repos share one preview. Each pins its own service at its own commit, and every other service runs on <code>main</code>. Use the same branch name, or a <code>preview:&lt;name&gt;</code> label.</>,
  },
  {
    title: 'CI builds once',
    body: <>badil only writes desired state to git. It never builds images: a pinned service runs the image your CI pushed for its commit.</>,
  },
  {
    title: 'Argo CD deploys from git',
    body: <>badil never touches your cluster. Argo CD deploys every preview from your gitops repo.</>,
  },
]

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

export function App() {
  return (
    <>
      <header className="nav">
        <div className="wrap nav__inner">
          <a className="wordmark" href="/" aria-label="badil home">badil</a>
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
            <h1>Self-hosted preview environments for every pull request, on Kubernetes and Argo CD.</h1>
            <p className="hero__sub">Open source under Apache-2.0. You run it; there is no hosted version.</p>
            <div className="actions">
              <a className="btn btn--primary" href={INSTALL}>Install guide</a>
              <a className="btn" href={REPO}>GitHub</a>
            </div>
          </div>
          <div className="hero__stage" role="img" aria-label="Two pull requests in two repos, acme/backend #42 and acme/front #17, both on the branch feature/pricing, get the preview label. badil builds one preview, feature-pricing: backend pinned at a1b2c3d4 from the first pull request, then front pinned at 9f8e7d6c from the second, postgres on main, and writes it to the gitops repo as one file, updated by the second pull request. Argo CD syncs it and reports Synced and Healthy back to badil: every service turns green, badil shows ready in 3m 28s and both pull requests show Deployment Success. When both are merged, badil deletes the file and Argo CD removes the preview.">
            <FlowDemo />
          </div>
        </section>

        <section className="band" id="how">
          <div className="wrap">
            <h2>How it works</h2>
            <ol className="steps">
              {STEPS.map((s, i) => (
                <li key={s.title} className="step">
                  <span className="step__num">{i + 1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section" id="pr">
          <div className="wrap pr">
            <div className="pr__copy">
              <h2>On the pull request</h2>
              <p>
                badil posts one comment with every service of the preview and the links to the exposed ones, and keeps it up to date as pull requests join. With Argo CD
                notifications, the pull request also shows the deployment once its service is healthy.
              </p>
            </div>
            <div className="pr__still" role="img" aria-label="The pull request Add tiered pricing #42 in acme/backend, labelled preview. badil's comment, Preview: feature-pricing, lists backend pinned at a1b2c3d4 with the link backend-feature-pricing.example.com, front pinned at 9f8e7d6c with the link front-feature-pricing.example.com, and postgres tracking main, with the note: A pinned service starts once CI has pushed the image for its commit. Below it the deployment preview-feature-pricing-backend shows Success and View deployment.">
              <PrStill />
            </div>
          </div>
        </section>

        <section className="band">
          <div className="wrap">
            <h2>Why badil</h2>
            <ul className="points">
              {WHY.map((w) => (
                <li key={w.title} className="point">
                  <h3>{w.title}</h3>
                  <p>{w.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section section--rule">
          <div className="wrap compare">
            <h2>Why not Argo CD's Pull Request generator?</h2>
            <p>
              Argo CD's Pull Request generator creates an Application for each open pull request of one repository. badil builds on Argo CD to preview the whole stack: the
              pull request's service at its commit and every other service at <code>main</code>, in one namespace. Pull requests from several repos can share a preview,
              badil posts the links on each one, and previews are torn down on merge and swept when stale.
            </p>
          </div>
        </section>

        <section className="section section--rule">
          <div className="wrap install">
            <p className="install__need">You need a Kubernetes cluster with Argo CD 3.1 or later, a gitops repo and a GitHub App.</p>
            <a className="link" href={INSTALL}>Read the install guide <span aria-hidden>→</span></a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer__inner">
          <span className="wordmark wordmark--small">badil</span>
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
