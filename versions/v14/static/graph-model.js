(function(root){
'use strict';
const BASE=518370000, states=['검토 대기','동일기업 확인','별개기업','판단 불가'], bases=['사업자번호 일치','법인번호 일치','명칭·주소 일치','명칭 일치'];
function build(detail,reviews,orgMap,meta){
 const o=detail.organization, nodes=[];
 for(const r of reviews.filter(r=>r.a===o.id||r.b===o.id)){
  const other=orgMap.get(r.a===o.id?r.b:r.a);if(!other)continue;
  const state=states[r.decision-BASE]||'상태 미확인';
  nodes.push({key:'review:'+r.id,kind:'candidate',name:other.name,label:state,style:r.decision===BASE+1?'confirmed':r.decision===BASE+2?'separate':'candidate',other,review:r,description:bases[r.basis-BASE]||'근거 미확인'});
 }
 const grouped=(rows,key)=>{const m=new Map();for(const row of rows){const k=key(row);if(!m.has(k))m.set(k,[]);m.get(k).push(row);}return m;};
 for(const type of o.types||[])nodes.push({key:'type:'+type,kind:'type',name:type,label:'자료 유형',style:'record',records:detail.qualifications.filter(q=>q.type===type),description:'원본 자료의 분류입니다. 현재 자격의 동시 유효성을 의미하지 않습니다.'});
 if(o.region)nodes.push({key:'region:'+o.region,kind:'region',name:o.region,label:'소재 지역',style:'record',description:o.address||'상세 주소 미기재'});
 for(const [metric,records] of grouped(detail.observations,r=>r.metric))nodes.push({key:'metric:'+metric,kind:'metric',name:meta.metrics[metric]?.name||'지표',label:'지표 관측',style:'record',records,description:records.length+'개 관측 · 미기재 값은 0이 아닙니다.'});
 const records=[...detail.qualifications.map(r=>({...r,recordKind:'유형 관측'})),...detail.observations.map(r=>({...r,recordKind:'지표 관측'}))];
 for(const [file,items] of grouped(records.filter(r=>r.source?.file),r=>r.source.file))nodes.push({key:'source:'+file,kind:'source',name:file,label:'자료 출처',style:'record',records:items,description:items.length+'개 관측의 근거 파일'});
 return nodes;
}
const api={build,states,bases,BASE};root.knowledgeGraph=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
