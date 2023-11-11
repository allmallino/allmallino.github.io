async function getProducts(page = 0) {
    let limit =window.innerWidth>=1280?9:6;
    var products = await fetch('https://voodoo-sandbox.myshopify.com/products.json?limit='+limit)
    .then(response => response.json())
    .then(data => { return data.products });
    console.log(products);

    var ratings = await fetch('https://voodoo-sandbox.myshopify.com/products.json?limit=9')
    .then(response => response.json());

    console.log(ratings);

    let table = document.getElementById("table")
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

}

/*
<article>
  <img src="./shopify_image.png" class="w-72 h-72 rounded-3xl mb-4"/>
  <h4 class="text-xl font-bold mb-2.5">Gradient Graphic T-shirt</h4>
  <div class="flex gap-3 mb-2.5">
    <div class="flex gap-1">
      <img src="./svg/full_star_icon.svg"/>
      <img src="./svg/full_star_icon.svg"/>
      <img src="./svg/full_star_icon.svg"/>
      <img src="./svg/half_star_icon.svg"/>
    </div>
    <span class="text-sm">3.5/<span class="text-halfgray">5</span></span>
  </div>
  <h3 class="text-2xl font-bold">$145</h3>
</article>
*/
getProducts();