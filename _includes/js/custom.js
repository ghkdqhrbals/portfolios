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
	function addReadingTime(){
		const content=document.querySelector('#main-content');
		if(!content) return; 
		const text=content.innerText||''; const words=text.trim().split(/\s+/).filter(Boolean).length; if(words < 120) return; // skip short
		const mins=Math.max(1, Math.round(words/200));
		const firstHeading=content.querySelector('h1,h2');
		const meta=document.createElement('div');
		meta.style.cssText='font-size:12px;color:#6b7280;margin:4px 0 18px;display:flex;gap:14px;';
		meta.innerHTML = '<span>⏱ '+mins+' min read</span><span>✍️ '+words+' words</span>';
		if(firstHeading){firstHeading.insertAdjacentElement('afterend', meta);} else {content.prepend(meta);}  
	}
	document.addEventListener('DOMContentLoaded', function(){addLangBadges();addReadingTime();});
})();
