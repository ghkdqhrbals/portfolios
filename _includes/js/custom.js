// Minimal enhancements: code language badge + reading time meta
(function(){
	function initThemeToggle(){
		const root=document.documentElement;
		const buttons=[...document.querySelectorAll('.theme-toggle')];
		const setTheme=theme=>{
			const normalized=theme === 'dark' ? 'dark' : 'light';
			root.setAttribute('data-theme', normalized);
			try { sessionStorage.setItem('site-theme', normalized); } catch(e){}
			buttons.forEach(button=>{
				const isDark=normalized === 'dark';
				button.setAttribute('aria-pressed', String(isDark));
				button.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
			});
		};
		setTheme(root.getAttribute('data-theme') || 'light');
		buttons.forEach(button=>{
			button.addEventListener('click', ()=>{
				root.classList.add('theme-changing');
				buttons.forEach(btn=>btn.classList.remove('theme-toggle--animating'));
				void button.offsetWidth;
				buttons.forEach(btn=>btn.classList.add('theme-toggle--animating'));
				setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
				window.setTimeout(()=>buttons.forEach(btn=>btn.classList.remove('theme-toggle--animating')), 360);
				window.setTimeout(()=>root.classList.remove('theme-changing'), 320);
			});
		});
		if(window.matchMedia){
			const media=window.matchMedia('(prefers-color-scheme: dark)');
			const syncSystemTheme=event=>{
				if(sessionStorage.getItem('site-theme')) return;
				root.classList.add('theme-changing');
				setTheme(event.matches ? 'dark' : 'light');
				window.setTimeout(()=>root.classList.remove('theme-changing'), 320);
			};
			if(typeof media.addEventListener === 'function') media.addEventListener('change', syncSystemTheme);
			else if(typeof media.addListener === 'function') media.addListener(syncSystemTheme);
		}
	}

	function initTranslation(){
		const containers=[...document.querySelectorAll('[data-tl-content]')];
		if(!containers.length) return;

		const params=new URLSearchParams(window.location.search);
		const active=(params.get('tl') || 'ko').toLowerCase() === 'en' ? 'en' : 'ko';

		containers.forEach(container=>{
			const lang=container.getAttribute('data-tl-content');
			const isActive=lang === active;
			container.hidden = !isActive;
			container.querySelectorAll('[id]').forEach(el=>{
				if(!el.dataset.tlOriginalId) el.dataset.tlOriginalId=el.id;
				el.id = isActive ? el.dataset.tlOriginalId : 'inactive-' + lang + '-' + el.dataset.tlOriginalId;
			});
			container.querySelectorAll('a[href^="#"]').forEach(anchor=>{
				const href=anchor.getAttribute('href');
				if(!anchor.dataset.tlOriginalHref) anchor.dataset.tlOriginalHref=href;
				const original=anchor.dataset.tlOriginalHref || href;
				anchor.setAttribute('href', isActive ? original : '#inactive-' + lang + '-' + original.slice(1));
			});
		});
		document.documentElement.setAttribute('lang', active === 'en' ? 'en-US' : 'ko-KR');
	}

	function fallbackDetectLanguage(code){
		const text=code.trim();
		if(!text) return '';
		if(/^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|WITH|EXPLAIN)\b/im.test(text)) return 'sql';
		if(/^\s*(package|import\s+[\w.*]+;|public\s+class|class\s+\w+|interface\s+\w+|enum\s+\w+|@Test|@DisplayName|@Transactional|@SpringBootApplication|void\s+\w+\s*\()\b/m.test(text)) return 'java';
		if(/^\s*(fun|val|var|data\s+class|suspend\s+fun)\b/m.test(text)) return 'kotlin';
		if(/^\s*(func|package\s+main|import\s+\(|type\s+\w+\s+struct)\b/m.test(text)) return 'go';
		if(/^\s*(const|let|var|import .* from|export\s+|function\s+|class\s+\w+|async\s+function)\b/m.test(text)) return 'javascript';
		if(/^\s*(def|class|from\s+\w+\s+import|import\s+\w+|if __name__ == ['"]__main__['"])\b/m.test(text)) return 'python';
		if(/^\s*(apiVersion:|kind:|metadata:|services:|version: ['"]?3|name:\s+)/m.test(text)) return 'yaml';
		if(/^\s*[{[]/.test(text) && /["'][\w-]+["']\s*:/.test(text)) return 'json';
		if(/^\s*(curl|docker|kubectl|git|npm|yarn|bundle|cd|export)\b/m.test(text)) return 'bash';
		if(/<\/?[a-z][\s\S]*>/i.test(text)) return 'html';
		return '';
	}

	function normalizeLanguage(lang){
		return (lang || '')
			.replace(/^plaintext$/i, 'text')
			.replace(/^sh$/i, 'bash')
			.replace(/^js$/i, 'javascript')
			.trim();
	}

	function addLangBadges(){
		document.querySelectorAll('div.highlighter-rouge, figure.highlight').forEach(block=>{
			const classLang=([...block.classList].find(c=>c.startsWith('language-'))||'').replace('language-','');
			const codeLang=((block.querySelector('code[class*="language-"]')||{}).className||'')
				.split(/\s+/)
				.find(c=>c.startsWith('language-'));
			const code=block.querySelector('pre code, code');
			const explicitLang=normalizeLanguage(classLang || (codeLang||'').replace('language-',''));
			let lang=explicitLang;
			const pre=block.querySelector('pre');
			const raw=code ? (code.textContent || '') : '';

			if(code && window.hljs){
				const detectedLang=lang && lang !== 'text' ? lang : normalizeLanguage(fallbackDetectLanguage(raw));
				try {
					const result=detectedLang && typeof window.hljs.highlight === 'function'
						? window.hljs.highlight(raw, { language: detectedLang, ignoreIllegals: true })
						: (typeof window.hljs.highlightAuto === 'function' ? window.hljs.highlightAuto(raw) : null);
					if(result && result.value){
						code.innerHTML=result.value;
						code.classList.add('hljs');
						lang=normalizeLanguage(detectedLang || result.language || lang);
					}
				} catch(e){
					lang=normalizeLanguage(detectedLang || lang);
				}
			}

			if(code && (!lang || lang === 'text')){
				if(window.hljs && typeof window.hljs.highlightAuto === 'function'){
					const result=window.hljs.highlightAuto(raw);
					if(result && result.language){
						code.innerHTML=result.value;
						code.classList.add('hljs', 'language-' + result.language);
						lang=normalizeLanguage(result.language);
					}
				}
				if(!lang || lang === 'text') lang=normalizeLanguage(fallbackDetectLanguage(raw) || lang);
				if(lang && lang !== 'text') block.classList.add('language-' + lang);
			}

			if(pre && lang){
				const label=lang.toUpperCase();
				block.setAttribute('data-lang', label);
				pre.setAttribute('data-lang', label);
			}
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

	function initContentIndex(){
		if(document.body.classList.contains('page-cv')) return;

		const nav=document.getElementById('content-index');
		const content=document.getElementById('main-content');
		if(!nav || !content) return;

		const ignoredSelectors=[
			'.no_toc',
			'.no-toc',
			'.content-index-sidebar',
			'.site-footer',
			'[hidden]'
		].join(',');
		const headings=[...content.querySelectorAll('h1, h2, h3, h4')]
			.filter(heading=>!heading.closest(ignoredSelectors))
			.filter(heading=>heading.textContent.trim().length > 0);

		if(headings.length < 2){
			const sidebar=nav.closest('.content-index-sidebar');
			if(sidebar) sidebar.hidden=true;
			return;
		}

		const usedIds=new Set();
		const slugify=text=>{
			const slug=text.toLowerCase()
				.trim()
				.replace(/<[^>]*>/g,'')
				.replace(/[^\p{Letter}\p{Number}\s_-]/gu,'')
				.replace(/\s+/g,'-')
				.replace(/-+/g,'-')
				.replace(/^-|-$/g,'');
			return slug || 'section';
		};
		const titleFor=heading=>{
			const clone=heading.cloneNode(true);
			clone.querySelectorAll('.anchor-heading').forEach(anchor=>anchor.remove());
			return clone.textContent.trim().replace(/\s+/g,' ');
		};

		headings.forEach(heading=>{
			const title=titleFor(heading);
			let id=heading.id || slugify(title);
			let uniqueId=id;
			let index=2;
			while(usedIds.has(uniqueId) || (document.getElementById(uniqueId) && document.getElementById(uniqueId)!==heading)){
				uniqueId=id + '-' + index;
				index += 1;
			}
			usedIds.add(uniqueId);
			if(heading.id !== uniqueId) heading.id=uniqueId;
		});

		const list=document.createElement('ol');
		list.className='content-index__list';

		headings.forEach(heading=>{
			const level=Number.parseInt(heading.tagName.slice(1), 10);
			const item=document.createElement('li');
			item.className='content-index__item content-index__item--h' + level;

			const link=document.createElement('a');
			link.className='content-index__link';
			link.href='#' + encodeURIComponent(heading.id);
			link.textContent=titleFor(heading);
			link.addEventListener('click', function(){
				setActive(heading.id);
				window.setTimeout(updateActiveFromScroll, 120);
			});

			item.appendChild(link);
			list.appendChild(item);
		});

		nav.innerHTML='';
		nav.appendChild(list);
		document.body.classList.add('has-content-index');

		const links=[...nav.querySelectorAll('.content-index__link')];
		function setActive(id){
			links.forEach(link=>{
				const active=decodeURIComponent(link.hash.slice(1))===id;
				link.classList.toggle('active', active);
				if(active) link.setAttribute('aria-current','true');
				else link.removeAttribute('aria-current');
			});
		}

		let ticking=false;
		function currentHeading(){
			const offset=window.innerHeight < 700 ? 90 : 130;
			const scrollBottom=window.scrollY + window.innerHeight;
			const pageBottom=document.documentElement.scrollHeight - 2;
			if(scrollBottom >= pageBottom) return headings[headings.length - 1];

			const position=window.scrollY + offset;
			let active=headings[0];
			headings.forEach(heading=>{
				if(heading.offsetTop <= position) active=heading;
			});
			return active;
		}
		function updateActiveFromScroll(){
			setActive(currentHeading().id);
			ticking=false;
		}
		window.addEventListener('scroll', ()=>{
			if(ticking) return;
			ticking=true;
			window.requestAnimationFrame(updateActiveFromScroll);
		}, {passive:true});
		window.addEventListener('hashchange', ()=>{
			const targetId=decodeURIComponent(window.location.hash.slice(1));
			if(targetId) setActive(targetId);
			window.setTimeout(updateActiveFromScroll, 120);
		});

		setActive(headings[0].id);
		updateActiveFromScroll();
	}

	function initRecent(){
		const root=document.getElementById('recent-root');
		if(!root) return; // not index
		const perPage=parseInt(root.getAttribute('data-per-page')||'20',10);
		const list=document.getElementById('recent-list');
		const pagination=document.getElementById('recent-pagination');
		let data=[];
		const tpl=document.getElementById('recent-data');
		if(tpl){
			try { data=JSON.parse(tpl.innerHTML.trim()||'[]'); } catch(e){ console.error('recent-data parse error',e); }
		}
		if(!data.length){ list.innerHTML='<div class="recent-empty">문서가 없습니다.</div>'; return; }
		// sort again for safety
		data.sort((a,b)=>{ if(a.date && b.date) return a.date < b.date ? 1 : -1; if(a.date && !b.date) return -1; if(!a.date && b.date) return 1; return (a.title||'').localeCompare(b.title||'', 'ko'); });
		let currentPage=1; const total=data.length; const totalPages=Math.max(1, Math.ceil(total/perPage));
		// Update total count
		const totalCountEl=document.getElementById('total-count');
		if(totalCountEl){ totalCountEl.textContent=total; }
		function pageItems(page){
			const start=(page-1)*perPage;
			return data.slice(start, start+perPage);
		}
		function escapeHtml(value){
			return String(value || '')
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#39;');
		}
		function renderTitle(value){
			return escapeHtml(value).replace(/&lt;br\s*\/?&gt;/gi, '<br>');
		}
		function renderPage(page){
			currentPage=Math.min(Math.max(1, page), totalPages);
			const frag=document.createDocumentFragment();
			pageItems(currentPage).forEach(it=>{
				const li=document.createElement('li');
				const dateStr = (it.date || '').replace(/-/g, '.');
				const title = it.title||'(제목없음)';
				const filename = title;
				const summary = (it.summary || '').trim();
				
				li.innerHTML = 
					'<span class="r-date">' + escapeHtml(dateStr) + '</span>' +
					'<span class="r-title"><a href="'+ encodeURI(it.url) +'">' + renderTitle(filename) + '</a>' +
						(summary ? '<span class="r-summary">' + escapeHtml(summary) + '</span>' : '') +
					'</span>';
				frag.appendChild(li);
			});
			list.innerHTML='';
			list.appendChild(frag);
			renderPagination();
		}
		function paginationWindow(){
			if(totalPages<=10) return Array.from({length:totalPages}, (_,i)=>i+1);
			const pages=[1];
			const start=Math.max(2, currentPage-2);
			const end=Math.min(totalPages-1, currentPage+2);
			if(start>2) pages.push('ellipsis-start');
			for(let i=start;i<=end;i++) pages.push(i);
			if(end<totalPages-1) pages.push('ellipsis-end');
			pages.push(totalPages);
			return pages;
		}
		function renderPagination(){
			if(!pagination) return;
			if(totalPages<=1){ pagination.innerHTML=''; pagination.style.display='none'; return; }
			pagination.style.display='flex';
			pagination.innerHTML=paginationWindow().map(item=>{
				if(typeof item==='string') return '<span class="recent-page-ellipsis" aria-hidden="true">...</span>';
				const active=item===currentPage;
				return '<button type="button" class="recent-page-btn' + (active ? ' active' : '') + '" data-page="' + item + '" aria-label="Page ' + item + '"' + (active ? ' aria-current="page"' : '') + '>' + item + '</button>';
			}).join('');
		}
		if(pagination){
			pagination.addEventListener('click', e=>{
				const target=e.target;
				if(!target || !target.getAttribute) return;
				const page=Number.parseInt(target.getAttribute('data-page')||'',10);
				if(!Number.isFinite(page)) return;
				renderPage(page);
			});
		}
		renderPage(1);
	}

	document.addEventListener('DOMContentLoaded', function(){initThemeToggle();initTranslation();addLangBadges();/* reading time 제거 */initRecent();initContentIndex();ensurePrintableHyperlinks();});
})();
