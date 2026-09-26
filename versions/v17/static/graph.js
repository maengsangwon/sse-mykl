(function(){'use strict';
const $=id=>document.getElementById(id),E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),K=knowledgeGraph;
const kinds={candidate:'기업 후보·검토',type:'유형',region:'지역',metric:'지표',source:'출처'};
let all=[],linkedIds=new Set(),meta,multi,map,detail,nodes=[],shown=[],currentId,selection,searchPage=0,nodePage=0,ticket=0,zoom=1,trail=[];
const pageSize=12, searchSize=20;
function status(s){$('graph-status').textContent=s;}
function search(){const q=$('graph-q').value.trim().replace(/\s/g,'').toLowerCase(),type=$('graph-type').value;
 const result=all.filter(o=>(!q||(o.name+o.code).replace(/\s/g,'').toLowerCase().includes(q))&&(!type||o.types.includes(type))&&(!$('has-links').checked||linkedIds.has(o.id)));
 $('search-count').textContent=`${result.length.toLocaleString('ko-KR')}개 조직그룹 · ${searchPage+1}/${Math.max(1,Math.ceil(result.length/searchSize))}쪽`;
 $('graph-results').innerHTML=result.slice(searchPage*searchSize,(searchPage+1)*searchSize).map(o=>`<button type="button" data-org="${o.id}" aria-pressed="${currentId===o.id}"><b>${E(o.name)}</b><small>${E(o.region)} · ${E(o.types.join(' / '))}<br>${E(o.code)}</small></button>`).join('')||'<p>조건에 맞는 조직이 없습니다. 검색어 또는 필터를 바꿔 보세요.</p>';
 $('search-prev').disabled=!searchPage;$('search-next').disabled=(searchPage+1)*searchSize>=result.length;
}
async function select(id,push=true){const mine=++ticket;status('조직의 관계와 근거를 불러오고 있습니다.');$('graph-stage').setAttribute('aria-busy','true');$('graph-retry').hidden=true;
 try{const d=await dataverseData.detail(id);if(mine!==ticket)return;if(push&&currentId&&currentId!==id)trail.push(currentId);currentId=id;detail=d;nodes=K.build(d,multi.rows,map,meta);nodePage=0;selection=null;zoom=1;
 const url=new URL(location.href);url.searchParams.set('org',id);history.replaceState(null,'',url.pathname+url.search);$('graph-back').disabled=!trail.length;
 $('center-title').textContent=d.organization.name;render();showCenter();search();status(`${d.organization.name}의 관계 ${nodes.length}개를 불러왔습니다.`);
 }catch(e){if(mine===ticket){status('자료를 불러오지 못했습니다. '+e.message);$('graph-retry').hidden=false;$('graph-retry').onclick=()=>select(id,push);}}
 finally{if(mine===ticket)$('graph-stage').removeAttribute('aria-busy');}
}
function render(){if(!detail)return;const filter=$('graph-kind').value,filtered=nodes.filter(n=>!filter||n.kind===filter);nodePage=Math.min(nodePage,Math.max(0,Math.ceil(filtered.length/pageSize)-1));shown=filtered.slice(nodePage*pageSize,(nodePage+1)*pageSize);
 const counts=Object.keys(kinds).map(k=>`${kinds[k]} ${nodes.filter(n=>n.kind===k).length}`).join(' · ');
 $('graph-summary').textContent=counts; $('node-count').textContent=`${filtered.length?nodePage*pageSize+1:0}–${Math.min((nodePage+1)*pageSize,filtered.length)} / ${filtered.length}개 관계`;
 $('node-prev').disabled=!nodePage;$('node-next').disabled=(nodePage+1)*pageSize>=filtered.length;
 const positions=shown.map((n,i)=>{const a=-Math.PI/2+2*Math.PI*i/Math.max(shown.length,1);return {x:450+310*Math.cos(a),y:290+210*Math.sin(a)};});
 const lines=shown.map((n,i)=>`<g class="${n.style}"><line x1="450" y1="290" x2="${positions[i].x}" y2="${positions[i].y}"/><line class="edge-hit" data-node="${i}" x1="450" y1="290" x2="${positions[i].x}" y2="${positions[i].y}"><title>${E(n.label+' · '+n.name)}</title></line></g>`).join('');
 const clip=s=>s.length>13?s.slice(0,12)+'…':s;
 const shape=(x,y,name,label,i,center=false)=>`<g class="node ${center?'center':''}" role="button" tabindex="0" aria-label="${E(label+' · '+name)}" ${center?'data-center="true"':`data-node="${i}"`} transform="translate(${x},${y})"><title>${E(name)}</title><rect x="-92" y="-29" width="184" height="58" rx="16"/><text class="kind" text-anchor="middle" y="-7">${E(label)}</text><text text-anchor="middle" y="14">${E(clip(name))}</text></g>`;
 $('graph-svg').innerHTML='<title>선택한 조직의 관계 그래프. 아래 관계 목록에서도 같은 내용을 선택할 수 있습니다.</title>'+lines+shown.map((n,i)=>shape(positions[i].x,positions[i].y,n.name,n.label,i)).join('')+shape(450,290,detail.organization.name,'중심 조직',0,true);
 $('graph-list').innerHTML=shown.map((n,i)=>`<button data-node="${i}" aria-pressed="${selection===n.key}">${E(n.label)} · ${E(n.name)}</button>`).join('')||'<p>이 분류에 해당하는 관계가 없습니다. 미확보는 실제 관계가 없다는 뜻이 아닙니다.</p>';applyZoom();
}
function applyZoom(){const w=900/zoom,h=580/zoom;$('graph-svg').setAttribute('viewBox',`${450-w/2} ${290-h/2} ${w} ${h}`);$('zoom-label').textContent=Math.round(zoom*100)+'%';}
function showCenter(){if(!detail)return;const o=detail.organization;$('graph-detail').innerHTML=`<h2>${E(o.name)}</h2><p>${E(o.code)} · ${E(o.region)} · ${E(o.types.join(' / '))}</p><p>${E(o.summary||'수록 자료의 관계를 확인해 보세요.')}</p><p>주변 노드나 연결선, 아래 관계 목록을 선택하면 근거가 나타납니다. 기업 후보를 선택한 뒤 중심을 옮겨 계속 탐색할 수 있습니다.</p><a href="/?org=${o.id}#search">조직 상세·공시 원문 보기 →</a><a href="/versions/v17/multistatus.html?q=${encodeURIComponent(o.name)}">복수 지위 목록 →</a>`;}
function showNode(i){const n=shown[i];if(!n)return;selection=n.key;for(const b of $('graph-list').querySelectorAll('button'))b.setAttribute('aria-pressed',String(Number(b.dataset.node)===i));const box=$('graph-detail');
 box.innerHTML=`<p class="eyebrow">${E(kinds[n.kind])} · ${E(n.label)}</p><h2>${E(n.name)}</h2><p>${E(n.description||'')}</p>`;
 if(n.kind==='candidate'){const r=n.review;box.insertAdjacentHTML('beforeend',`<p><b>검토 상태: ${E(n.label)}</b><br>${E(r.pair)} · ${E(n.other.region)}</p><p>${E(r.summary)}</p><h3>탐지 근거</h3><pre>${E(r.evidence||'추가 근거 미기재')}</pre><p>후보 연결을 이어서 탐색해도 같은 기업으로 확정하거나 합치지 않습니다. 동일기업 확인과 현재 자격의 동시 유효성도 별개입니다.</p><button id="recenter" type="button">이 조직 중심으로 펼치기</button><br><a href="/versions/v17/compare.html?a=${currentId}&b=${n.other.id}">두 조직 비교 →</a><a href="/?org=${n.other.id}#search">후보 조직 상세·출처 →</a><a href="/?org=${currentId}#search">중심 조직 상세·출처 →</a>`);$('recenter').onclick=()=>select(n.other.id);}
 if(n.kind==='region')box.insertAdjacentHTML('beforeend',`<p>주소에 기록된 지역입니다. 같은 지역의 조직 간 협력 관계를 의미하지 않습니다.</p><a href="/versions/v17/regions.html?region=${encodeURIComponent(n.name)}">이 지역 분포 살펴보기 →</a>`);
 if(n.records){box.insertAdjacentHTML('beforeend',`<p>원본 관측 ${n.records.length}건 · 반복 관측을 보존합니다. 자격의 현재 유효성은 별도 확인이 필요합니다.</p><div id="graph-records"></div>`);let offset=0;const more=()=>{const target=$('graph-records');target.querySelector('button')?.remove();const part=n.records.slice(offset,offset+20);offset+=part.length;target.insertAdjacentHTML('beforeend',part.map(r=>{const s=r.source||{},metric=r.metric!==undefined;return `<article class="record"><b>${E(metric?meta.metrics[r.metric]?.name:r.type)}</b><br>${metric?`원문 값 ${E(r.original??'미기재')} · ${E(r.unit||'단위 미확인')}<br>실적연도 ${E(r.year??'미확인')} / 보고연도 ${E(r.reportYear??'미확인')}`:`관측일 ${E(r.observed?.slice(0,10)||'미확인')} · ${E(r.number||'번호 미기재')}<br>시작일 ${E(r.from?.slice(0,10)||'미확인')} / 종료일 ${E(r.to?.slice(0,10)||'미확인')}`}<br>출처: ${E(s.file||'미기재')} · ${E(s.sheet||'시트 미기재')} · ${E(s.row??'미확인')}행<br>자료 기준일 ${E(s.date?.slice(0,10)||'미확인')} · 제공기관 ${E(s.provider||'미기재')}</article>`;}).join(''));if(offset<n.records.length){const b=document.createElement('button');b.textContent=`관측 더 보기 (${offset}/${n.records.length})`;b.onclick=more;target.append(b);}};more();}
 status(n.name+' · '+n.label+'의 근거를 표시했습니다.');
}
function activate(e){const node=e.target.closest('[data-node]');if(node)showNode(Number(node.dataset.node));else if(e.target.closest('[data-center]'))showCenter();}
$('graph-svg').onclick=activate;$('graph-list').onclick=activate;$('graph-svg').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate(e);}};
$('graph-results').onclick=e=>{const b=e.target.closest('[data-org]');if(b)select(b.dataset.org);};
$('graph-form').onsubmit=e=>{e.preventDefault();searchPage=0;search();};for(const id of ['graph-type','has-links'])$(id).onchange=()=>{searchPage=0;search();};
$('search-prev').onclick=()=>{searchPage--;search();};$('search-next').onclick=()=>{searchPage++;search();};
$('node-prev').onclick=()=>{nodePage--;render();};$('node-next').onclick=()=>{nodePage++;render();};$('graph-kind').onchange=()=>{nodePage=0;selection=null;render();showCenter();};
$('zoom-in').onclick=()=>{zoom=Math.min(1.8,zoom+.2);applyZoom();};$('zoom-out').onclick=()=>{zoom=Math.max(.6,zoom-.2);applyZoom();};$('zoom-reset').onclick=()=>{zoom=1;applyZoom();};
$('graph-back').onclick=()=>{const id=trail.pop();if(id)select(id,false);};
async function init(){try{[all,meta,multi]=await Promise.all([dataverseData.organizations(),dataverseData.meta(),dataverseData.multistatus()]);map=new Map(all.map(o=>[o.id,o]));linkedIds=new Set(multi.rows.flatMap(r=>[r.a,r.b]));for(const t of meta.types)$('graph-type').add(new Option(t,t));$('graph-sync').textContent='Dataverse 실제 공개 자료 · 마지막 동기화 '+new Date(meta.retrievedAt).toLocaleString('ko-KR')+' · 실시간 조회가 아니며 다음 동기화·게시 때 갱신됩니다.';search();const id=new URLSearchParams(location.search).get('org');const example=all.find(o=>o.name.includes('편안한집')&&linkedIds.has(o.id));if(id&&!map.has(id)){status('주소의 조직 ID를 찾지 못했습니다. 왼쪽 검색에서 조직을 선택해 주세요.');return;}await select(id||example?.id||all[0]?.id);}catch(e){status(e.message);$('graph-retry').hidden=false;$('graph-retry').onclick=()=>location.reload();}}
init();
})();
