import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { remarkMdxMermaid } from 'fumadocs-core/mdx-plugins';

const chart = 'flowchart LR\n  a["badil"] -->|write| b[("gitops repo")]';

test('a mermaid fence becomes the Mermaid component, with the chart as its prop', () => {
  const tree = fromMarkdown(`Intro.\n\n\`\`\`mermaid\n${chart}\n\`\`\`\n\n\`\`\`yaml\nkey: value\n\`\`\`\n`);
  remarkMdxMermaid()(tree, {});
  const [intro, diagram, yaml] = tree.children;
  assert.equal(intro.type, 'paragraph');
  assert.deepEqual(diagram, {
    type: 'mdxJsxFlowElement',
    name: 'Mermaid',
    attributes: [{ type: 'mdxJsxAttribute', name: 'chart', value: chart }],
    children: [],
  });
  assert.equal(yaml.type, 'code');
  assert.equal(yaml.lang, 'yaml');
});
