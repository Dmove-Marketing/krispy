// Tracking do lead no padrão Dmove (modelo: dmove-astro-template).
// Compartilhado entre forms.ts (formulários da página) e WhatsAppPopup, para que todo
// formulário do site envie ao webhook (n8n → Voe) os mesmos campos de tracking.

// Origem do lead a partir dos UTMs/click IDs. Os valores batem com as opções do campo
// "Campanha" do Voe (Meta, Google, LinkedIn, YouTube, TikTok, Pinterest). Sem anúncio = "Orgânico".
export function detectOrigem(tr: Record<string, string>): string {
  const s = (tr.utm_source || '').toLowerCase();
  const m = (tr.utm_medium || '').toLowerCase();
  const organico = /^(social|organic|organico|orgânico|bio|referral|email)$/.test(m) || /bio/.test((tr.utm_content || '').toLowerCase());
  if (tr.gclid || tr.gbraid || tr.wbraid) return 'Google';
  if (tr.ttclid) return 'TikTok';
  if (tr.fbclid) return 'Meta';
  if (!organico) {
    if (/^(google|adwords|googleads|google-ads|gads)$/.test(s)) return 'Google';
    if (/^(meta|facebook|fb|ig|instagram|an|msg|messenger)$/.test(s)) return 'Meta';
    if (/tiktok/.test(s)) return 'TikTok';
    if (/linkedin/.test(s)) return 'LinkedIn';
    if (/youtube/.test(s)) return 'YouTube';
    if (/pinterest/.test(s)) return 'Pinterest';
  }
  return 'Orgânico';
}

// Sinais de tracking enviados como campos próprios no payload (um campo por sinal).
export const trackingParamKeys = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term',
  'utm_content', 'utm_id', 'gclid', 'gbraid', 'wbraid',
  'fbclid', 'ttclid', 'msclkid', 'sck',
  'fbc', 'fbp', 'external_id', 'event_id',
];

// Rótulo de origem do lead ("Fonte" no payload): "Landing page/<slug>", com a raiz como "home".
// Os parâmetros de tracking vão em campos próprios do payload, não no Fonte.
export function getPageSource(pathname: string): string {
  const slug = pathname.replace(/\/$/, '').split('/').filter(Boolean)[0];
  return `Landing page/${slug || 'home'}`;
}

// Monta os campos de tracking do payload: UTMs/click IDs/Meta CAPI separados + landing_page,
// referrer e `origem`. `fbp`/`fbc` são relidos dos cookies no envio: na 1ª visita o Pixel
// cria os cookies depois do UTMCapture rodar.
export function buildTrackingFields(tracking: Record<string, string>): Record<string, string> {
  const lerCookie = (n: string) => {
    const m = document.cookie.match('(^|;)\\s*' + n + '\\s*=\\s*([^;]+)');
    return m ? decodeURIComponent(m.pop() as string) : '';
  };
  if (!tracking['fbp']) tracking['fbp'] = lerCookie('_fbp');
  if (!tracking['fbc']) tracking['fbc'] = lerCookie('_fbc');

  const campos: Record<string, string> = {};
  [...trackingParamKeys, 'landing_page', 'referrer'].forEach((k) => {
    if (tracking[k]) campos[k] = tracking[k];
  });
  campos.origem = detectOrigem(tracking);
  return campos;
}
