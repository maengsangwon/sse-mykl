(() => {
'use strict';
const $=id=>document.getElementById(id),cards=[...document.querySelectorAll('.int-reference')];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cases=window.INTERNATIONAL_CASES;
if(!cards.length||!Array.isArray(cases))return;
document.querySelectorAll('.int-enhance').forEach(e=>e.hidden=false);
const q=$('ref-query'),kind=$('ref-kind'),org=$('ref-org');
function search(update=true){
 const words=q.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);let n=0;
 cards.forEach(c=>{const match=words.every(w=>c.dataset.search.toLocaleLowerCase().includes(w))&&(!kind.value||c.dataset.kind===kind.value)&&(!org.value||c.dataset.org===org.value);c.hidden=!match;n+=Number(match);});
 $('ref-count').textContent=n+' / '+cards.length+'개 자료';$('ref-empty').hidden=n!==0;
 if(update){const url=new URL(location.href);for(const [key,value]of [['q',q.value.trim()],['kind',kind.value],['org',org.value]])value?url.searchParams.set(key,value):url.searchParams.delete(key);history.replaceState(null,'',url);}
}
function restore(){const p=new URLSearchParams(location.search);q.value=p.get('q')||'';kind.value=p.get('kind')||'';org.value=p.get('org')||'';search(false);}
q.addEventListener('input',()=>search());kind.addEventListener('change',()=>search());org.addEventListener('change',()=>search());
$('ref-reset').addEventListener('click',()=>{q.value=kind.value=org.value='';search();q.focus();});
function revealReference(){if(!location.hash.startsWith('#ref-'))return;const card=cards.find(c=>'#'+c.id===location.hash);if(card){q.value=kind.value=org.value='';search();card.scrollIntoView({block:'start'});}}
document.querySelectorAll('[data-ref]').forEach(a=>a.addEventListener('click',()=>{q.value=kind.value=org.value='';search();}));
window.addEventListener('hashchange',revealReference);window.addEventListener('popstate',()=>{restore();revealReference();});restore();revealReference();
const region=$('country-region');function filterCases(){let n=0;document.querySelectorAll('.int-case').forEach(c=>{c.hidden=!!region.value&&c.dataset.region!==region.value;n+=Number(!c.hidden);});$('case-count').textContent=n+' / '+cases.length+'개 사례';}region.addEventListener('change',filterCases);filterCases();
const a=$('compare-a'),b=$('compare-b');b.value='quebec';
function compare(){const ids=[a.value,b.value],same=a.value===b.value;$('compare-status').textContent=same?'같은 사례를 선택했습니다. 다른 사례를 선택하면 비교할 수 있습니다.':'제도·운영·시사점을 나란히 읽습니다. 성과 순위가 아닙니다.';$('compare-result').innerHTML=(same?[ids[0]]:ids).map(id=>{const c=cases.find(x=>x.id===id);return '<article><p class="int-compare-label">'+esc(c.region)+' · '+esc(c.period)+'</p><h3>'+esc(c.name)+'</h3><dl>'+[['핵심 제도·실천',c.mechanism],['운영 관점',c.governance],['플랫폼 아이디어 · 편집 해석',c.lesson],['해석 범위',c.caution]].map(([k,v])=>'<dt>'+esc(k)+'</dt><dd>'+esc(v)+'</dd>').join('')+'</dl><p><a href="#case-'+esc(c.id)+'">사례와 출처 보기 ↑</a></p></article>';}).join('');}
a.addEventListener('change',compare);b.addEventListener('change',compare);compare();
document.querySelector('#compare-result').addEventListener('click',e=>{if(e.target.closest('a')){region.value='';filterCases();}});
})();
