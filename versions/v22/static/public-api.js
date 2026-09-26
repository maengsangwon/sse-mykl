(function (root) {
  let dataPromise;
  async function records() {
    if (!dataPromise) dataPromise = fetch('/versions/v22/static/demo-data.json').then(r => {
      if (!r.ok) throw new Error('시연 자료를 불러오지 못했습니다. 페이지를 새로고침해주세요.');
      return r.json();
    }).catch(e => { dataPromise = null; throw e; });
    return dataPromise;
  }
  root.publicApi = async function (path) {
    const url = new URL(path, 'https://local.invalid');
    const all = await records();
    if (url.pathname === '/api/catalog') return {
      organizations: all.length,
      disclosures: all.reduce((n, r) => n + new Set(r.disclosures.map(d => d.year)).size, 0),
      regions: [...new Set(all.map(r => r.organization.region))].sort(),
      types: [...new Set(all.flatMap(r => r.organization.types))].sort(), demo: true
    };
    if (url.pathname === '/api/organizations') {
      const p = url.searchParams, page = Math.max(1, Number(p.get('page')) || 1);
      const size = Math.min(50, Math.max(1, Number(p.get('page_size')) || 6));
      const items = all.map(r => ({...r.organization, latest_year: r.disclosures.length ? Math.max(...r.disclosures.map(d => d.year)) : null}))
        .filter(o => (!p.get('q') || o.name.toLowerCase().includes(p.get('q').toLowerCase())) &&
          (!p.get('region') || o.region === p.get('region')) &&
          (!p.get('kind') || o.types.includes(p.get('kind'))) &&
          (p.get('disclosed_only') !== 'true' || o.latest_year !== null))
        .sort((a, b) => a.name.localeCompare(b.name, 'ko') || a.id - b.id);
      return {total: items.length, page, page_size: size, items: items.slice((page-1)*size, page*size)};
    }
    const match = url.pathname.match(/^\/api\/organizations\/(\d+)$/);
    const found = match && all.find(r => r.organization.id === Number(match[1]));
    if (found) return found;
    throw new Error('공개된 조직을 찾을 수 없습니다.');
  };
})(globalThis);
