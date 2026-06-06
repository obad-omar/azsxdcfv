import json
import re

try:
    with open('mosiqati_raw.html', 'r', encoding='utf-8') as f:
        html = f.read()

    products = []
    
    # Try finding WooCommerce JSON-LD script tags
    matches = re.finditer(r'<script type="application/ld\+json" class="yoast-schema-graph">(.*?)</script>', html, re.DOTALL)
    for m in matches:
        data = json.loads(m.group(1))
        # yoast graph usually has an array of objects
        if '@graph' in data:
            for item in data['@graph']:
                if item.get('@type') == 'Product':
                    title = item.get('name', '')
                    offers = item.get('offers', {})
                    if isinstance(offers, list) and len(offers) > 0:
                        price = offers[0].get('price', '')
                    else:
                        price = offers.get('price', '')
                    if title:
                        products.append({'title': title, 'price': price})
    
    if not products:
        # Fallback to simple regex on titles and prices
        names = re.findall(r'<h2 class="woocommerce-loop-product__title">(.*?)</h2>', html)
        prices = re.findall(r'<bdi>([^<]*?)</bdi>', html)
        # Clean prices
        clean_prices = [p.replace('&nbsp;', ' ').replace('د.ا', '').strip() for p in prices if 'د.ا' in p or '&nbsp;' in p or p.replace('.','').isdigit()]
        
        for i in range(min(len(names), len(clean_prices))):
            products.append({'title': names[i].strip(), 'price': clean_prices[i].strip()})
            
    print(json.dumps(products, ensure_ascii=False, indent=2))
except Exception as e:
    print('Error:', e)
