/* Experimental WebMCP enhancement: public facts only; normal browsing is unchanged. */
(() => {
  let context;
  try {
    // Current draft uses Document; earlier Chromium experiments used Navigator.
    context = [document.modelContext, navigator.modelContext].find(value => typeof value?.registerTool === 'function');
  } catch { return; }
  if (!context) return;

  const reply = (value, isError = false) => ({ content: [{ type: 'text', text: JSON.stringify(value) }], ...(isError ? { isError: true } : {}) });
  let catalogPromise;
  const loadCatalog = () => {
    if (!catalogPromise) {
      catalogPromise = fetch('/ai/catalog.json', { credentials: 'omit', redirect: 'error', headers: { Accept: 'application/json' } })
        .then(response => {
          if (!response.ok) throw new Error('Service directory unavailable');
          return response.json();
        }).then(data => {
          if (!Array.isArray(data.services) || !data.services.length) throw new Error('Invalid service directory');
          return data;
        }).catch(error => { catalogPromise = undefined; throw error; });
    }
    return catalogPromise;
  };
  const tool = {
    name: 'actcreative_get_services',
    description: 'Look up ACT Creative Singapore production services, source pages, case evidence and brief-builder links. Returns publisher-provided facts only; no quotation, booking or message is sent.',
    inputSchema: {
      type: 'object',
      properties: {
        serviceId: { type: 'string', description: 'Optional exact service ID from the directory; omit to list all services.' },
        language: { type: 'string', enum: ['en', 'zh-Hans'], description: 'Output language. Defaults to the current page language.' },
      },
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true },
    async execute(input = {}) {
      if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).some(key => !['serviceId', 'language'].includes(key))) return reply({ error: 'Only serviceId and language are supported.' }, true);
      const { serviceId, language = document.documentElement.lang.startsWith('zh') ? 'zh-Hans' : 'en' } = input;
      if (!['en', 'zh-Hans'].includes(language) || (serviceId !== undefined && (typeof serviceId !== 'string' || !/^[a-z0-9-]{1,80}$/.test(serviceId)))) return reply({ error: 'Invalid service ID or language.' }, true);
      try {
        const catalog = await loadCatalog();
        const selected = serviceId ? catalog.services.filter(service => service.id === serviceId) : catalog.services;
        if (!selected.length) return reply({ error: 'Unknown service ID.', directory: '/ai/catalog.json' }, true);
        return reply({
          publisher: catalog.publisher, source: 'https://actcreative.net/ai/catalog.json', updated: catalog.updated,
          language, serviceArea: catalog.serviceArea, limitations: catalog.limitations,
          effect: 'Public information only. Opening a brief-builder link does not send an inquiry.',
          services: selected.map(service => {
            const page = service.pages[language] || service.pages.en;
            return { id: service.id, businessRole: service.businessRole, projectFit: service.projectFit[language], ...page, evidence: service.evidence, briefUrl: service.inquiry.briefUrls[language] };
          }),
        });
      } catch { return reply({ error: 'Service directory temporarily unavailable.', fallback: 'https://actcreative.net/llms.txt' }, true); }
    },
  };
  try {
    // Permission restrictions or API changes must not break the human-facing site.
    Promise.resolve(context.registerTool(tool)).catch(() => {});
  } catch { /* Unsupported registration leaves the ordinary site intact. */ }
})();
