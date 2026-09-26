/* Public-purpose mega navigation inspired by the supplied reference. */
(function(){
const groups=[
 {name:'기본법 안내',items:[
  ['기본법이란?','개념과 원칙, 우리 일상에 연결되는 의미를 그림으로 이해하세요.','/versions/v20/law.html'],
  ['한눈에 보는 기본법','28개 조문을 주제별로 살펴보고 쉬운 설명을 펼쳐보세요.','/versions/v20/law-map.html'],
  ['법률 상세','조문 번호·주제로 검색하고 적용 시점과 확인할 조건을 읽어보세요.','/versions/v20/law-articles.html'],
  ['13개 기업 유형','각 유형의 법률·기관을 알아보고 실제 통계로 이어가세요.','/versions/v20/economy-types.html'],
  ['시행 일정','공포·일반 시행과 공시·통합플랫폼의 별도 시행을 구분하세요.','/versions/v20/law-timeline.html']]},
 {name:'정책·플랫폼',items:[
  ['참여기관·정책 추진체계','기관의 총괄·심의·지원·금융·통계 역할을 관계로 이해하세요.','/versions/v20/institutions.html'],
  ['종합계획·기본계획','발전 종합계획과 법정 기본계획, 연간 실행의 차이를 알아보세요.','/versions/v20/policy-plan.html'],
  ['주요 지원정책','금융·공공구매·공공서비스·성장의 법률 근거를 살펴보세요.','/versions/v20/policy-support.html'],
  ['통합플랫폼이란?','분산된 자료가 검색·통계·근거·업무로 이어지는 이유를 알아보세요.','/versions/v20/platform.html'],
  ['데이터 통합 구조','원천자료 보존부터 통계 활용까지 단계를 직접 선택해 보세요.','/versions/v20/data-flow.html']]},
 {name:'기업·조직 찾기',items:[
  ['자연어 통합검색','문장으로 조직을 찾고 통계·관계·출처를 이어서 탐색하세요.','/versions/v20/natural.html'],
  ['관계로 탐색하기','조직에서 유형·기업 후보·지표·출처로 이어지는 지식 그래프를 펼쳐보세요.','/versions/v20/graph.html'],
  ['조직 통합검색','이름·지역·유형으로 관심 있는 기업과 조직을 찾아보세요.','/#search'],
  ['우리 지역 조직','지역별 분포를 살펴보고 가까운 조직의 활동으로 이어가세요.','/versions/v20/regions.html'],
  ['유형별 둘러보기','사회적기업·협동조합·마을기업·자활기업을 유형별로 만나보세요.','/versions/v20/types.html'],
  ['복수 지위 탐색','서로 다른 유형의 자료에 등장하는 기업 후보와 연결 근거를 확인하세요.','/versions/v20/multistatus.html'],
  ['두 조직 비교','궁금한 두 조직의 유형 이력과 활동 자료를 나란히 살펴보세요.','/versions/v20/compare.html']]},
 {name:'공시·활동',items:[
  ['통합 공지사항','13개 기관의 공지·입찰·지원사업을 찾고 공식 원문으로 이어가세요.','/versions/v20/notices.html'],
  ['지표·공시 자료 조회','조직의 지표 원문을 실적연도·보고연도·단위와 함께 확인하세요.','/versions/v20/analytics.html#evidence'],
  ['경영·재무 살펴보기','매출액과 영업이익 등 경영 지표를 선택해 합계·분포·추이를 살펴보세요.','/versions/v20/query.html?metric=3&dimension=year&measure=sum'],
  ['일자리와 참여','근로자·조합원·참여자 지표를 골라 조직의 활동을 이해해 보세요.','/versions/v20/query.html?metric=2&dimension=region&measure=mean'],
  ['사회가치 살펴보기','사회가치 측정등급과 점수의 분포를 지역·연도별로 확인하세요.','/versions/v20/query.html?metric=0&dimension=original&measure=records']]},
 {name:'통계·분석',items:[
  ['대화형 보고서','공개 Power BI 보고서를 화면 안에서 확인하고 크게 펼쳐보세요.','/versions/v20/powerbi.html'],
  ['통계 한눈에','조직·유형·지역·후보 연결과 자료 확보 현황을 한곳에서 살펴보세요.','/versions/v20/statistics.html'],
  ['자유 통계 분석','지표·필터·집계 기준을 직접 조합해 합계·평균·중앙값을 계산하세요.','/versions/v20/query.html'],
  ['지역·유형 교차 분석','지역과 유형 조건을 바꾸며 구성비와 교차표를 비교해 보세요.','/versions/v20/regions.html'],
  ['연도별 변화 살펴보기','실적연도별 수치를 보고 같은 조직그룹의 두 연도를 비교하세요.','/versions/v20/query.html?metric=3&dimension=year&measure=sum'],
  ['조직별 수치 순위','선택한 지표의 조직그룹별 수치를 정렬하고 전체 결과를 내려받으세요.','/versions/v20/query.html?metric=3&dimension=organization&measure=sum'],
  ['복수 지위 연결 통계','유형 간 연결과 탐지 근거를 살펴보고 해당 후보를 찾아보세요.','/versions/v20/statistics.html#connections']]},
 {name:'자료·이용 안내',items:[
 ['전체 서비스 · 사이트맵','모든 메뉴를 한눈에 보고 필요한 서비스로 이동하세요.','/versions/v20/sitemap.html'],
  ['자료 출처','확보한 원본 파일과 제공기관·기준일·출처 기록을 확인하세요.','/versions/v20/sources.html'],
  ['도움말·사용방법','화면 캡처와 따라 하기로 검색·분석·비교 이용 방법을 살펴보세요.','/versions/v20/manual.html'],
  ['처음 이용하시나요?','조직 발견부터 활동 자료 확인까지 이용 방법을 안내합니다.','/versions/v20/guide.html'],
  ['통계 읽는 법','조직그룹·후보 쌍·관측기록과 탐색용 집계의 의미를 알아보세요.','/versions/v20/guide.html#content'],
  ['개발 현황과 이전 화면','현재 구현 범위를 확인하고 보관된 이전 버전도 둘러보세요.','/#progress']]},
 {name:'담당자 업무',items:[
 ['관리자 바로가기 · 엑셀 자료 업데이트 ↗','기관 자료를 엑셀로 업데이트하는 프로그램 · 별도 로그인과 권한 필요.','https://org2e5e988a.crm21.dynamics.com/main.aspx?appid=8a1108ec-3866-55a8-88d7-11f19858004b&forceUCI=1&pagetype=webresource&webresourceName=mykl_workapp%2Fhome.html'],
  ['통합관리 업무 앱 ↗','권한이 있는 담당자는 조직·자격·지표·출처와 자료 검토 업무를 처리할 수 있어요.','https://org2e5e988a.crm21.dynamics.com/main.aspx?appid=8a1108ec-3866-55a8-88d7-11f19858004b'],
  ['업무·공개 연결 안내','실제 연결된 기능과 향후 공식 자료·분석·제출 기능의 범위를 확인하세요.','/versions/v20/guide.html']]}
];

const esc=v=>String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const map=document.getElementById('sitemap-groups');
if(map){document.getElementById('sitemap-sections').innerHTML=groups.map((g,i)=>'<a href="#service-group-'+i+'">'+esc(g.name)+'</a>').join('');document.getElementById('sitemap-sections').onclick=e=>{const a=e.target.closest('a');if(!a)return;document.getElementById('sitemap-search').value='';draw();document.querySelectorAll('#sitemap-sections a').forEach(x=>x.removeAttribute('aria-current'));a.setAttribute('aria-current','location');};const draw=(q='')=>{let count=0;map.innerHTML=groups.map((g,i)=>{const items=g.items.filter(x=>(g.name+' '+x[0]+' '+x[1]).toLowerCase().includes(q.trim().toLowerCase()));count+=items.length;return items.length?'<section class="sitemap-group" id="service-group-'+i+'"><h2>'+esc(g.name)+'</h2><div class="sitemap-links">'+items.map(x=>'<a href="'+esc(x[2])+'" '+(x[2].startsWith('https:')?'target="_blank" rel="noopener noreferrer"':'')+'><strong>'+esc(x[0])+'</strong><span>'+esc(x[1])+'</span></a>').join('')+'</div></section>':'';}).join('');document.getElementById('sitemap-status').textContent=q?count+'개 서비스를 찾았습니다.':'7개 분야 · '+count+'개 서비스 바로가기';if(!count)map.innerHTML='<p>일치하는 서비스가 없습니다. 다른 검색어를 입력해 보세요.</p>';};document.getElementById('sitemap-search').oninput=e=>draw(e.target.value);draw();}
for(const container of [document.querySelector('header'),document.querySelector('footer')]){if(container){const el=document.createElement('div');el.className='service-shortcuts';el.innerHTML='<a href="/versions/v20/sitemap.html">전체 서비스 · 사이트맵</a><a href="https://org2e5e988a.crm21.dynamics.com/main.aspx?appid=8a1108ec-3866-55a8-88d7-11f19858004b&amp;forceUCI=1&amp;pagetype=webresource&amp;webresourceName=mykl_workapp%2Fhome.html" target="_blank" rel="noopener noreferrer">관리자 바로가기 ↗</a><small>관리자: 별도 로그인·권한 필요</small>';container.appendChild(el);}}

const nav=document.querySelector('nav.main-nav');if(!nav)return;
nav.className='mega-nav';nav.innerHTML='<div class="mega-top">'+groups.map((g,i)=>`<button type="button" id="mega-toggle-${i}" aria-expanded="false" aria-controls="mega-panel-${i}">${g.name}<span aria-hidden="true">⌄</span></button>`).join('')+'<details class="mega-versions"><summary>개발 현황</summary><div><a href="/#progress">버전 20 · 현재</a>'+[19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1].map(v=>`<a href="/versions/v${v}/index.html">버전 ${v} 화면 보기</a>`).join('')+'</div></details></div>'+groups.map((g,i)=>`<section id="mega-panel-${i}" class="mega-panel" aria-labelledby="mega-toggle-${i}" hidden><div class="mega-panel-inner"><div class="mega-heading"><p>${g.name}</p><button type="button" class="mega-close" aria-label="${g.name} 메뉴 닫기">닫기 ✕</button></div><div class="mega-grid">${g.items.map(([title,desc,url])=>`<a href="${url}" ${url.startsWith('https:')?'target="_blank" rel="noopener noreferrer"':''}><h2>${title}<span aria-hidden="true">→</span></h2><p>${desc}</p></a>`).join('')}</div></div></section>`).join('');
const buttons=[...nav.querySelectorAll('.mega-top>button')],panels=[...nav.querySelectorAll('.mega-panel')];
function close(focus=false){const current=buttons.find(b=>b.getAttribute('aria-expanded')==='true');buttons.forEach(b=>b.setAttribute('aria-expanded','false'));panels.forEach(p=>p.hidden=true);if(focus&&current)current.focus();}
buttons.forEach((b,i)=>{if(groups[i].items.some(x=>x[2].split('?')[0].split('#')[0].replace(/\.html$/,'')===location.pathname.replace(/\.html$/,'')&&location.pathname!=='/'))b.classList.add('has-current');b.onclick=()=>{const open=b.getAttribute('aria-expanded')==='true';close();nav.querySelector('details').open=false;if(!open){b.setAttribute('aria-expanded','true');panels[i].hidden=false;}};b.onkeydown=e=>{if(e.key==='ArrowDown'){e.preventDefault();close();b.setAttribute('aria-expanded','true');panels[i].hidden=false;panels[i].querySelector('.mega-grid a').focus();}if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();buttons[(i+(e.key==='ArrowRight'?1:buttons.length-1))%buttons.length].focus();}};});
nav.querySelectorAll('.mega-close').forEach(b=>b.onclick=()=>close(true));nav.addEventListener('keydown',e=>{if(e.key==='Escape'){close(true);nav.querySelector('details').open=false;}});document.addEventListener('click',e=>{if(!nav.contains(e.target)){close();nav.querySelector('details').open=false;}});nav.querySelector('details').addEventListener('toggle',e=>{if(e.target.open)close();});nav.querySelectorAll('.mega-grid a').forEach(a=>a.addEventListener('click',()=>close()));
})();
