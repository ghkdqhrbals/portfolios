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

	// PDF 출력 시 상대경로 링크도 클릭 가능한 절대경로로 보존
	function ensurePrintableHyperlinks(){
		function candidates(){
			// 기본: main-content 내부
			let list=[...document.querySelectorAll('.main-content a[href]')];
			// about 페이지 특이 케이스: 혹시 마크업이 다르면 body 전체에서 main-content 밖 텍스트 링크도 처리
			if(location.pathname.match(/about|profile|me|cv/i)){
				const extra=[...document.querySelectorAll('body a[href]')]
					.filter(a=>!a.closest('.side-bar'))
					.filter(a=>!list.includes(a));
				list = list.concat(extra);
			}
			return list;
		}
		function normalize(){
			candidates().forEach(a=>{
				const href=a.getAttribute('href');
				if(!href) return;
				if(href.startsWith('http://')||href.startsWith('https://')||href.startsWith('mailto:')||href.startsWith('#')||href.startsWith('javascript:')) return;
				if(a.dataset.origHref) return; // 이미 처리됨
				// 상대경로 → 절대경로 (a.href 사용)
				try {
					a.dataset.origHref = href;
					a.setAttribute('href', a.href); // a.href 는 absolute
				} catch(e){}
			});
		}
		function restore(){
			candidates().forEach(a=>{
				const orig=a.dataset.origHref; if(orig){ a.setAttribute('href', orig); }
				delete a.dataset.origHref;
			});
		}
		window.addEventListener('beforeprint', normalize);
		window.addEventListener('afterprint', restore);
		if(window.matchMedia){
			try{window.matchMedia('print').addEventListener('change', e=>{ if(e.matches){ normalize(); } else { restore(); } });}catch(e){}
		}
	}

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
		// Update total count
		const totalCountEl=document.getElementById('total-count');
		if(totalCountEl){ totalCountEl.textContent=total; }
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
				// ls -l format: permissions links user group size date filename
				const dateStr = (it.date || '').replace(/-/g, '.');
				const title = it.title||'(제목없음)';
				// Estimate content size (fetch from data or default)
				const groupTag = cat || 'misc';
				const filename = title;
				
				li.innerHTML = 
					'<span class="r-date">' + dateStr + '</span>' +
					// groupTag
					'<span class="tags">[' + groupTag + ']</span>' +
					'<span class="r-title"><a href="'+it.url+'">' + filename + '</a></span>';
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

	document.addEventListener('DOMContentLoaded', function(){addLangBadges();/* reading time 제거 */initRecent();ensurePrintableHyperlinks();});
})();
