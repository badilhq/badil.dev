import assert from 'node:assert/strict';
import { test } from 'node:test';
import { groupPages } from './tabs.mjs';

const pages = (tabs) => Object.fromEntries(tabs.map((tab) => [tab.folder, tab.pages]));

test('the v0.23.0 pages fill Guide and Concepts, and an empty Reference is left out', () => {
  assert.deepEqual(pages(groupPages(['architecture', 'contract', 'install'])), {
    '(guide)': ['install'],
    '(concepts)': ['architecture', 'contract'],
  });
});

test('the restructured pages land in their tabs in reading order', () => {
  const slugs = ['api', 'architecture', 'cleanup', 'configuration', 'contract', 'events', 'install', 'operations', 'services'];
  assert.deepEqual(pages(groupPages(slugs)), {
    '(guide)': ['install'],
    '(concepts)': ['architecture', 'contract'],
    '(reference)': ['configuration', 'api', 'events', 'services', 'cleanup', 'operations'],
  });
});

test('a page no tab lists falls into Reference, after the listed ones, sorted', () => {
  const tabs = groupPages(['install', 'zeta', 'api', 'alpha']);
  assert.deepEqual(pages(tabs), { '(guide)': ['install'], '(reference)': ['api', 'alpha', 'zeta'] });
});

test('each tab keeps its title and display order', () => {
  const tabs = groupPages(['operations', 'architecture', 'install']);
  assert.deepEqual(
    tabs.map((tab) => tab.title),
    ['Guide', 'Concepts', 'Reference'],
  );
});
