async function getProducts(page = 1) {
    let limit =window.innerWidth>=1280?9:6;
    let products = await fetch('https://voodoo-sandbox.myshopify.com/products.json?limit='+limit+"&page="+page)
    .then(response => response.json())
    .then(data => { return data.products });
    
    let table = document.getElementById("table");
    table.innerHTML="";
    let fragment = document.createDocumentFragment();
    for(let i=0; i<products.length; i++){
        fragment.appendChild(createProductCard(products[i]));
    }
    table.appendChild(fragment);
    renderPage(page);
}

function createProductPopUp(product, options){
  let selectedProduct=product.variants.filter((v)=>{
    for(let i=0 ; i<options.length; i++){
      if(v["option"+(i+1)]!==product.options[i].values[options[i]]){
        return false;
      }
    }
    return true;
  })[0];
  let variants = document.getElementById('variants')
  variants.innerHTML="";
  let div, name, optionList, option, line;
  let fragment = document.createDocumentFragment();
  for(let i=0;i<product.options.length;i++){
    div=document.createElement('div');
    div.className="text-halfgray";
    name=document.createElement('span');
    name.className="text-halfgray text-sm lg:text-base";
    name.textContent="Select "+product.options[i].name;
    div.appendChild(name);
    optionList=document.createElement('div');
    optionList.className="text-halfgray";
    if(product.options[i].name==="Color"){
      optionList.className="flex gap-3 lg:gap-4 mt-4 overflow-x-auto w-full";
      for(let j=0; j<product.options[i].values.length;j++){
        option=document.createElement('div');
        option.className="border border-transparentgray rounded-full inline-block w-9 h-9 flex items-center justify-center cursor-pointer flex-shrink-0 bg-"+product.options[i].values[j].toLowerCase()
        if(j===options[i]){
          let check = document.createElement("img");
          if(product.options[i].values[j].toLowerCase()==="white"){
            check.className="bg-halfgray rounded-full p-1";
          }
          check.src="./svg/check_icon.svg";
          option.appendChild(check);
        }
        option.onclick=()=>{options[i]=j;createProductPopUp(product, options)};
        optionList.appendChild(option);
      }
    }else{
      optionList.className="flex gap-2 lg:gap-3 flex-wrap mt-4 text-sm lg:text-base lg:leading-5 overflow-x-auto w-full"
      for(let j=0; j<product.options[i].values.length;j++){
        option=document.createElement('span');
        let selected = j===options[i]?"bg-black text-white":"bg-gray";
        option.className="py-2.5 lg:py-3 px-5 lg:px-6 rounded-full cursor-pointer flex-shrink-0 "+selected;
        option.textContent=product.options[i].values[j];
        option.onclick=()=>{options[i]=j;createProductPopUp(product, options)};
        optionList.appendChild(option);
      }
    }
    div.appendChild(optionList);
    fragment.appendChild(div);
    line = document.createElement('hr')
    line.className="text-transparentgray my-6";
    fragment.appendChild(line);
  }
  variants.appendChild(fragment);
  if(typeof selectedProduct == 'undefined'){
    document.getElementById("buybutton").textContent="Not available";
    document.getElementById("buybutton").disabled = true;
    return;
  }else if(!selectedProduct.available){
    document.getElementById("buybutton").textContent="Not available";
    document.getElementById("buybutton").disabled = true;
  }else{
    document.getElementById("buybutton").textContent="Add to Cart";
    document.getElementById("buybutton").disabled = false;
  }

  document.getElementById('pop-up').classList.replace('hidden', "flex");
  document.getElementById('image').src=selectedProduct.featured_image?selectedProduct.featured_image.src:"./images/shopify_image.png";
  document.getElementById('name').textContent=product.title;
  document.getElementById('price').textContent="$"+selectedProduct.price.toString().replace(".00", "");
  if(selectedProduct.compare_at_price !== null && parseFloat(selectedProduct.compare_at_price)>parseFloat(selectedProduct.price)){
    document.getElementById('oldprice').classList.replace('hidden', "flex");
    document.getElementById('oldprice').textContent="$"+selectedProduct.compare_at_price.toString().replace(".00", "");

    document.getElementById('discount').classList.replace('hidden', "flex");
    document.getElementById('discount').textContent="-"+(100-Math.floor(parseFloat(selectedProduct.price)/parseFloat(selectedProduct.compare_at_price)*100))+"%";
  }else{
    document.getElementById('oldprice').classList.replace('flex', "hidden");
    document.getElementById('discount').classList.replace('flex', "hidden");
  }
  let rating = document.getElementById('rating');
  rating.innerHTML="";
  let stars = document.createElement("div");
  stars.classList.add("flex", "gap-2");
  for(let j=0; j<3;j++){
      let star = document.createElement("img");
      star.src="./svg/full_star_icon.svg";
      stars.appendChild(star);
  }
  let half_star= document.createElement("img");
  half_star.src="./svg/half_star_icon.svg";
  stars.appendChild(half_star);
  rating.appendChild(stars);
  let rate = document.createElement("span");
  rate.textContent="3.5/";
  let full = document.createElement("span");
  full.textContent="5"
  full.classList.add("text-halfgray");
  rate.appendChild(full);
  rating.appendChild(rate);
  document.getElementById('description').innerHTML=product.body_html?product.body_html:product.description?product.description:"";
  return true;
}

