(function(root){'use strict';
const norm=v=>String(v||'').toLocaleLowerCase().replace(/\s/g,'');
const defaults=()=>({action:'organizations',query:'',region:'',district:'',types:[],type_count:null,type_count_mode:'min',metric:null,year:null,unit:'*',group_by:'organization',measure:'count',sort:'name',limit:20,interpretation:'',clarification:''});
function candidateGroups(data){
 const byId=new Map(data.orgs.map((o,i)=>[o.id,{...o,index:i}])),parent=new Map(data.orgs.map(o=>[o.id,o.id]));
 const find=id=>{let r=id;while(parent.get(r)!==r)r=parent.get(r);while(id!==r){const next=parent.get(id);parent.set(id,r);id=next;}return r;};
 const edges=data.multi.rows.filter(r=>byId.has(r.a)&&byId.has(r.b)&&[518370000,518370001].includes(r.decision));
 for(const r of edges){const a=find(r.a),b=find(r.b);if(a!==b)parent.set(b,a);}
 const groups=new Map();
 for(const o of byId.values()){const key=find(o.id);if(!groups.has(key))groups.set(key,{members:[],edges:[]});groups.get(key).members.push(o);}
 for(const r of edges)groups.get(find(r.a)).edges.push(r);
 return [...groups.values()].map(g=>{g.members.sort((a,b)=>a.id.localeCompare(b.id));const types=[...new Set(g.members.flatMap(o=>o.types))].sort(),regions=[...new Set(g.members.map(o=>o.region||'지역 미확인'))].sort();return {...g,id:g.members[0].id,name:g.members[0].name,types,typeCount:types.length,regions,region:regions.length===1?regions[0]:'지역 불일치'};}).filter(g=>g.typeCount>=2);
}
function execute(plan,data){const p={...defaults(),...plan}, {orgs,addresses,obs,multi}=data, Q=root.queryEngine;
 const basic=(o,i,types=true)=>(!p.query||norm(o.name+' '+o.code+' '+(o.summary||'')+' '+(o.sector||'')).includes(norm(p.query)))&&(!p.region||o.region===p.region)&&(!p.district||norm(addresses[i]).includes(norm(p.district)))&&(!types||!p.types.length||p.types.some(t=>o.types.includes(t)));
 const selected=orgs.map((o,i)=>({o,i})).filter(({o,i})=>basic(o,i)),indices=new Set(selected.map(x=>x.i));
 if(p.action==='overlap'){
  const available=data.types||[...new Set(orgs.flatMap(o=>o.types))],count=p.type_count_mode==='all'?available.length:(p.type_count??2);
  const items=candidateGroups(data).filter(g=>(p.type_count_mode==='exact'||p.type_count_mode==='all'?g.typeCount===count:g.typeCount>=count)&&p.types.every(t=>g.types.includes(t))&&(!p.region||g.region===p.region)&&g.members.some(o=>basic(o,o.index,false)));
  items.sort((a,b)=>p.sort==='name'?a.name.localeCompare(b.name,'ko'):(p.sort==='asc'?1:-1)*(a.typeCount-b.typeCount)||a.id.localeCompare(b.id));
  if(p.group_by==='organization')return {kind:'overlap',total:items.length,items,groups:items.length};
  const buckets=new Map();for(const g of items){const key=p.group_by==='region'?g.region:p.group_by==='type'?g.types.join(' + '):'전체';if(!buckets.has(key))buckets.set(key,{name:key,value:0,unit:'중복 후보군',members:[]});const b=buckets.get(key);b.value++;b.members.push(g);}
  const rows=[...buckets.values()].sort((a,b)=>p.sort==='name'?a.name.localeCompare(b.name,'ko'):(p.sort==='asc'?1:-1)*(a.value-b.value)||a.name.localeCompare(b.name,'ko'));
  return {kind:'overlap-statistics',total:rows.length,items:rows,groups:items.length};
 }
 if(p.action==='candidates'){
  const byId=new Map(orgs.map((o,i)=>[o.id,{o,i}]));const pairs=multi.rows.filter(r=>{const a=byId.get(r.a),b=byId.get(r.b);return a&&b&&(!p.types.length||p.types.every(t=>[...a.o.types,...b.o.types].includes(t)))&&(basic(a.o,a.i,false)||basic(b.o,b.i,false));});
  return {kind:'candidates',total:pairs.length,items:pairs.map(r=>({...r,left:byId.get(r.a).o,right:byId.get(r.b).o})),organizations:new Set(pairs.flatMap(r=>[r.a,r.b])).size};
 }
 const metricRows=p.metric===null?[]:obs.filter(r=>indices.has(r[0])&&r[1]===p.metric&&(p.year===null||r[2]===p.year)&&(p.unit==='*'||(r[5]||'unknown')===p.unit));
 if(p.action==='statistics'){
  const groups=new Map();
  const keys=(o,r)=>p.group_by==='region'?[o.region]:p.group_by==='type'?o.types:p.group_by==='year'?[r?.[2]??'실적연도 미확인']:p.group_by==='all'?['전체']:[o.id];
  if(p.metric===null){for(const {o} of selected)for(const k of keys(o)){if(!groups.has(k))groups.set(k,{name:p.group_by==='organization'?o.name:k,id:p.group_by==='organization'?o.id:null,unit:'조직그룹',ids:new Set()});groups.get(k).ids.add(o.id);}}
  else for(const r of metricRows){const o=orgs[r[0]],unit=r[5]||'unknown';for(const k of keys(o,r)){const gkey=JSON.stringify([k,unit]);if(!groups.has(gkey))groups.set(gkey,{name:p.group_by==='organization'?o.name:String(k),id:p.group_by==='organization'?o.id:null,unit,rows:[]});groups.get(gkey).rows.push(r);}}
  const items=[...groups.values()].map(g=>{const summary=g.rows?Q.summarize(g.rows):null;return {name:g.name,id:g.id,unit:g.unit,value:summary?(p.measure==='count'?summary.records:summary[p.measure]):g.ids.size,summary};});
  items.sort((a,b)=>p.sort==='name'?a.name.localeCompare(b.name,'ko'):a.value===null?1:b.value===null?-1:(p.sort==='asc'?1:-1)*(a.value-b.value)||a.name.localeCompare(b.name,'ko'));
  return {kind:'statistics',total:items.length,items,records:metricRows.length,organizations:p.metric===null?selected.length:new Set(metricRows.map(r=>r[0])).size};
 }
 const qualifying=p.metric===null?null:new Set(metricRows.map(r=>r[0]));const items=selected.filter(x=>!qualifying||qualifying.has(x.i)).map(x=>x.o).sort((a,b)=>a.name.localeCompare(b.name,'ko'));
 return {kind:p.action,total:items.length,items};
}
root.naturalEngine={defaults,execute,norm,candidateGroups};if(typeof module!=='undefined')module.exports=root.naturalEngine;
})(globalThis);
