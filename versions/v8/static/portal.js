/* Public-purpose mega navigation inspired by the supplied reference. */
(function(){
const groups=[
 {name:'기업·조직 찾기',items:[
  ['조직 통합검색','이름·지역·유형으로 관심 있는 기업과 조직을 찾아보세요.','/versions/v8/index.html#search'],
  ['우리 지역 조직','지역별 분포를 살펴보고 가까운 조직의 활동으로 이어가세요.','/versions/v8/regions.html'],
  ['유형별 둘러보기','사회적기업·협동조합·마을기업·자활기업을 유형별로 만나보세요.','/versions/v8/types.html'],
  ['복수 지위 탐색','서로 다른 유형의 자료에 등장하는 기업 후보와 연결 근거를 확인하세요.','/versions/v8/multistatus.html'],
  ['두 조직 비교','궁금한 두 조직의 유형 이력과 활동 자료를 나란히 살펴보세요.','/versions/v8/compare.html']]},
 {name:'공시·활동',items:[
  ['지표·공시 자료 조회','조직의 지표 원문을 실적연도·보고연도·단위와 함께 확인하세요.','/versions/v8/analytics.html#evidence'],
  ['경영·재무 살펴보기','매출액과 영업이익 등 경영 지표를 선택해 합계·분포·추이를 살펴보세요.','/versions/v8/query.html?metric=3&dimension=year&measure=sum'],
  ['일자리와 참여','근로자·조합원·참여자 지표를 골라 조직의 활동을 이해해 보세요.','/versions/v8/query.html?metric=2&dimension=region&measure=mean'],
  ['사회가치 살펴보기','사회가치 측정등급과 점수의 분포를 지역·연도별로 확인하세요.','/versions/v8/query.html?metric=0&dimension=original&measure=records']]},
 {name:'통계·분석',items:[
  ['통계 한눈에','조직·유형·지역·후보 연결과 자료 확보 현황을 한곳에서 살펴보세요.','/versions/v8/statistics.html'],
  ['자유 통계 분석','지표·필터·집계 기준을 직접 조합해 합계·평균·중앙값을 계산하세요.','/versions/v8/query.html'],
  ['지역·유형 교차 분석','지역과 유형 조건을 바꾸며 구성비와 교차표를 비교해 보세요.','/versions/v8/regions.html'],
  ['연도별 변화 살펴보기','실적연도별 수치를 보고 같은 조직그룹의 두 연도를 비교하세요.','/versions/v8/query.html?metric=3&dimension=year&measure=sum'],
  ['조직별 수치 순위','선택한 지표의 조직그룹별 수치를 정렬하고 전체 결과를 내려받으세요.','/versions/v8/query.html?metric=3&dimension=organization&measure=sum'],
  ['복수 지위 연결 통계','유형 간 연결과 탐지 근거를 살펴보고 해당 후보를 찾아보세요.','/versions/v8/statistics.html#connections']]},
 {name:'자료·이용 안내',items:[
  ['자료 출처','확보한 원본 파일과 제공기관·기준일·출처 기록을 확인하세요.','/versions/v8/sources.html'],
  ['처음 이용하시나요?','조직 발견부터 활동 자료 확인까지 이용 방법을 안내합니다.','/versions/v8/guide.html'],
  ['통계 읽는 법','조직그룹·후보 쌍·관측기록과 탐색용 집계의 의미를 알아보세요.','/versions/v8/guide.html#content'],
  ['개발 현황과 이전 화면','현재 구현 범위를 확인하고 보관된 이전 버전도 둘러보세요.','/#progress']]},
 {name:'담당자 업무',items:[
  ['통합관리 업무 앱 ↗','권한이 있는 담당자는 조직·자격·지표·출처와 자료 검토 업무를 처리할 수 있어요.','https://org2e5e988a.crm21.dynamics.com/main.aspx?appid=8a1108ec-3866-55a8-88d7-11f19858004b'],
  ['업무·공개 연결 안내','실제 연결된 기능과 향후 공식 자료·분석·제출 기능의 범위를 확인하세요.','/versions/v8/guide.html']]}
];
const nav=document.querySelector('nav.main-nav');if(!nav)return;
nav.className='mega-nav';nav.innerHTML='<div class="mega-top">'+groups.map((g,i)=>`<button type="button" id="mega-toggle-${i}" aria-expanded="false" aria-controls="mega-panel-${i}">${g.name}<span aria-hidden="true">⌄</span></button>`).join('')+'<details class="mega-versions"><summary>개발 현황</summary><div><a href="/#progress">버전 8 · 현재</a>'+[7,6,5,4,3,2,1].map(v=>`<a href="/versions/v${v}/index.html">버전 ${v} 화면 보기</a>`).join('')+'</div></details></div>'+groups.map((g,i)=>`<section id="mega-panel-${i}" class="mega-panel" aria-labelledby="mega-toggle-${i}" hidden><div class="mega-panel-inner"><div class="mega-heading"><p>${g.name}</p><button type="button" class="mega-close" aria-label="${g.name} 메뉴 닫기">닫기 ✕</button></div><div class="mega-grid">${g.items.map(([title,desc,url])=>`<a href="${url}" ${url.startsWith('https:')?'target="_blank" rel="noopener noreferrer"':''}><h2>${title}<span aria-hidden="true">→</span></h2><p>${desc}</p></a>`).join('')}</div></div></section>`).join('');
const buttons=[...nav.querySelectorAll('.mega-top>button')],panels=[...nav.querySelectorAll('.mega-panel')];
function close(focus=false){const current=buttons.find(b=>b.getAttribute('aria-expanded')==='true');buttons.forEach(b=>b.setAttribute('aria-expanded','false'));panels.forEach(p=>p.hidden=true);if(focus&&current)current.focus();}
buttons.forEach((b,i)=>{if(groups[i].items.some(x=>x[2].split('?')[0].split('#')[0]===location.pathname&&location.pathname!=='/'))b.classList.add('has-current');b.onclick=()=>{const open=b.getAttribute('aria-expanded')==='true';close();nav.querySelector('details').open=false;if(!open){b.setAttribute('aria-expanded','true');panels[i].hidden=false;}};b.onkeydown=e=>{if(e.key==='ArrowDown'){e.preventDefault();close();b.setAttribute('aria-expanded','true');panels[i].hidden=false;panels[i].querySelector('.mega-grid a').focus();}if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();buttons[(i+(e.key==='ArrowRight'?1:buttons.length-1))%buttons.length].focus();}};});
nav.querySelectorAll('.mega-close').forEach(b=>b.onclick=()=>close(true));nav.addEventListener('keydown',e=>{if(e.key==='Escape'){close(true);nav.querySelector('details').open=false;}});document.addEventListener('click',e=>{if(!nav.contains(e.target)){close();nav.querySelector('details').open=false;}});nav.querySelector('details').addEventListener('toggle',e=>{if(e.target.open)close();});nav.querySelectorAll('.mega-grid a').forEach(a=>a.addEventListener('click',()=>close()));
})();
