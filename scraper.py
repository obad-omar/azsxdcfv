import urllib.request
import re
import json

url = 'https://mosiqati.com/ar/%D9%85%D8%AA%D8%AC%D8%B1-%D8%A8%D9%8A%D8%B9-%D8%A7%D9%84%D8%A7%D8%AA-%D9%85%D9%88%D8%B3%D9%8A%D9%82%D9%8A%D8%A9-%D9%81%D9%8A-%D8%A7%D9%84%D8%A7%D8%B1%D8%AF%D9%86/?srsltid=AfmBOopNfdMW_Y0utapNkI36SFzMVmctSNba1CSPe3r7RurzfsbYIGSg&v=674f33841e23'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    products = []
    
    # Let's find WooCommerce products
    # <h2 class="woocommerce-loop-product__title">...</h2>
    # <span class="woocommerce-Price-amount amount"><bdi>...</bdi></span>
    
    blocks = re.split(r'<li class="[^"]*product[^"]*">', html)
    for block in blocks[1:]:
        title_match = re.search(r'<h2 class="woocommerce-loop-product__title">(.*?)</h2>', block)
        price_match = re.search(r'<span class="woocommerce-Price-amount amount"><bdi>(.*?)</bdi></span>', block)
        if title_match and price_match:
            title = re.sub(r'<[^>]+>', '', title_match.group(1)).strip()
            price = re.sub(r'<[^>]+>', '', price_match.group(1)).strip()
            # Clean up price (remove HTML entities like &nbsp;)
            price = price.replace('&nbsp;', ' ').replace('د.ا', '').strip()
            products.append({'title': title, 'price': price})

    print(json.dumps(products, ensure_ascii=False, indent=2))
except Exception as e:
    print('Error:', e)
