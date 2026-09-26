(function(){
  'use strict';
  const $=id=>document.getElementById(id), D=window.LawGuideData;
  if(!D)return;
  const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const page=document.body.dataset.lawPage;
  const links=ns=>'<div class="law-article-chips">'+ns.map(n=>`<a href="/versions/v19/law-articles.html#article-${n}">제${n}조 →</a>`).join('')+'</div>';
  const normalize=s=>s.normalize('NFKC').replace(/\s+/g,'').toLowerCase();
  if(page==='law-articles'){
    const form=$('article-filter'), search=$('article-search'), topic=$('article-topic');
    const details=[...document.querySelectorAll('.law-article')];
    function filter(){
      const q=normalize(search.value), num=q.match(/^(?:제)?(\d+)(?:조)?$/);let count=0;
      details.forEach((el,i)=>{const a=D.lawArticles[i];const matches=(!topic.value||a.topic===topic.value)&&(!q||(num?Number(num[1])===a.number:normalize(el.textContent).includes(q)));el.hidden=!matches;if(matches)count++;});
      $('article-count').textContent=`28개 중 ${count}개 조문${topic.value?' · '+topic.options[topic.selectedIndex].text:''}`;
      $('article-empty').hidden=count!==0;
    }
    form.addEventListener('submit',e=>{e.preventDefault();filter();});
    search.addEventListener('input',filter);topic.addEventListener('change',filter);
    form.addEventListener('reset',()=>queueMicrotask(filter));
    function openHash(){const m=location.hash.match(/^#article-(\d+)$/);if(!m)return;const el=$('article-'+Number(m[1]));if(!el)return;search.value='';topic.value='';filter();el.open=true;requestAnimationFrame(()=>el.scrollIntoView({block:'start'}));}
    window.addEventListener('hashchange',openHash);filter();openHash();
  }
  if(page==='economy-types'){
    const form=$('type-filter'),search=$('type-search'),status=$('type-status');
    const cards=[...document.querySelectorAll('.law-type-card')];
    function filter(){const q=normalize(search.value);let count=0;cards.forEach(el=>{const match=(!q||normalize(el.textContent).includes(q))&&(!status.value||el.dataset.available===(status.value==='available'?'true':'false'));el.hidden=!match;if(match)count++;});$('type-count').textContent=`13개 중 ${count}개 유형 · 전체 통계 제공 4개 / 연계 준비 중 9개`;$('type-empty').hidden=count!==0;}
    form.addEventListener('submit',e=>{e.preventDefault();filter();});search.addEventListener('input',filter);status.addEventListener('change',filter);form.addEventListener('reset',()=>queueMicrotask(filter));
    const param=new URLSearchParams(location.search).get('status');if(['available','pending'].includes(param))status.value=param;filter();
    window.addEventListener('hashchange',()=>{search.value='';status.value='';filter();});
  }
  if(page==='institutions'){
    document.querySelectorAll('[data-institution]').forEach(b=>b.addEventListener('click',()=>{
      const x=D.participatingInstitutions.find(x=>x.id===b.dataset.institution);if(!x)return;
      document.querySelectorAll('[data-institution]').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));
      $('institution-detail').innerHTML=`<span class="law-tag">${E(x.level)}</span><h2>${E(x.name)}</h2><p>${E(x.summary)}</p><ul>${x.members.map(m=>`<li>${E(m)}</li>`).join('')}</ul>${links(x.articles)}<div class="law-note">${E(x.note)}</div>`;
    }));
  }
  if(page==='data-flow'){
    const tabs=[...document.querySelectorAll('[data-stage]')];
    function choose(b){const x=D.stages.find(s=>s.id===b.dataset.stage);tabs.forEach(t=>{t.setAttribute('aria-selected',String(t===b));t.tabIndex=t===b?0:-1;});$('stage-detail').setAttribute('aria-labelledby',b.id);$('stage-detail').innerHTML=`<p class="law-eyebrow">${E(x.english.toUpperCase())}</p><h2>${E(x.name)}</h2><p>${E(x.summary)}</p><div class="law-data-detail"><div><h3>들어오는 자료</h3><p>${E(x.inputs)}</p></div><div><h3>남기는 결과</h3><p>${E(x.outputs)}</p></div></div><div class="law-note">${E(x.check)}</div><p><b>현재 PoC:</b> ${E(x.state)}</p>`;}
    tabs.forEach((b,i)=>{b.addEventListener('click',()=>choose(b));b.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next===undefined)return;e.preventDefault();tabs[next].focus();choose(tabs[next]);});});
  }
  // Existing statistical filters retain their own URL/state and link back to the selected type.
  if($('law-type-return')){
    function update(){const type=$('type')?.value??new URLSearchParams(location.search).get('type');const t=D.organizationTypes.find(t=>t.name===type);$('law-type-return').href='/versions/v19/economy-types.html'+(t?'#type-'+t.id:'');$('law-type-return').textContent=t?`${t.name}의 법률·유형 설명 →`:'13개 유형의 법률·기관 설명 →';}
    document.addEventListener('change',e=>{if(e.target.id==='type')queueMicrotask(update);});document.addEventListener('reset',()=>setTimeout(update,0));update();
  }
})();
