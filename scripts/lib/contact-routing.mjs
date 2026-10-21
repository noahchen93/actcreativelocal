// Keep contact wording and analytics labels aligned with the actual destination.
// Operate on complete anchors so changing an href cannot leave stale button text.
export function normalizeEmailFirstAnchor(anchor) {
  const parts = anchor.match(/^(<a\b[^>]*>)([\s\S]*)(<\/a>)$/i);
  if (!parts) return anchor;
  let [, tag, content, close] = parts;
  if (!/class="[^"]*\b(?:button|nav-cta)\b/.test(tag)) return anchor;
  if (/data-act-whatsapp-preserve="true"/.test(tag)) return anchor;
  tag = tag.replace(/href="(https:\/\/wa\.me\/6584515268[^"]*)"/, (_, href) => {
    const url = new URL(href.replaceAll('&amp;', '&'));
    const params = new URLSearchParams({
      subject: 'Project inquiry — ACT Creative',
      body: url.searchParams.get('text') || 'Hi ACT Creative, I would like to discuss a project.',
    });
    return `href="mailto:contact@actcreative.net?${params.toString().replaceAll('&', '&amp;')}"`;
  });
  if (/href="mailto:contact@actcreative\.net(?:[?"])/i.test(tag)) {
    // Replace text nodes only, not nested element attributes or icons.
    content = content.split(/(<[^>]*>)/g).map(part => part.startsWith('<') ? part : part
      .replace(/\bon WhatsApp\b/gi, 'by email')
      .replace(/\bvia WhatsApp\b/gi, 'by email')
      .replace(/\bWhatsApp\b/gi, 'Email')).join('');
    tag = tag.replace(/data-act-label="([^"]*)"/g, (_, label) =>
      `data-act-label="${label.replace(/whatsapp/gi, 'email')}"`);
  }
  return tag + content + close;
}
