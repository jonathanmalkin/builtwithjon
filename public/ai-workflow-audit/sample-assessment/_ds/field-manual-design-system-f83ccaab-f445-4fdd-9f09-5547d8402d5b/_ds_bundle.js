/* @ds-bundle: {"format":3,"namespace":"FieldManualDesignSystem_f83cca","components":[{"name":"Bridge","sourcePath":"components/core/Bridge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Callout","sourcePath":"components/core/Callout.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"ColorStrip","sourcePath":"components/core/ColorStrip.jsx"},{"name":"DispositionTag","sourcePath":"components/core/DispositionTag.jsx"},{"name":"SectionHeader","sourcePath":"components/core/SectionHeader.jsx"},{"name":"StatCard","sourcePath":"components/core/StatCard.jsx"}],"sourceHashes":{"components/core/Bridge.jsx":"1841dbb28d2c","components/core/Button.jsx":"41360fa77aeb","components/core/Callout.jsx":"cd126baee13e","components/core/Card.jsx":"b35711c5c887","components/core/ColorStrip.jsx":"c7b87a022b2d","components/core/DispositionTag.jsx":"f871f7063846","components/core/SectionHeader.jsx":"e82822690865","components/core/StatCard.jsx":"a1762866271d"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.FieldManualDesignSystem_f83cca = window.FieldManualDesignSystem_f83cca || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Bridge.jsx
try { (() => {
(function () {
  if (typeof document === 'undefined') return;
  if (document.getElementById('ucl-bridge-css')) return;
  const s = document.createElement('style');
  s.id = 'ucl-bridge-css';
  s.textContent = `
    .ucl-bridge { background: var(--ucl-ink, #1B1813); color: var(--ucl-paper, #F6F2E9); border-radius: 7px; padding: 26px 22px; }
    .ucl-bridge__eyebrow { font-family: var(--ucl-mono, "IBM Plex Mono", monospace); font-size: 11px; letter-spacing: .16em; text-transform: uppercase; color: #B9AE96; margin-bottom: 8px; }
    .ucl-bridge__hed { font-family: var(--ucl-serif, "Newsreader", serif); font-weight: 500; font-size: clamp(20px, 4vw, 26px); line-height: 1.14; letter-spacing: -.01em; margin: 0 0 10px; }
    .ucl-bridge__body { font-family: var(--ucl-sans, "Archivo", sans-serif); font-size: 14px; line-height: 1.55; color: #D8CFBC; margin: 0 0 18px; }
    .ucl-bridge__row { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
    .ucl-bridge__subline { font-family: var(--ucl-mono, "IBM Plex Mono", monospace); font-size: 11px; color: #9C927D; }
    .ucl-bridge__cta { font-family: var(--ucl-mono, "IBM Plex Mono", monospace); font-size: 13px; font-weight: 500; letter-spacing: .02em; background: var(--ucl-paper, #F6F2E9); color: var(--ucl-ink, #1B1813); border: none; padding: 9px 18px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: background .14s ease; }
    .ucl-bridge__cta:hover { background: #fff; }
    .ucl-bridge__cta .ucl-btn-arrow { display: inline-block; transition: transform .14s ease; }
    .ucl-bridge__cta:hover .ucl-btn-arrow { transform: translateX(3px); }
  `;
  document.head.appendChild(s);
})();
function Bridge({
  eyebrow = 'The bridge',
  headline,
  body,
  ctaLabel = 'Get Your Audit',
  subline,
  onCtaClick
}) {
  return React.createElement('div', {
    className: 'ucl-bridge'
  }, eyebrow && React.createElement('div', {
    className: 'ucl-bridge__eyebrow'
  }, eyebrow), headline && React.createElement('h4', {
    className: 'ucl-bridge__hed'
  }, headline), body && React.createElement('p', {
    className: 'ucl-bridge__body'
  }, body), React.createElement('div', {
    className: 'ucl-bridge__row'
  }, React.createElement('button', {
    className: 'ucl-bridge__cta',
    onClick: onCtaClick
  }, ctaLabel, React.createElement('span', {
    className: 'ucl-btn-arrow'
  }, '→')), subline && React.createElement('span', {
    className: 'ucl-bridge__subline'
  }, subline)));
}
Object.assign(__ds_scope, { Bridge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Bridge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
(function () {
  if (typeof document === 'undefined') return;
  if (document.getElementById('ucl-btn-css')) return;
  var s = document.createElement('style');
  s.id = 'ucl-btn-css';
  s.textContent = '.ucl-btn{display:inline-flex;align-items:center;gap:6px;font-family:var(--ucl-mono,"IBM Plex Mono",monospace);font-weight:500;letter-spacing:.02em;border-radius:4px;border:1px solid;cursor:pointer;transition:background .14s ease,color .14s ease;line-height:1}.ucl-btn--md{font-size:13px;padding:9px 18px}.ucl-btn--sm{font-size:12px;padding:6px 13px}.ucl-btn--lg{font-size:14px;padding:11px 22px}.ucl-btn--primary{background:var(--ucl-ink,#1B1813);color:var(--ucl-paper,#F6F2E9);border-color:var(--ucl-ink,#1B1813)}.ucl-btn--primary:hover:not(:disabled){background:#000;border-color:#000}.ucl-btn--ghost{background:transparent;color:var(--ucl-ink,#1B1813);border-color:var(--ucl-ink,#1B1813)}.ucl-btn--ghost:hover:not(:disabled){background:var(--ucl-ink,#1B1813);color:var(--ucl-paper,#F6F2E9)}.ucl-btn--paper{background:var(--ucl-paper,#F6F2E9);color:var(--ucl-ink,#1B1813);border-color:var(--ucl-paper,#F6F2E9)}.ucl-btn--paper:hover:not(:disabled){background:#fff}.ucl-btn:disabled{opacity:.45;cursor:not-allowed}.ucl-btn .ucl-arrow{display:inline-block;transition:transform .14s ease}.ucl-btn:hover:not(:disabled) .ucl-arrow{transform:translateX(3px)}';
  document.head.appendChild(s);
})();
function Button(props) {
  var variant = props.variant || 'primary';
  var size = props.size || 'md';
  var cls = ['ucl-btn', 'ucl-btn--' + variant, 'ucl-btn--' + size, props.className || ''].filter(Boolean).join(' ');
  return React.createElement('button', {
    className: cls,
    onClick: props.onClick,
    disabled: props.disabled || false
  }, props.children, props.showArrow ? React.createElement('span', {
    className: 'ucl-arrow'
  }, '\u2192') : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Callout.jsx
try { (() => {
(function () {
  if (typeof document === 'undefined') return;
  if (document.getElementById('ucl-callout-css')) return;
  const s = document.createElement('style');
  s.id = 'ucl-callout-css';
  s.textContent = `
    .ucl-callout { border-left: 3px solid var(--ucl-ink, #1B1813); padding: 4px 0 4px 18px; margin: 26px 0; }
    .ucl-callout:first-child { margin-top: 0; }
    .ucl-callout__lbl { font-family: var(--ucl-mono, "IBM Plex Mono", monospace); font-size: 10.5px; letter-spacing: .16em; text-transform: uppercase; color: var(--ucl-ink-3, #8B8475); margin-bottom: 4px; }
    .ucl-callout__big { font-family: var(--ucl-serif, "Newsreader", serif); font-weight: 500; font-size: clamp(24px, 5vw, 30px); line-height: 1.12; color: var(--ucl-ink, #1B1813); }
    .ucl-callout__attr { font-family: var(--ucl-mono, "IBM Plex Mono", monospace); font-size: 10px; color: var(--ucl-ink-3, #8B8475); letter-spacing: .04em; margin-top: 5px; }
  `;
  document.head.appendChild(s);
})();
function Callout({
  label,
  stat,
  attribution,
  className = ''
}) {
  return React.createElement('div', {
    className: ['ucl-callout', className].filter(Boolean).join(' ')
  }, label && React.createElement('div', {
    className: 'ucl-callout__lbl'
  }, label), React.createElement('div', {
    className: 'ucl-callout__big'
  }, stat), attribution && React.createElement('div', {
    className: 'ucl-callout__attr'
  }, attribution));
}
Object.assign(__ds_scope, { Callout });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Callout.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
(function () {
  if (typeof document === 'undefined') return;
  if (document.getElementById('ucl-card-css')) return;
  const s = document.createElement('style');
  s.id = 'ucl-card-css';
  s.textContent = `
    .ucl-card {
      background: var(--ucl-paper-card, #FFFDF8);
      border: 1px solid var(--ucl-line-2, #D2C9B5);
      border-radius: 6px; padding: 17px 17px 15px;
      cursor: pointer; display: flex; flex-direction: column; gap: 0;
      transition: border-color .14s ease, transform .14s ease, box-shadow .14s ease;
      text-align: left;
    }
    .ucl-card:hover { border-color: var(--ucl-ink, #1B1813); transform: translateY(-2px); box-shadow: 0 16px 30px -22px rgba(40,33,20,.55); }
    .ucl-card__meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 9px; }
    .ucl-card__id { font-family: var(--ucl-mono, "IBM Plex Mono", monospace); font-size: 10px; color: var(--ucl-ink-3, #8B8475); }
    .ucl-card__freq { font-family: var(--ucl-mono, "IBM Plex Mono", monospace); font-size: 10px; color: var(--ucl-ink-3, #8B8475); }
    .ucl-card__name { font-family: var(--ucl-serif, "Newsreader", serif); font-size: 16px; font-weight: 500; letter-spacing: -.01em; line-height: 1.2; color: var(--ucl-ink, #1B1813); margin-bottom: 6px; }
    .ucl-card__pain { font-family: var(--ucl-serif, "Newsreader", serif); font-size: 13px; font-style: italic; color: var(--ucl-ink-2, #5A5347); line-height: 1.42; flex: 1; margin-bottom: 12px; }
    .ucl-card__footer { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
    .ucl-card__dots { display: flex; gap: 3px; }
    .ucl-card__dot { width: 7px; height: 7px; border-radius: 50%; border: 1px solid var(--ucl-line-2, #D2C9B5); background: transparent; }
    .ucl-card__dot--filled { background: var(--ucl-ink, #1B1813); border-color: var(--ucl-ink, #1B1813); }
    .ucl-card__tags { display: flex; gap: 5px; flex-wrap: wrap; }
  `;
  document.head.appendChild(s);
})();
function Card({
  id,
  name,
  painLine,
  dispositions = [],
  frequency,
  automationLevel = 0,
  onClick,
  children
}) {
  return React.createElement('div', {
    className: 'ucl-card',
    onClick: onClick
  }, React.createElement('div', {
    className: 'ucl-card__meta'
  }, React.createElement('span', {
    className: 'ucl-card__id'
  }, id), frequency && React.createElement('span', {
    className: 'ucl-card__freq'
  }, frequency)), React.createElement('div', {
    className: 'ucl-card__name'
  }, name), painLine && React.createElement('div', {
    className: 'ucl-card__pain'
  }, painLine), children, React.createElement('div', {
    className: 'ucl-card__footer'
  }, React.createElement('div', {
    className: 'ucl-card__dots'
  }, [1, 2, 3, 4, 5].map(function (n) {
    return React.createElement('div', {
      key: n,
      className: 'ucl-card__dot' + (n <= automationLevel ? ' ucl-card__dot--filled' : '')
    });
  })), React.createElement('div', {
    className: 'ucl-card__tags'
  }, dispositions.map(function (d, i) {
    const colors = {
      eliminate: ['#BB3A2B', '#F6E3DE', '#E7C0B8'],
      simplify: ['#A96A11', '#F6E9D2', '#E7CF9F'],
      automate: ['#2D5AA6', '#E1E8F5', '#C0CFEA'],
      optimize: ['#6A45A0', '#EBE4F4', '#D2C3E8'],
      report: ['#297150', '#DEEBE0', '#BBD7C0']
    }[d] || ['#888', '#eee', '#ccc'];
    return React.createElement('span', {
      key: i,
      style: {
        fontFamily: 'var(--ucl-mono,"IBM Plex Mono",monospace)',
        fontSize: '10px',
        fontWeight: 500,
        letterSpacing: '.05em',
        textTransform: 'uppercase',
        padding: '3px 6px',
        borderRadius: '3px',
        border: '1px solid',
        color: colors[0],
        background: colors[1],
        borderColor: colors[2],
        lineHeight: 1
      }
    }, d.charAt(0).toUpperCase() + d.slice(1));
  }))));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/ColorStrip.jsx
try { (() => {
(function () {
  if (typeof document === 'undefined') return;
  if (document.getElementById('ucl-color-strip-css')) return;
  const s = document.createElement('style');
  s.id = 'ucl-color-strip-css';
  s.textContent = `
    .ucl-strip { display: flex; gap: 3px; }
    .ucl-strip i { height: 6px; border-radius: 1px; display: block; min-width: 12px; }
    .ucl-strip--eliminate { background: var(--ucl-eliminate, #BB3A2B); }
    .ucl-strip--simplify  { background: var(--ucl-simplify,  #A96A11); }
    .ucl-strip--automate  { background: var(--ucl-automate,  #2D5AA6); }
    .ucl-strip--optimize  { background: var(--ucl-optimize,  #6A45A0); }
    .ucl-strip--report    { background: var(--ucl-report,    #297150); }
  `;
  document.head.appendChild(s);
})();
function ColorStrip({
  dispositions = [],
  className = ''
}) {
  const total = dispositions.reduce(function (a, d) {
    return a + (d.weight || 1);
  }, 0);
  return React.createElement('div', {
    className: ['ucl-strip', className].filter(Boolean).join(' ')
  }, dispositions.map(function (d, i) {
    const pct = (d.weight || 1) / total * 100;
    return React.createElement('i', {
      key: i,
      className: 'ucl-strip--' + d.disposition,
      style: {
        flex: pct + ' 0 0'
      }
    });
  }));
}
Object.assign(__ds_scope, { ColorStrip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ColorStrip.jsx", error: String((e && e.message) || e) }); }

// components/core/DispositionTag.jsx
try { (() => {
(function () {
  if (typeof document === 'undefined') return;
  if (document.getElementById('ucl-disposition-tag-css')) return;
  const s = document.createElement('style');
  s.id = 'ucl-disposition-tag-css';
  s.textContent = `
    .ucl-tag {
      display: inline-flex; align-items: center; gap: 6px;
      font-family: var(--ucl-mono, "IBM Plex Mono", monospace);
      font-size: 11px; font-weight: 500;
      letter-spacing: .05em; text-transform: uppercase;
      padding: 5px 9px 5px 7px; border-radius: 3px; border: 1px solid;
      line-height: 1; white-space: nowrap;
    }
    .ucl-tag--small { font-size: 10.5px; padding: 4px 7px 4px 6px; }
    .ucl-tag--eliminate { color: var(--ucl-eliminate, #BB3A2B); background: var(--ucl-eliminate-bg, #F6E3DE); border-color: var(--ucl-eliminate-ln, #E7C0B8); }
    .ucl-tag--simplify  { color: var(--ucl-simplify,  #A96A11); background: var(--ucl-simplify-bg,  #F6E9D2); border-color: var(--ucl-simplify-ln,  #E7CF9F); }
    .ucl-tag--automate  { color: var(--ucl-automate,  #2D5AA6); background: var(--ucl-automate-bg,  #E1E8F5); border-color: var(--ucl-automate-ln,  #C0CFEA); }
    .ucl-tag--optimize  { color: var(--ucl-optimize,  #6A45A0); background: var(--ucl-optimize-bg,  #EBE4F4); border-color: var(--ucl-optimize-ln,  #D2C3E8); }
    .ucl-tag--report    { color: var(--ucl-report,    #297150); background: var(--ucl-report-bg,    #DEEBE0); border-color: var(--ucl-report-ln,    #BBD7C0); }
  `;
  document.head.appendChild(s);
})();
const _ICONS = {
  eliminate: '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>',
  simplify: '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6H10M7 3L10 6L7 9" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  automate: '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10 6A4 4 0 1 1 6.5 2.07" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><path d="M7 1L6.5 3L8.5 2.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  optimize: '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 10V3M3.5 5.5L6 3L8.5 5.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  report: '<svg width="12" height="12" viewBox="0 0 12 12"><rect x="1.5" y="7" width="2.5" height="3.5" rx="0.5" fill="currentColor"/><rect x="4.75" y="4.5" width="2.5" height="6" rx="0.5" fill="currentColor"/><rect x="8" y="2" width="2.5" height="8.5" rx="0.5" fill="currentColor"/></svg>'
};
const _LABELS = {
  eliminate: 'Eliminate',
  simplify: 'Simplify',
  automate: 'Automate',
  optimize: 'Optimize',
  report: 'Report'
};
function DispositionTag({
  disposition,
  size = 'full',
  className = ''
}) {
  const cls = ['ucl-tag', `ucl-tag--${disposition}`, size === 'small' ? 'ucl-tag--small' : '', className].filter(Boolean).join(' ');
  return React.createElement('span', {
    className: cls
  }, React.createElement('span', {
    dangerouslySetInnerHTML: {
      __html: _ICONS[disposition]
    },
    style: {
      display: 'inline-flex',
      alignItems: 'center'
    }
  }), _LABELS[disposition]);
}
Object.assign(__ds_scope, { DispositionTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/DispositionTag.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionHeader.jsx
try { (() => {
(function () {
  if (typeof document === 'undefined') return;
  if (document.getElementById('ucl-section-header-css')) return;
  const s = document.createElement('style');
  s.id = 'ucl-section-header-css';
  s.textContent = `
    .ucl-sec-h {
      font-family: var(--ucl-mono, "IBM Plex Mono", monospace);
      font-size: 12px; letter-spacing: .14em; text-transform: uppercase;
      font-weight: 600; color: var(--ucl-ink, #1B1813);
      margin: 34px 0 16px; padding-bottom: 9px;
      border-bottom: 1px solid var(--ucl-ink, #1B1813);
    }
    .ucl-sec-h:first-child { margin-top: 0; }
  `;
  document.head.appendChild(s);
})();
function SectionHeader({
  children,
  className = ''
}) {
  return React.createElement('div', {
    className: ['ucl-sec-h', className].filter(Boolean).join(' ')
  }, children);
}
Object.assign(__ds_scope, { SectionHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionHeader.jsx", error: String((e && e.message) || e) }); }

// components/core/StatCard.jsx
try { (() => {
(function () {
  if (typeof document === 'undefined') return;
  if (document.getElementById('ucl-statcard-css')) return;
  const s = document.createElement('style');
  s.id = 'ucl-statcard-css';
  s.textContent = `
    .ucl-statcard {
      border: 1px solid var(--ucl-ink, #1B1813);
      background: var(--ucl-paper-card, #FFFDF8);
      border-radius: 5px; padding: 20px;
      display: flex; gap: 20px; align-items: flex-start;
    }
    .ucl-statcard__big {
      font-family: var(--ucl-serif, "Newsreader", serif);
      font-weight: 500; font-size: clamp(44px, 8vw, 62px);
      line-height: .88; letter-spacing: -.02em;
      color: var(--ucl-ink, #1B1813); flex-shrink: 0;
    }
    .ucl-statcard__body { display: flex; flex-direction: column; gap: 4px; padding-top: 4px; }
    .ucl-statcard__unit { font-family: var(--ucl-mono, "IBM Plex Mono", monospace); font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--ucl-ink-3, #8B8475); }
    .ucl-statcard__desc { font-family: var(--ucl-sans, "Archivo", sans-serif); font-size: 14px; line-height: 1.5; color: var(--ucl-ink-2, #5A5347); }
    .ucl-statcard__attr { font-family: var(--ucl-mono, "IBM Plex Mono", monospace); font-size: 10px; letter-spacing: .04em; color: var(--ucl-ink-3, #8B8475); }
    .ucl-statcard--qualitative .ucl-statcard__big { font-size: clamp(18px, 3vw, 22px); line-height: 1.18; letter-spacing: -.01em; font-style: italic; font-weight: 400; }
  `;
  document.head.appendChild(s);
})();
function StatCard({
  stat,
  unit,
  description,
  attribution,
  qualitative = false
}) {
  const cls = 'ucl-statcard' + (qualitative ? ' ucl-statcard--qualitative' : '');
  return React.createElement('div', {
    className: cls
  }, React.createElement('div', {
    className: 'ucl-statcard__big'
  }, stat), React.createElement('div', {
    className: 'ucl-statcard__body'
  }, unit && React.createElement('div', {
    className: 'ucl-statcard__unit'
  }, unit), React.createElement('div', {
    className: 'ucl-statcard__desc'
  }, description), attribution && React.createElement('div', {
    className: 'ucl-statcard__attr'
  }, attribution)));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StatCard.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Bridge = __ds_scope.Bridge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Callout = __ds_scope.Callout;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.ColorStrip = __ds_scope.ColorStrip;

__ds_ns.DispositionTag = __ds_scope.DispositionTag;

__ds_ns.SectionHeader = __ds_scope.SectionHeader;

__ds_ns.StatCard = __ds_scope.StatCard;

})();
