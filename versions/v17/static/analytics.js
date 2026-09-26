/* Public fictional fixture only. No Dataverse credentials or actual records. */
const Analytics = (() => {
  const latest = (item, year) => item.disclosures.filter(d => d.year === Number(year)).sort((a,b) => b.version-a.version)[0] || null;
  const numeric = value => typeof value === 'number' && Number.isFinite(value);
  const select = (data, region, type) => data.filter(x => (!region || x.organization.region===region) && (!type || x.organization.types.includes(type)));
  function summarize(data, year, key) {
    const rows=data.map(x=>({item:x,current:latest(x,year),previous:latest(x,year-1)}));
    const values=rows.filter(x=>numeric(x.current?.[key]));
    const paired=values.filter(x=>numeric(x.previous?.[key]));
    const before=paired.reduce((s,x)=>s+x.previous[key],0), after=paired.reduce((s,x)=>s+x.current[key],0);
    return {rows,values,paired,before,after,total:values.reduce((s,x)=>s+x.current[key],0),rate:paired.length && before!==0?(after-before)/before*100:null};
  }
  return {latest,numeric,select,summarize};
})();
if(typeof module!=='undefined') module.exports=Analytics;
if(typeof document!=='undefined') {
const el=id=>document.getElementById(id), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>n.toLocaleString('ko-KR'), empty='<p class="analysis-empty">선택 조건에 해당하는 자료가 없습니다.<br>지역·유형을 바꾸거나 조건을 초기화해 보세요.</p>';
let data=[], selected=[], summary;
const region=el('a-region'), type=el('a-type'), year=el('a-year'), indicator=el('a-indicator');
function bars(items,action,unit='개') {
  if(!items.length)return empty;
  const max=Math.max(...items.map(x=>Math.abs(x.value)),1);
  return '<div class="bar-list">'+items.map(x=>`<${action?'button':'div'} class="bar" ${action?`type="button" data-filter="${action}" data-value="${esc(x.name)}" aria-label="${esc(x.name)} ${fmt(x.value)}${unit}, 필터 적용"`:''}><span>${esc(x.name)}</span><span class="bar-track" aria-hidden="true"><span class="bar-fill" style="width:${Math.abs(x.value)/max*100}%"></span></span><b>${fmt(x.value)}${unit}</b></${action?'button':'div'}>`).join('')+'</div>';
}
function distribution(key) {const counts=new Map();for(const x of selected){const names=key==='region'?[x.organization.region]:x.organization.types;for(const n of names)counts.set(n,(counts.get(n)||0)+1);}return [...counts].map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value||a.name.localeCompare(b.name,'ko'));}
function render(){
  selected=Analytics.select(data,region.value,type.value);summary=Analytics.summarize(selected,Number(year.value),indicator.value);
  const n=selected.length, disclosed=summary.rows.filter(x=>x.current).length, multi=selected.filter(x=>x.organization.types.length>1).length, coverage=n?Math.round(summary.values.length/n*100):null;
  const unit=indicator.value==='revenue'?'원':'명', name=indicator.value==='revenue'?'매출액':'종사자 수';
  el('analysis-status').textContent=`${region.value||'전체 지역'} · ${type.value||'전체 유형'} · ${year.value}년 실적 · 가상 조직 ${n}개 선택`;
  el('a-metrics').innerHTML=[['선택한 조직',fmt(n)+'개','가상 조직 ID 기준 · 중복 제외'],['해당 연도 공시',fmt(disclosed)+'개 조직',`${year.value}년 최신 정정본만 반영`],['복수 유형 조직',fmt(multi)+'개','가상 설정 기준 · 실제 자격 판정 아님'],[`${name} 자료 확보율`,coverage===null?'—':coverage+'%',`${summary.values.length} / ${n}개 조직 · 미기재 제외`]].map(x=>`<article><span>${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small></article>`).join('');
  el('region-bars').innerHTML=bars(distribution('region'),'region');el('type-bars').innerHTML=bars(distribution('type'),'type');
  const memberships=selected.reduce((s,x)=>s+x.organization.types.length,0);
  el('analysis-note').textContent=n?`선택한 ${n}개 조직의 유형별 소속을 모두 세면 ${memberships}건입니다. ${multi}개 조직이 복수 유형에 속하기 때문에 유형별 막대의 합과 조직 수는 다를 수 있습니다. 분포는 현재 시연 명부 기준이며 실적연도 선택은 공시 분석에만 적용됩니다.`:'현재 조건에 해당하는 조직이 없습니다. 조건 초기화로 전체 자료를 볼 수 있습니다.';
  el('metric-definition').textContent=`${year.value}년 · ${name} · ${unit} · 값이 있는 ${summary.values.length}개 조직 기준. ${indicator.value==='employees'?'조합원·참여자 수는 포함하지 않습니다.':'결측값은 0으로 대체하지 않습니다.'}`;
  el('value-bars').innerHTML=bars(summary.values.map(x=>({name:x.item.organization.name.replace('[시연] ',''),value:x.current[indicator.value]})).sort((a,b)=>b.value-a.value),null,unit);
  el('year-comparison').innerHTML=summary.paired.length?`<div class="compare-number">${summary.rate===null?'증감률 산출 불가':(summary.rate>0?'+':'')+summary.rate.toFixed(1)+'%'}</div><p>같은 ${summary.paired.length}개 조직의 ${name} 합계 비교 · 가상 자료</p><div class="comparison-values"><div><span>${Number(year.value)-1}년</span><strong>${fmt(summary.before)}${unit}</strong></div><div><span>${year.value}년</span><strong>${fmt(summary.after)}${unit}</strong></div></div><p class="muted">${summary.rate===null?'전년 합계가 0이면 증감률을 계산하지 않습니다.':'(선택 연도 합계 − 전년 합계) ÷ 전년 합계 × 100'}<br>선택 조직 중 ${n-summary.paired.length}개는 두 연도의 값이 모두 확보되지 않아 제외했습니다. 이 변화는 전국의 성장률을 뜻하지 않습니다.</p>`:'<p class="analysis-empty">전년과 선택 연도 모두 값이 있는 조직이 없어 비교할 수 없습니다. 다른 연도를 선택해 보세요.</p>';
  el('coverage').textContent=`${year.value}년 공시가 있는 조직 ${disclosed}/${n}개 · ${name} 값이 있는 조직 ${summary.values.length}/${n}개. 공시 유무와 개별 지표의 확보 여부는 다를 수 있습니다.`;
  el('evidence-rows').innerHTML=summary.rows.map(x=>{const o=x.item.organization,d=x.current;return `<tr><th scope="row">${esc(o.name)}<small>${o.types.map(esc).join(' · ')}</small></th><td>${esc(o.region)}</td><td>${year.value}</td><td>${Analytics.numeric(d?.revenue)?fmt(d.revenue):'자료 없음'}</td><td>${Analytics.numeric(d?.employees)?fmt(d.employees):'자료 없음'}</td><td>${d?`<details><summary>출처 · v${d.version}</summary><p>${esc(d.source)}<br>공개일 ${esc(d.published_at)}<br>${esc(d.correction||'최초 공개본')}<br>실적연도 ${d.year}년 · 가상 공시</p></details>`:'해당 연도 공시 없음'}</td></tr>`;}).join('')||'<tr><td colspan="6">선택 조건에 해당하는 조직이 없습니다.</td></tr>';
  el('download').disabled=!n;
  const params=new URLSearchParams({region:region.value,type:type.value,year:year.value,indicator:indicator.value});history.replaceState(null,'',location.pathname+'?'+params+location.hash);
}
async function load(){el('retry').hidden=true;el('analysis-content').hidden=true;el('analysis-status').textContent='시연 자료를 불러오는 중입니다.';try{const response=await fetch('/versions/v17/static/demo-data.json');if(!response.ok)throw Error('load');data=await response.json();if(!Array.isArray(data)||!data.every(x=>x.organization&&Array.isArray(x.disclosures)))throw Error('format');
  for(const [select,values,label] of [[region,[...new Set(data.map(x=>x.organization.region))].sort(),'전체 지역'],[type,[...new Set(data.flatMap(x=>x.organization.types))].sort(),'전체 유형'],[year,[...new Set(data.flatMap(x=>x.disclosures.map(d=>d.year)))].sort((a,b)=>b-a),null]]){select.replaceChildren();if(label)select.add(new Option(label,''));for(const value of values)select.add(new Option(value,value));}
  const params=new URLSearchParams(location.search);for(const [key,input] of [['region',region],['type',type],['year',year],['indicator',indicator]])if([...input.options].some(x=>x.value===params.get(key)))input.value=params.get(key);
  render();el('analysis-content').hidden=false;
}catch{el('analysis-status').textContent='시연 자료를 불러오지 못했습니다. 연결을 확인하고 다시 시도해 주세요.';el('retry').hidden=false;}}
for(const input of [region,type,year,indicator])input.addEventListener('change',render);
el('filters').addEventListener('submit',e=>e.preventDefault());el('filters').addEventListener('reset',e=>{e.preventDefault();region.value='';type.value='';year.selectedIndex=0;indicator.value='revenue';render();});
el('analysis-content').addEventListener('click',e=>{const button=e.target.closest('[data-filter]');if(button){(button.dataset.filter==='region'?region:type).value=button.dataset.value;render();}});
el('retry').addEventListener('click',load);
el('download').addEventListener('click',()=>{const cell=v=>'"'+String(v??'').replace(/^[=+@-]/,"'$&").replace(/"/g,'""')+'"';const rows=[['자료구분','조직명','지역','유형','실적연도','매출액(원)','종사자수(명)','공시버전','공개일','출처'],...summary.rows.map(x=>['가상 시연 자료',x.item.organization.name,x.item.organization.region,x.item.organization.types.join(' / '),year.value,x.current?.revenue??'',x.current?.employees??'',x.current?.version??'',x.current?.published_at??'',x.current?.source??'해당 연도 공시 없음'])];const url=URL.createObjectURL(new Blob(['\uFEFF'+rows.map(r=>r.map(cell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`사회연대경제_가상자료_${year.value}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
load();
}
