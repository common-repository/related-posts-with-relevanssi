
function rpwr_reorder(){
	console.log("On load");
	
	
	Array.prototype.slice.call(document.querySelectorAll('.rpwr-wrap')).map((elBlock, k)=>{ 
    	if(elBlock.dataset.sortOrder=='random'){
            let res = Array(elBlock.querySelectorAll('.rpwr-cell-cnt').length).fill().map((_, i) => i+1).sort(() => Math.random() - 0.5);
            Array.prototype.slice.call(elBlock.querySelectorAll('.rpwr-cell-cnt')).map((el, k)=>{ el.style.order = res[k]; });
        }

        if(elBlock.dataset.sortOrder=='alpha_asc'){
            let res = Array();
            let blockElLst = elBlock.querySelectorAll('.rpwr-cell-cnt')
            for (var i = 0; i < blockElLst.length; ++i) { res.push({'pos': i, 'val': blockElLst[i].dataset['title']}); }
            res.sort((a, b)=>{ 
                let nameA = a.val.toUpperCase(); 
                let nameB = b.val.toUpperCase(); 
                if (nameA < nameB) { return -1; }
                if (nameA > nameB) { return 1; }
                return 0;
            });

            res.forEach((resEl, index)=>{ blockElLst[resEl.pos].style.order =  index; });
        }

        if(elBlock.dataset.sortOrder=='alpha_desc'){
            let res = Array();
            let blockElLst = elBlock.querySelectorAll('.rpwr-cell-cnt')
            for (var i = 0; i < blockElLst.length; ++i) { res.push({'pos': i, 'val': blockElLst[i].dataset['title']}); }
            res.sort((a, b)=>{ 
                let nameA = a.val.toUpperCase(); 
                let nameB = b.val.toUpperCase(); 
                if (nameA > nameB) { return -1; }
                if (nameA < nameB) { return 1; }
                return 0;
            });

            res.forEach((resEl, index)=>{ blockElLst[resEl.pos].style.order =  index; });
        }

        if(elBlock.dataset.sortOrder=='date_asc'){
            let res = Array();
            let blockElLst = elBlock.querySelectorAll('.rpwr-cell-cnt')
            for (var i = 0; i < blockElLst.length; ++i) { res.push({'pos': i, 'val': blockElLst[i].dataset['date']}); }
            res.sort((a, b)=>{ 
                let nameA = parseInt(a.val); 
                let nameB = parseInt(b.val); 
                if (nameA < nameB) { return -1; }
                if (nameA > nameB) { return 1; }
                return 0;
            });

            res.forEach((resEl, index)=>{ blockElLst[resEl.pos].style.order =  index; });
        }

        if(elBlock.dataset.sortOrder=='date_desc'){
            let res = Array();
            let blockElLst = elBlock.querySelectorAll('.rpwr-cell-cnt')
            for (var i = 0; i < blockElLst.length; ++i) { res.push({'pos': i, 'val': blockElLst[i].dataset['date']}); }
            res.sort((a, b)=>{ 
                let nameA = parseInt(a.val); 
                let nameB = parseInt(b.val); 
                if (nameA > nameB) { return -1; }
                if (nameA < nameB) { return 1; }
                return 0;
            });

            res.forEach((resEl, index)=>{ blockElLst[resEl.pos].style.order =  index; });
        }
    });
}

function rpwr_scrollLeft(id){
	document.getElementById(id).scrollLeft -= document.querySelectorAll(".rpwr-cell")[0].offsetWidth;
}

function rpwr_scrollRight(id){
	document.getElementById(id).scrollLeft += document.querySelectorAll(".rpwr-cell")[0].offsetWidth;
}

document.addEventListener("DOMContentLoaded", (event)=>{
	let observer = new MutationObserver(mutationRecords => { mutationRecords.forEach(function(mutation){ if(mutation.addedNodes.length>0){ mutation.addedNodes.forEach(node=>{	if(node.querySelectorAll('.rpwr-wrap').length>0){ rpwr_reorder(); }	});	} }); });
	if(document.querySelector('#editor')) observer.observe(document.querySelector('#editor'), {childList: true, subtree: true, characterDataOldValue: true });
	rpwr_reorder();
	
    if(document.getElementById('rpwr-wrap-popup-close')) document.getElementById('rpwr-wrap-popup-close').addEventListener("click", (e)=>{ 
        document.getElementById('rpwr-wrap-popup').classList.add('hidden');
        e.preventDefault();
    });

    window.addEventListener("scroll", (e)=>{
    	if(document.getElementById('rpwr-wrap-popup')){
		    if(document.getElementById('rpwr-wrap-popup-pos1') && document.getElementById('rpwr-wrap-popup-pos1') ** document.getElementById('rpwr-wrap-popup')){
		        let postRect1 = document.getElementById('rpwr-wrap-popup-pos1').getBoundingClientRect();
		        let postRect2 = document.getElementById('rpwr-wrap-popup-pos2').getBoundingClientRect();

		        if((postRect1.bottom<0)&&((postRect2.bottom-window.innerHeight)>0)){ 
		            let postPercent = 100*Math.abs(postRect1.bottom)/(document.getElementById('rpwr-wrap-popup-pos2').offsetTop-document.getElementById('rpwr-wrap-popup-pos1').offsetTop-window.innerHeight);

		            if(postPercent>=parseInt(document.getElementById('rpwr-wrap-popup').dataset.percent)){ 
		                document.getElementById('rpwr-wrap-popup').classList.remove('hidden');
		            }else{
		                document.getElementById('rpwr-wrap-popup').classList.add('hidden');
		            }
		        }
		    }
		}
    });
    
});
