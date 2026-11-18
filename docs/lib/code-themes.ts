// Shiki themes for the code frames, built from the landing palette (DESIGN.md) rather than a stock pair:
// ink keys, slate text, faint comments and punctuation, and three quiet hues (rose for quoted strings,
// blue for commands and functions, violet for constants and variables) so YAML and shell read at a
// glance. Status green and pin amber keep their one meaning each and never colour code. Every colour
// clears 4.5:1 on its ground: paper (#ffffff) and night canvas (#111511).

type Palette = {
  ground: string;
  text: string;
  strong: string;
  faint: string;
  string: string;
  command: string;
  constant: string;
};

function theme(name: string, type: 'light' | 'dark', p: Palette) {
  return {
    name,
    type,
    colors: { 'editor.background': p.ground, 'editor.foreground': p.text },
    tokenColors: [
      { settings: { foreground: p.text } },
      { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: p.faint, fontStyle: 'italic' } },
      { scope: ['punctuation', 'meta.brace', 'keyword.operator'], settings: { foreground: p.faint } },
      {
        scope: ['string', 'punctuation.definition.string', 'string.quoted', 'string.template'],
        settings: { foreground: p.string },
      },
      // YAML plain scalars and shell arguments stay text: the string hue is kept for quoted strings.
      {
        scope: ['string.unquoted.plain.out.yaml', 'string.unquoted.plain.in.yaml', 'string.unquoted.argument.shell'],
        settings: { foreground: p.text },
      },
      {
        scope: ['entity.name.tag', 'support.type.property-name', 'meta.object-literal.key', 'variable.other.property'],
        settings: { foreground: p.strong },
      },
      { scope: ['keyword', 'storage', 'keyword.control'], settings: { foreground: p.strong } },
      {
        scope: ['entity.name.function', 'support.function', 'entity.name.command', 'support.function.builtin'],
        settings: { foreground: p.command },
      },
      {
        scope: [
          'constant',
          'constant.numeric',
          'constant.language',
          'constant.other.option',
          'variable',
          'variable.other',
          'variable.parameter',
          'punctuation.definition.variable',
        ],
        settings: { foreground: p.constant },
      },
    ],
  };
}

export const codeLight = theme('badil-light', 'light', {
  ground: '#ffffff',
  text: '#4b5158',
  strong: '#111315',
  faint: '#6b7178',
  string: '#a3245e',
  command: '#1f5aa6',
  constant: '#6941c6',
});

export const codeDark = theme('badil-dark', 'dark', {
  ground: '#111511',
  text: '#b4bdb3',
  strong: '#e8ece7',
  faint: '#848d83',
  string: '#f28ab4',
  command: '#7fb4ff',
  constant: '#b9a3ff',
});
