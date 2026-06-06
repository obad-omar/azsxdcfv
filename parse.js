const fs = require('fs');
try {
    const html = fs.readFileSync('mosiqati_raw.html', 'utf8');
    const products = [];
    
    const titleRegex = /<h2 class="woocommerce-loop-product__title">(.*?)<\/h2>/g;
    const priceRegex = /<span class="woocommerce-Price-amount amount"><bdi>(.*?)<\/bdi><\/span>/g;
    
    let titleMatch;
    const titles = [];
    while ((titleMatch = titleRegex.exec(html)) !== null) {
        titles.push(titleMatch[1].replace(/<[^>]+>/g, '').trim());
    }
    
    let priceMatch;
    const prices = [];
    while ((priceMatch = priceRegex.exec(html)) !== null) {
        let p = priceMatch[1].replace(/<[^>]+>/g, '').trim();
        p = p.replace(/&nbsp;/g, ' ').replace(/د\.ا/g, '').trim();
        prices.push(p);
    }
    
    const count = Math.min(titles.length, prices.length);
    for (let i = 0; i < count; i++) {
        products.push({ title: titles[i], price: prices[i] });
    }
    
    console.log(JSON.stringify(products, null, 2));
} catch (e) {
    console.error(e);
}
