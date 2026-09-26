(() => {
const select=document.getElementById('version-select');
if(!select)return;
const cards=[...document.querySelectorAll('.version-list>li')];
const versionOf=card=>card.querySelector('.version-number').textContent.match(/버전 (\d+)/)[1];
function show(){
 const value=select.value;
 for(const card of cards)card.hidden=value!=='all'&&versionOf(card)!==value;
 document.getElementById('version-selection-status').textContent=value==='all'?'전체 '+cards.length+'개 버전을 표시합니다.':'버전 '+value+'의 변경 내용을 표시합니다. 아래 링크로 화면을 열어 보세요.';
}
select.addEventListener('change',show);show();
})();
