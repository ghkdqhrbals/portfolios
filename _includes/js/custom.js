// Minimal enhancements: code language badge + reading time meta
(function(){
	function addLangBadges(){
		document.querySelectorAll('figure.highlight').forEach(fig=>{
			const cls=[...fig.classList].find(c=>c.startsWith('language-'))||'';
			const lang=cls.replace('language-','');
			const pre=fig.querySelector('pre');
			if(pre && lang){pre.setAttribute('data-lang', lang.toUpperCase());}
		});
	}
	// (Removed) Reading time 기능 전역 비활성화
	function addReadingTime(){}

	function initRecent(){
		const root=document.getElementById('recent-root');
		if(!root) return; // not index
		// Folder(slug) -> Friendly category name mapping
		const CAT_MAP = {
			"Java":"Server",
			"docker":"도커와 쿠버네티스",
			"project":"실시간 채팅서버 프로젝트",
			"toy":"토이 프로젝트",
			"pf":"성능개선 기록",
			"automation":"자동화 목록",
			"foxee":"Explainable AI(XAI)로 취약점 분석",
			"msa":"Micro Service Architecture",
			"메세지큐":"Message Queue",
			"암호학":"Cryptography",
			"데이터베이스":"RDBMS",
			"NOSQL":"NO-SQL",
			"project2":"Bank API Server Project",
			"benchmark":"BM performance tester",
			"elasticSearch":"Elastic Search",
			"Go언어":"Go",
			"Blockchain":"Ethereum Eclipse Attack",
			"CS":"Computer Science",
			"alg":"알고리즘 문제",
			"일상":"개발자 일기",
			"etc":"기타",
			"통신 프로토콜":"API 아키텍처"
		};
		const perPage=parseInt(root.getAttribute('data-per-page')||'20',10);
		const list=document.getElementById('recent-list');
		const btn=document.getElementById('recent-more');
		const count=document.getElementById('recent-count');
		let data=[];
		const tpl=document.getElementById('recent-data');
		if(tpl){
			try { data=JSON.parse(tpl.innerHTML.trim()||'[]'); } catch(e){ console.error('recent-data parse error',e); }
		}
		if(!data.length){ list.innerHTML='<div class="recent-empty">문서가 없습니다.</div>'; return; }
		// sort again for safety
		data.sort((a,b)=>{ if(a.date && b.date) return a.date < b.date ? 1 : -1; if(a.date && !b.date) return -1; if(!a.date && b.date) return 1; return (a.title||'').localeCompare(b.title||'', 'ko'); });
		let loaded=0; const total=data.length;
		function catColor(cat){
			if(!cat) return null;
			let hash=0; for(let i=0;i<cat.length;i++){ hash = cat.charCodeAt(i) + ((hash<<5)-hash); }
			const hue=Math.abs(hash)%360;
			return { fg:`hsl(${hue},55%,30%)`, bg:`hsl(${hue},85%,93%)`, br:`hsl(${hue},70%,75%)` };
		}
		function deriveCat(it){
			let slug='';
			if(it.cat) slug = it.cat; else {
				try { const parts=it.url.split('/').filter(Boolean); const idx=parts.indexOf('docs'); if(idx>=0 && parts.length>idx+1) slug=decodeURIComponent(parts[idx+1]); } catch(e){}
			}
			return CAT_MAP[slug] || slug;
		}
		function render(){
			const next=loaded+perPage; const frag=document.createDocumentFragment();
			for(let i=loaded;i<next && i<total;i++){
				const it=data[i];
				const li=document.createElement('li');
				const cat=deriveCat(it);
				let catHtml='';
				if(cat){
					if(cat === 'Server'){
						catHtml='<span class="r-cat" style="background:#111;color:#fff;border:1px solid #000" title="'+cat+'">'+cat+'</span>';
					}else{
						const c=catColor(cat); if(c){ catHtml='<span class="r-cat" style="background:'+c.bg+';color:'+c.fg+';border:1px solid '+c.br+'" title="'+cat+'">'+cat+'</span>'; }
					}
				}
				li.innerHTML='<span class="r-date">'+(it.date||'—')+'</span><a class="r-title" href="'+it.url+'">'+(it.title||'(제목없음)')+'</a>'+catHtml;
				frag.appendChild(li);
			}
			list.appendChild(frag);
			loaded=Math.min(next,total);
			updateButton();
		}
		function updateButton(){
			if(total<=perPage && loaded>=total){ btn.style.display='none'; count.style.display='inline'; count.textContent=loaded+'/'+total; return; }
			count.style.display='inline'; count.textContent=loaded+'/'+total;
			if(loaded>=total){ btn.style.display='none'; }
			else { btn.style.display='inline-block'; }
		}
		btn.addEventListener('click', render);
		// shift+click => load all
		btn.addEventListener('click', e=>{ if(e.shiftKey){ while(loaded<total) render(); }});
		render();
	}

	document.addEventListener('DOMContentLoaded', function(){addLangBadges();/* reading time 제거 */initRecent();});
})();
