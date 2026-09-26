/* Public Dataverse synchronization snapshot. No credentials; no fake fallback. */
(function(root){
let metaPromise,orgPromise,obsPromise;const detailCache=new Map();
async function json(path){const r=await fetch('/versions/v8/static/dataverse/'+path);if(!r.ok)throw Error('Dataverse 동기화 자료를 불러오지 못했습니다. 다시 시도해 주세요.');return r.json();}
const meta=()=>metaPromise||(metaPromise=json('manifest.json').catch(e=>{metaPromise=null;throw e;}));
const organizations=()=>orgPromise||(orgPromise=json('organizations.json').catch(e=>{orgPromise=null;throw e;}));
const observations=()=>obsPromise||(obsPromise=json('observations.json').catch(e=>{obsPromise=null;throw e;}));
async function detail(id){if(!/^[0-9a-f]{8}-[0-9a-f-]{27}$/.test(id))throw Error('올바르지 않은 조직 ID입니다.');const shard=id.slice(0,2);if(!detailCache.has(shard))detailCache.set(shard,json('details/'+shard+'.json').catch(e=>{detailCache.delete(shard);throw e;}));const d=(await detailCache.get(shard))[id];if(!d)throw Error('조직을 찾을 수 없습니다.');return d;}
let multiPromise;
const multistatus=()=>multiPromise||(multiPromise=json('multistatus.json').catch(e=>{multiPromise=null;throw e;}));
root.dataverseData={meta,organizations,observations,detail,multistatus};
root.publicApi=async path=>{const url=new URL(path,'https://local.invalid'),p=url.searchParams;const [all,m]=await Promise.all([organizations(),meta()]);if(url.pathname==='/api/catalog')return {organizations:all.length,disclosures:m.tables.mykl_metricobservation,regions:m.regions,types:m.types,demo:false,retrievedAt:m.retrievedAt};if(url.pathname==='/api/organizations'){const page=Math.max(1,Number(p.get('page'))||1),size=Math.min(50,Math.max(1,Number(p.get('page_size'))||6)),q=(p.get('q')||'').trim().toLocaleLowerCase();const rows=all.filter(o=>(!q||o.name.toLocaleLowerCase().includes(q)||o.code?.toLocaleLowerCase().includes(q))&&(!p.get('region')||o.region===p.get('region'))&&(!p.get('kind')||o.types.includes(p.get('kind')))&&(p.get('disclosed_only')!=='true'||o.metric_count>0));rows.sort((a,b)=>a.name.localeCompare(b.name,'ko')||a.id.localeCompare(b.id));return {total:rows.length,page,page_size:size,items:rows.slice((page-1)*size,page*size)};}const id=url.pathname.split('/').pop();return detail(id);};
})(globalThis);