function createProductCard(product, ...classList){
  let article = document.createElement("article");
  article.classList.add("w-44", "lg:w-72", "cursor-pointer", ...classList);
  article.onclick= async () => {
    createProductPopUp(product, product.options.map(()=>{return 0}));
    let recommendation = document.getElementById('recommendation');
    recommendation.innerHTML="";
    let recList= await fetch('https://voodoo-dev-store.com/recommendations/products.json?product_id='+product.id)
    .then(response => response.json())
    .then(data => { return data.products });
    fragment = document.createDocumentFragment();
    for(let i = 0; i<recList.length; i++){
      fragment.appendChild(createProductCard(recList[i],"flex-shrink-0"));
    }
    recommendation.appendChild(fragment);
  }

  let img = document.createElement("img");
  img.src=product.featured_image?product.featured_image:product.images[0]?product.images[0].src:"./images/shopify_image.png";
  img.classList.add("w-44", "h-44", "lg:w-72", "lg:h-72", "rounded-3xl", "mb-4", "object-cover");
  article.appendChild(img);

  let h4 = document.createElement("h4");
  h4.textContent=product.title;
  h4.classList.add("lg:text-xl","font-bold", "mb-2.5", "truncate", "w-full");
  article.appendChild(h4);

  let conteiner = document.createElement("div");
  conteiner.classList.add("flex", "gap-3", "mb-2.5");

  let stars = document.createElement("div");
  stars.classList.add("flex", "gap-1");

  for(let j=0; j<3;j++){
      let star = document.createElement("img");
      star.src="./svg/full_star_icon.svg";
      stars.appendChild(star);
  }

  let half_star= document.createElement("img");
  half_star.src="./svg/half_star_icon.svg";
  stars.appendChild(half_star);
  conteiner.appendChild(stars);

  let rate = document.createElement("span");
  rate.textContent="3.5/";
  rate.classList.add("text-xs", "lg:text-sm");

  let full = document.createElement("span");
  full.textContent="5"
  full.classList.add("text-halfgray");
  rate.appendChild(full);
  conteiner.appendChild(rate);
  article.appendChild(conteiner);
  
  let oldPrice=product.compare_at_price?product.compare_at_price:product.variants[0].compare_at_price;
  let newPrice=product.price?product.price:product.variants[0].price;
  let div = document.createElement('div');
  div.classList.add("text-xl", "lg:text-2xl", "font-bold", "flex", "gap-1", "lg:gap-2.5", "items-center", "flex-wrap");
  let nCost = document.createElement('h3');
  nCost.textContent="$"+newPrice.toString().replace(".00", "");
  div.appendChild(nCost);
  if(oldPrice !== null && parseFloat(oldPrice)>parseFloat(newPrice)){
    let oCost = document.createElement('h3');
    oCost.textContent="$"+oldPrice.toString().replace(".00", "");
    oCost.className="text-gray40% line-through decoration-2";
    div.appendChild(oCost);

    let discount = document.createElement('span');
    discount.textContent="-"+(100-Math.floor(parseFloat(newPrice)/parseFloat(oldPrice)*100))+"%";
    discount.className="bg-lightred text-textred px-3.5 py-1.5 rounded-full lg:leading-5 font-medium text-xxs lg:text-xs";
    div.appendChild(discount);
  }
  article.appendChild(div);
  return article;
}

