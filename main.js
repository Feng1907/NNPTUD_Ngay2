const productsTbody = document.getElementById('productsTbody')
const loadingEl = document.getElementById('loading')
const categoryFilter = document.getElementById('categoryFilter')
const searchInput = document.getElementById('searchInput')
const sortNameAscBtn = document.getElementById('sortNameAsc')
const sortNameDescBtn = document.getElementById('sortNameDesc')
const sortPriceAscBtn = document.getElementById('sortPriceAsc')
const sortPriceDescBtn = document.getElementById('sortPriceDesc')
let allData = []
let sortState = null // { key: 'title'|'price', dir: 'asc'|'desc' }

async function loadData(){
	try{
		const res = await fetch('db.json')
		const data = await res.json()
		allData = data
		loadingEl.style.display = 'none'
		renderCategories(allData)
		renderProducts(allData)
	}catch(e){
		loadingEl.textContent = 'Lỗi khi tải dữ liệu.'
		console.error(e)
	}
}

function renderCategories(items){
	const cats = {}
	items.forEach(it=>{
		const c = it.category
		if(c && !cats[c.id]) cats[c.id] = c
	})
	Object.values(cats).forEach(c=>{
		const opt = document.createElement('option')
		opt.value = c.id
		opt.textContent = c.name
		categoryFilter.appendChild(opt)
	})
	categoryFilter.addEventListener('change',()=>{
		applyFilters()
	})
	if(searchInput){
		searchInput.addEventListener('input',()=>{
			applyFilters()
		})
	}

	// sort button handlers
	function clearActiveButtons(){
		[sortNameAscBtn, sortNameDescBtn, sortPriceAscBtn, sortPriceDescBtn].forEach(b=>{
			if(b) b.classList.remove('active')
		})
	}

	if(sortNameAscBtn) sortNameAscBtn.addEventListener('click',()=>{
		if(sortState && sortState.key==='title' && sortState.dir==='asc'){
			sortState = null
			clearActiveButtons()
		}else{
			sortState = {key:'title',dir:'asc'}
			clearActiveButtons()
			sortNameAscBtn.classList.add('active')
		}
		applyFilters()
	})
	if(sortNameDescBtn) sortNameDescBtn.addEventListener('click',()=>{
		if(sortState && sortState.key==='title' && sortState.dir==='desc'){
			sortState = null
			clearActiveButtons()
		}else{
			sortState = {key:'title',dir:'desc'}
			clearActiveButtons()
			sortNameDescBtn.classList.add('active')
		}
		applyFilters()
	})
	if(sortPriceAscBtn) sortPriceAscBtn.addEventListener('click',()=>{
		if(sortState && sortState.key==='price' && sortState.dir==='asc'){
			sortState = null
			clearActiveButtons()
		}else{
			sortState = {key:'price',dir:'asc'}
			clearActiveButtons()
			sortPriceAscBtn.classList.add('active')
		}
		applyFilters()
	})
	if(sortPriceDescBtn) sortPriceDescBtn.addEventListener('click',()=>{
		if(sortState && sortState.key==='price' && sortState.dir==='desc'){
			sortState = null
			clearActiveButtons()
		}else{
			sortState = {key:'price',dir:'desc'}
			clearActiveButtons()
			sortPriceDescBtn.classList.add('active')
		}
		applyFilters()
	})
}

function renderProducts(items){
	productsTbody.innerHTML = ''
	if(!items || items.length===0){
		const tr = document.createElement('tr')
		const td = document.createElement('td')
		td.colSpan = 6
		td.className = 'text-center text-muted'
		td.textContent = 'Không có sản phẩm.'
		tr.appendChild(td)
		productsTbody.appendChild(tr)
		return
	}
	items.forEach(it=>{
		const tr = document.createElement('tr')
		const idTd = document.createElement('td')
		idTd.textContent = it.id

		const titleTd = document.createElement('td')
		titleTd.textContent = it.title

		const imgTd = document.createElement('td')
		const img = document.createElement('img')
		img.src = (it.images && it.images[0]) || 'https://placehold.co/80x60'
		img.style.width = '80px'
		img.style.height = '60px'
		img.style.objectFit = 'cover'
		img.className = 'rounded'
		imgTd.appendChild(img)

		const catTd = document.createElement('td')
		catTd.textContent = it.category ? it.category.name : ''

		const priceTd = document.createElement('td')
		priceTd.textContent = (it.price != null) ? (it.price + ' $') : ''

		const createdTd = document.createElement('td')
		createdTd.textContent = it.creationAt ? new Date(it.creationAt).toLocaleString() : ''

		tr.appendChild(idTd)
		tr.appendChild(titleTd)
		tr.appendChild(imgTd)
		tr.appendChild(catTd)
		tr.appendChild(priceTd)
		tr.appendChild(createdTd)

		productsTbody.appendChild(tr)
	})
}

function applyFilters(){
	let filtered = Array.isArray(allData) ? allData.slice() : []
	const catVal = categoryFilter.value
	const q = (searchInput && searchInput.value ? searchInput.value.trim().toLowerCase() : '')
	if(catVal) filtered = filtered.filter(p=>p.category && String(p.category.id)===catVal)
	if(q) filtered = filtered.filter(p=>p.title && p.title.toLowerCase().includes(q))

	// apply sorting
	if(sortState && filtered.length>0){
		if(sortState.key==='title'){
			filtered.sort((a,b)=>{
				const ta = (a.title||'').toLowerCase()
				const tb = (b.title||'').toLowerCase()
				if(ta<tb) return sortState.dir==='asc' ? -1 : 1
				if(ta>tb) return sortState.dir==='asc' ? 1 : -1
				return 0
			})
		}else if(sortState.key==='price'){
			filtered.sort((a,b)=>{
				const na = Number(a.price)||0
				const nb = Number(b.price)||0
				return sortState.dir==='asc' ? na-nb : nb-na
			})
		}
	}
	renderProducts(filtered)
}

loadData()
