const fs = require('fs');

async function scrapeAndInject() {
    try {
        const res = await fetch('https://mosiqati.com/wp-json/wc/store/products?per_page=30');
        const products = await res.json();
        
        let htmlContent = '';
        let delay = 1;

        products.forEach(p => {
            const name = p.name;
            const priceHtml = p.price_html || `<span class="price-new">${(p.prices.price / Math.pow(10, p.prices.currency_minor_unit)).toFixed(2)} JOD</span>`;
            
            // Extract text from priceHtml since it comes as raw HTML from woo
            let cleanPrice = priceHtml.replace(/<[^>]*>?/gm, '').replace('&nbsp;', ' ').trim();
            if (!cleanPrice) cleanPrice = (p.prices.price / Math.pow(10, p.prices.currency_minor_unit)) + " JOD";
            
            const category = (p.categories && p.categories.length > 0) ? p.categories[0].name : 'آلات موسيقية';
            const catSlug = (p.categories && p.categories.length > 0) ? p.categories[0].slug : 'all';
            const imageUrl = (p.images && p.images.length > 0) ? p.images[0].src : 'images/premium_oud.png';
            
            // Short description
            let desc = p.short_description || p.description || 'منتج موسيقي رائع من موسيقاتي لتعزيز أدائك الموسيقي.';
            desc = desc.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...';

            htmlContent += `
                <!-- Product -->
                <div class="product-card reveal reveal-delay-${delay}" data-category="${catSlug}">
                    <div class="product-img-wrap">
                        <img src="${imageUrl}" alt="${name}" class="product-img" style="object-fit:cover; background:#111;">
                        <div class="product-img-overlay">
                            <button class="btn-quick-view">معاينة سريعة</button>
                        </div>
                    </div>
                    <div class="product-info">
                        <span class="product-cat">${category}</span>
                        <h3 class="product-name" style="font-size:1.1rem;">${name}</h3>
                        <p class="product-desc-text" style="font-size:0.85rem;">${desc}</p>
                        <div class="product-footer">
                            <div class="price-wrap">
                                <span class="price-new" style="color:var(--gold); font-weight:bold;">${cleanPrice}</span>
                            </div>
                            <button class="btn-cart"><i class="fa-solid fa-cart-shopping"></i></button>
                        </div>
                    </div>
                </div>
            `;
            
            delay = delay >= 3 ? 1 : delay + 1;
        });

        // Read store.html
        let storeFile = fs.readFileSync('store.html', 'utf8');
        
        // Replace the grid content
        const startMarker = '<div class="product-grid" id="products-grid">';
        const endMarker = '</div>\r\n        </div>\r\n    </section>\r\n\r\n    <!-- PROMOTIONAL ANIMATION SECTION -->';
        
        const startIndex = storeFile.indexOf(startMarker);
        let endIndex = storeFile.indexOf('</section>', startIndex);
        
        if (startIndex !== -1 && endIndex !== -1) {
            // Re-construct the file
            // Let's find the closing div of product-grid
            const before = storeFile.substring(0, startIndex + startMarker.length);
            // End index should be right before the closing div of the container or just replace the whole section inner
            
            // Safer Regex replace
            storeFile = storeFile.replace(
                /<div class="product-grid" id="products-grid">[\s\S]*?<\/section>/,
                `<div class="product-grid" id="products-grid">\n${htmlContent}\n</div>\n        </div>\n    </section>`
            );
            
            fs.writeFileSync('store.html', storeFile, 'utf8');
            console.log('Successfully injected ' + products.length + ' products into store.html');
        } else {
            console.log('Could not find injection markers in store.html');
        }

    } catch (e) {
        console.error(e);
    }
}

scrapeAndInject();