function createTableLi(cf, options) {
  let li = document.createElement('li');
  let span = document.createElement('span');
  span.className = options.cl;
  span.textContent = options.txt;
  span.onclick = cf;
  li.append(span);
  return li;
}

function renderPage(index=1){
  let pageList = document.getElementById("page_list");
  pageList.innerHTML = "";
  let fragmet = document.createDocumentFragment();
  let limit = window.innerWidth>=1280?9:6;
  let count = Math.ceil(461.0/limit);
  document.getElementById("prevBtn").onclick=()=>{getProducts(Math.max(index-1,1));};
  document.getElementById("nextBtn").onclick=()=>{getProducts(Math.min(index+1,count));};
  let points;
  if(index == count || index + 1 == count){
    for (let i = 1; i <= 2+Math.floor(limit/9); i++) {
      fragmet.append(createTableLi(() => getProducts(i), { cl: "rounded-lg flex items-center justify-center lg:w-10 lg:h-10 w-9 h-9 cursor-pointer", txt: i }));
    }
    points = document.createElement('li');
    points.textContent = "...";
    points.className="rounded-lg flex items-center justify-center lg:w-10 lg:h-10 w-9 h-9";
    fragmet.append(points);
    
    for (let i = count-1-Math.floor(limit/9); i <= count; i++) {
      let selected = i === index  ? "text-black bg-lightblack" : "cursor-pointer";
      fragmet.append(createTableLi(() => getProducts(i), { cl: "rounded-lg flex items-center justify-center lg:w-10 lg:h-10 w-9 h-9 "+ selected, txt: i}));
    }
  }
  else if (index > 2) {
    fragmet.append(createTableLi(() => getProducts(1), { cl: "rounded-lg flex items-center justify-center lg:w-10 lg:h-10 w-9 h-9 cursor-pointer", txt: "1" }));
    points = document.createElement('li');
    points.textContent = "...";
    points.className="rounded-lg flex items-center justify-center lg:w-10 lg:h-10 w-9 h-9";
    fragmet.append(points);
    for (let i = -Math.floor(limit/9); i <= Math.floor(limit/9) && i + index <= count; i++) {
      let selected = i === 0  ? "text-black bg-lightblack" : "cursor-pointer";
      fragmet.append(createTableLi(() => getProducts(i + index), { cl: "rounded-lg flex items-center justify-center lg:w-10 lg:h-10 w-9 h-9 "+ selected, txt: i + index }));
    }
    points = document.createElement('li');
    points.textContent = "...";
    points.className="rounded-lg flex items-center justify-center lg:w-10 lg:h-10 w-9 h-9";
    fragmet.append(points);
    fragmet.append(createTableLi(() => getProducts(count), { cl: "rounded-lg flex items-center justify-center lg:w-10 lg:h-10 w-9 h-9 cursor-pointer", txt: count }));
  }
  else {
      for (let i = 1; i <= 2+Math.floor(limit/9); i++) {
        let selected = i === index ? "text-black bg-lightblack" : "cursor-pointer";
        fragmet.append(createTableLi(() => getProducts(i), { cl: "rounded-lg flex items-center justify-center lg:w-10 lg:h-10 w-9 h-9 "+ selected, txt: i }));
      }
      
      points = document.createElement('li');
      points.textContent = "...";
      points.className="rounded-lg flex items-center justify-center lg:w-10 lg:h-10 w-9 h-9";
      fragmet.append(points);

      for (let i = count-1-Math.floor(limit/9); i <= count; i++) {
        fragmet.append(createTableLi(() => getProducts(i), { cl: "rounded-lg flex items-center justify-center lg:w-10 lg:h-10 w-9 h-9 cursor-pointer", txt: i }));
      }
  }
  pageList.append(fragmet);
}

getProducts();