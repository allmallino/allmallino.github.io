async function getProducts(page = 1) {
    let limit =window.innerWidth>=1280?9:6;
    var products = await fetch('https://voodoo-sandbox.myshopify.com/products.json?limit='+limit+"&page="+page)
    .then(response => response.json())
    .then(data => { return data.products });
    console.log(products);

    let table = document.getElementById("table");
    table.innerHTML="";
    let fragment = document.createDocumentFragment();
    for(let i=0; i<products.length; i++){
        let product = products[i];
        let article = document.createElement("article");
        article.classList.add("w-44", "xl:w-72");

        let img = document.createElement("img");
        img.src=product.images.length>=1?product.images[0].src:"./images/shopify_image.png";
        img.classList.add("w-44", "h-44", "xl:w-72", "xl:h-72", "rounded-3xl", "mb-4", "object-cover");
        article.appendChild(img);

        let h4 = document.createElement("h4");
        h4.textContent=product.title;
        h4.classList.add("xl:text-xl","font-bold", "mb-2.5", "truncate", "w-full");
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
        rate.classList.add("text-xs", "xl:text-sm");

        let full = document.createElement("span");
        full.textContent="5"
        full.classList.add("text-halfgray");
        rate.appendChild(full);
        conteiner.appendChild(rate);
        article.appendChild(conteiner);

        let cost = document.createElement('h3');
        cost.textContent="$"+product.variants[0].price.replace(".00","");
        cost.classList.add("text-xl", "xl:text-2xl", "font-bold")
        article.appendChild(cost);
        fragment.appendChild(article);
    }
    table.appendChild(fragment);
    renderPage(page);
}


function createTableLi(cf, options) {
  let li = document.createElement('li');
  let a = document.createElement('a');
  a.href = "#label";
  a.className = options.cl;
  a.text = options.txt;
  a.onclick = cf;
  li.append(a);
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
      fragmet.append(createTableLi(() => getProducts(i), { cl: "rounded-lg flex items-center justify-center xl:w-10 xl:h-10 w-9 h-9 ", txt: i }));
    }
    points = document.createElement('li');
    points.textContent = "...";
    points.className="rounded-lg flex items-center justify-center xl:w-10 xl:h-10 w-9 h-9";
    fragmet.append(points);
    
    for (let i = count-1-Math.floor(limit/9); i <= count; i++) {
      let selected = i === index  ? "text-black bg-lightblack" : "";
      fragmet.append(createTableLi(() => getProducts(i), { cl: "rounded-lg flex items-center justify-center xl:w-10 xl:h-10 w-9 h-9 "+ selected, txt: i}));
    }
  }
  else if (index > 2) {
    fragmet.append(createTableLi(() => getProducts(1), { cl: "rounded-lg flex items-center justify-center xl:w-10 xl:h-10 w-9 h-9", txt: "1" }));
    points = document.createElement('li');
    points.textContent = "...";
    points.className="rounded-lg flex items-center justify-center xl:w-10 xl:h-10 w-9 h-9";
    fragmet.append(points);
    for (let i = -Math.floor(limit/9); i <= Math.floor(limit/9) && i + index <= count; i++) {
      let selected = i === 0  ? "text-black bg-lightblack" : "";
      fragmet.append(createTableLi(() => getProducts(i + index), { cl: "rounded-lg flex items-center justify-center xl:w-10 xl:h-10 w-9 h-9 "+ selected, txt: i + index }));
    }
    points = document.createElement('li');
    points.textContent = "...";
    points.className="rounded-lg flex items-center justify-center xl:w-10 xl:h-10 w-9 h-9";
    fragmet.append(points);
    fragmet.append(createTableLi(() => getProducts(count), { cl: "rounded-lg flex items-center justify-center xl:w-10 xl:h-10 w-9 h-9", txt: count }));
  }
  else {
      for (let i = 1; i <= 2+Math.floor(limit/9); i++) {
        let selected = i === index ? "text-black bg-lightblack" : "";
        fragmet.append(createTableLi(() => getProducts(i), { cl: "rounded-lg flex items-center justify-center xl:w-10 xl:h-10 w-9 h-9 "+ selected, txt: i }));
      }
      
      points = document.createElement('li');
      points.textContent = "...";
      points.className="rounded-lg flex items-center justify-center xl:w-10 xl:h-10 w-9 h-9";
      fragmet.append(points);

      for (let i = count-1-Math.floor(limit/9); i <= count; i++) {
        fragmet.append(createTableLi(() => getProducts(i), { cl: "rounded-lg flex items-center justify-center xl:w-10 xl:h-10 w-9 h-9", txt: i }));
      }
  }
  pageList.append(fragmet);
}

getProducts();