(function(root){'use strict';
const categories=['공지사항','입찰','지원사업','채용','교육','행사','보도자료','자료실'];
function search(data,p={}){const query=(p.query||'').normalize('NFKC').toLowerCase().trim(),words=query.split(/\s+/).filter(Boolean),byInst=Object.fromEntries(data.institutions.map(i=>[i.id,i]));
 if(p.date_from&&p.date_to&&p.date_from>p.date_to)throw Error('시작일은 종료일보다 늦을 수 없습니다.');
 const items=data.notices.filter(n=>{const inst=byInst[n.institution];const text=[n.title,n.excerpt,inst?.name,n.category].join(' ').normalize('NFKC').toLowerCase();return (!p.institution||n.institution===p.institution)&&(!p.category||n.category===p.category)&&(!p.board||n.board===p.board)&&(!p.type||inst?.types.includes(p.type))&&(!p.date_from||n.date&&n.date>=p.date_from)&&(!p.date_to||n.date&&n.date<=p.date_to)&&words.every(w=>text.includes(w));}).sort((a,b)=>(b.date||'').localeCompare(a.date||'')||a.id.localeCompare(b.id));
 return {items,total:items.length};}
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function card(n,data){const i=data.institutions.find(x=>x.id===n.institution),s=data.sources.find(x=>x.id===n.board);let url;try{url=new URL(n.url);if(url.protocol!=='https:')throw Error();}catch{return '';}
return `<article class="notice-card"><p class="notice-meta"><span>${E(n.category)}</span> ${E(i?.name)} · <time>${E(n.date||'게시일 미확인')}</time>${n.pinned?' · 원문 고정공지':''}</p><h3><a href="${E(url.href)}" target="_blank" rel="noopener noreferrer">${E(n.title)} <span class="notice-external" aria-label="새 창">↗</span></a></h3>${n.excerpt?`<p>${E(n.excerpt)}</p>`:''}<p class="notice-foot">${E(s?.name)} · 상세·첨부·신청은 기관 원문에서 확인 <a href="${E(url.href)}" target="_blank" rel="noopener noreferrer">원문 보기 ↗</a></p></article>`;}
const api={search,card,categories,E};if(typeof module!=='undefined')module.exports=api;root.noticeEngine=api;
})(typeof window==='undefined'?globalThis:window);
