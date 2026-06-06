const fs = require('fs');

async function scrapeAndInjectIndex() {
    try {
        const res = await fetch('https://mosiqati.com/wp-json/wc/store/products?per_page=3');
        const products = await res.json();
        
        let htmlContent = '';
        let delay = 1;

        products.forEach(p => {
            const name = p.name;
            const priceHtml = p.price_html || `<span class="price-new">${(p.prices.price / Math.pow(10, p.prices.currency_minor_unit)).toFixed(2)} JOD</span>`;
            
            let cleanPrice = priceHtml.replace(/<[^>]*>?/gm, '').replace('&nbsp;', ' ').trim();
            if (!cleanPrice) cleanPrice = (p.prices.price / Math.pow(10, p.prices.currency_minor_unit)) + " JOD";
            
            const category = (p.categories && p.categories.length > 0) ? p.categories[0].name : 'آلات موسيقية';
            const imageUrl = (p.images && p.images.length > 0) ? p.images[0].src : 'images/premium_oud.png';
            
            htmlContent += `
            <!-- Fetched Product -->
            <div class="product-card reveal reveal-delay-${delay}" style="background:var(--bg); border:1px solid rgba(255,255,255,0.05);">
                <div class="product-img-wrap">
                    <img src="${imageUrl}" alt="${name}" class="product-img" style="object-fit:cover; background:#111;">
                    <span class="product-tag tag-new">جديد</span>
                </div>
                <div class="product-info">
                    <span class="product-cat">${category}</span>
                    <h3 class="product-name" style="font-size:1.05rem;">${name}</h3>
                    <div class="product-footer">
                        <div class="price-wrap">
                            <span class="price-new" style="color:var(--gold); font-weight:bold;">${cleanPrice}</span>
                        </div>
                        <a href="store.html" class="btn-cart"><i class="fa-solid fa-cart-shopping"></i></a>
                    </div>
                </div>
            </div>
            `;
            delay++;
        });

        let indexFile = fs.readFileSync('index.html', 'utf8');
        
        // Find the grid-3 inside home-featured-products
        const startMarker = '<section class="section-padding" style="background:var(--bg-card);" id="home-featured-products">\r\n    <div class="container">\r\n        <div class="section-header reveal">\r\n            <span class="section-eyebrow">وصل حديثاً من موسيقاتي</span>\r\n            <h2 class="section-title">أحدث المنتجات المتوفرة</h2>\r\n        </div>\r\n        <div class="grid-3">';
        
        // Let's use a safer regex replacement for index.html as well
        indexFile = indexFile.replace(
            /<div class="grid-3">[\s\S]*?<div style="text-align:center; margin-top:40px;">/,
            `<div class="grid-3">\n${htmlContent}\n        </div>\n        <div style="text-align:center; margin-top:40px;">`
        );
        
        fs.writeFileSync('index.html', indexFile, 'utf8');
        console.log('Successfully injected 3 products into index.html');

    } catch (e) {
        console.error(e);
    }
}

scrapeAndInjectIndex();
