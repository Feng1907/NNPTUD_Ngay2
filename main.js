const productsEl = document.getElementById('products')
const loadingEl = document.getElementById('loading')
const categoryFilter = document.getElementById('categoryFilter')
const searchInput = document.getElementById('searchInput')
let allData = []

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
}

function renderProducts(items){
	productsEl.innerHTML = ''
	if(!items || items.length===0){
		productsEl.textContent = 'Không có sản phẩm.'
		return
	}
	items.forEach(it=>{
		const card = document.createElement('div')
		card.className = 'card'
		const img = document.createElement('img')
		img.src = (it.images && it.images[0]) || 'https://placehold.co/600x400'
		img.alt = it.title
		const meta = document.createElement('div')
		meta.className = 'meta'
		const title = document.createElement('h3')
		title.className = 'title'
		title.textContent = it.title
		const cat = document.createElement('div')
		cat.className = 'category'
		cat.textContent = it.category ? it.category.name : ''
		const price = document.createElement('div')
		price.className = 'price'
		price.textContent = it.price + ' $'

		meta.appendChild(title)
		meta.appendChild(cat)
		meta.appendChild(price)
		card.appendChild(img)
		card.appendChild(meta)
		productsEl.appendChild(card)
	})
}

function applyFilters(){
	let filtered = Array.isArray(allData) ? allData.slice() : []
	const catVal = categoryFilter.value
	const q = (searchInput && searchInput.value ? searchInput.value.trim().toLowerCase() : '')
	if(catVal) filtered = filtered.filter(p=>p.category && String(p.category.id)===catVal)
	if(q) filtered = filtered.filter(p=>p.title && p.title.toLowerCase().includes(q))
	renderProducts(filtered)
}

loadData()
