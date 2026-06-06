const fs = require('fs');

const products = [
    {
        name: 'جيتار فيندر ستراتوكاستر',
        desc: 'جيتار كهربائي أسطوري بنغمة نقية وقوة أداء استثنائية. مثالي لعازفي الروك والبلوز.',
        cat: 'آلات وترية',
        slug: 'strings',
        price: '850.00 د.أ',
        img: 'images/electric_guitar.png',
        tag: 'الأكثر مبيعاً',
        tagClass: 'tag-hot'
    },
    {
        name: 'بيانو كاسيو AP-270',
        desc: 'بيانو رقمي يحاكي الإحساس الأكوستيكي بحساسية عالية ونظام صوت مجسم.',
        cat: 'آلات الكيبورد',
        slug: 'keyboards',
        price: '650.00 د.أ',
        img: 'images/grand_piano.png',
        tag: 'مميز',
        tagClass: 'tag-premium'
    },
    {
        name: 'عود تركي احترافي',
        desc: 'مصنوع يدوياً من خشب الجوز والماهوجني. رنين دافئ وأوتار احترافية لعزف لا مثيل له.',
        cat: 'آلات وترية',
        slug: 'strings',
        price: '350.00 د.أ',
        img: 'images/premium_oud.png',
        tag: 'جديد',
        tagClass: 'tag-new'
    },
    {
        name: 'دربكة صدفية شرقية',
        desc: 'دربكة مصنوعة من الألمنيوم المصبوب ومطعمة بالصدف الطبيعي لضبط إيقاعي دقيق.',
        cat: 'آلات إيقاعية',
        slug: 'percussion',
        price: '120.00 د.أ',
        img: 'images/darbuka.png',
        tag: '',
        tagClass: ''
    },
    {
        name: 'جيتار كورت كلاسيك',
        desc: 'تصميم كلاسيكي للمبتدئين والمحترفين، أوتار نايلون مريحة للأصابع ونغمة أندلسية.',
        cat: 'آلات وترية',
        slug: 'strings',
        price: '140.00 د.أ',
        img: 'images/electric_guitar.png',
        tag: 'نوصي به',
        tagClass: 'tag-hot'
    },
    {
        name: 'بيانو كنسرت ياماها',
        desc: 'تصميم فخم يعكس الرقي. أداء مسرحي بصوت يملأ القاعات الكبرى.',
        cat: 'آلات الكيبورد',
        slug: 'keyboards',
        price: '2,900.00 د.أ',
        img: 'images/grand_piano.png',
        tag: 'فاخر',
        tagClass: 'tag-premium'
    },
    {
        name: 'عود عراقي فاخر',
        desc: 'دقة صناعة عراقية أصيلة، وجه من خشب السيدار ومفاتيح من الأبنوس الخالص.',
        cat: 'آلات وترية',
        slug: 'strings',
        price: '480.00 د.أ',
        img: 'images/premium_oud.png',
        tag: '',
        tagClass: ''
    },
    {
        name: 'جيتار إيبانيز أرتكور',
        desc: 'جيتار مجوف مصمم خصيصاً لموسيقى الجاز. تجربة صوتية ناعمة وعميقة.',
        cat: 'آلات وترية',
        slug: 'strings',
        price: '620.00 د.أ',
        img: 'images/electric_guitar.png',
        tag: 'إصدار محدود',
        tagClass: 'tag-premium'
    },
    {
        name: 'دربكة إسكندراني نحاس',
        desc: 'دربكة ثقيلة الوزن بصوت إيقاعي يملأ المكان، مصنوعة من النحاس الخالص.',
        cat: 'آلات إيقاعية',
        slug: 'percussion',
        price: '180.00 د.أ',
        img: 'images/darbuka.png',
        tag: 'جديد',
        tagClass: 'tag-new'
    }
];

function buildStoreGrid() {
    let html = '';
    let delay = 1;
    products.forEach(p => {
        const tagHtml = p.tag ? `<span class="product-tag ${p.tagClass}">${p.tag}</span>` : '';
        html += `
                <!-- Product -->
                <div class="product-card reveal reveal-delay-${delay}" data-category="${p.slug}">
                    <div class="product-img-wrap">
                        <img src="${p.img}" alt="${p.name}" class="product-img" style="object-fit:cover; background:#111;">
                        <div class="product-img-overlay">
                            <button class="btn-quick-view">معاينة سريعة</button>
                        </div>
                        ${tagHtml}
                    </div>
                    <div class="product-info">
                        <span class="product-cat">${p.cat}</span>
                        <h3 class="product-name" style="font-size:1.2rem;">${p.name}</h3>
                        <p class="product-desc-text" style="font-size:0.9rem;">${p.desc}</p>
                        <div class="product-footer">
                            <div class="price-wrap">
                                <span class="price-new" style="color:var(--gold); font-weight:bold;">${p.price}</span>
                            </div>
                            <button class="btn-cart"><i class="fa-solid fa-cart-shopping"></i></button>
                        </div>
                    </div>
                </div>
        `;
        delay = delay >= 3 ? 1 : delay + 1;
    });
    return html;
}

function buildIndexGrid() {
    let html = '';
    let delay = 1;
    // Just take top 3 for index
    products.slice(0, 3).forEach(p => {
        const tagHtml = p.tag ? `<span class="product-tag ${p.tagClass}">${p.tag}</span>` : '';
        html += `
            <!-- Fetched Product -->
            <div class="product-card reveal reveal-delay-${delay}" style="background:var(--bg); border:1px solid rgba(255,255,255,0.05);">
                <div class="product-img-wrap">
                    <img src="${p.img}" alt="${p.name}" class="product-img" style="object-fit:cover; background:#111;">
                    ${tagHtml}
                </div>
                <div class="product-info">
                    <span class="product-cat">${p.cat}</span>
                    <h3 class="product-name" style="font-size:1.15rem;">${p.name}</h3>
                    <div class="product-footer">
                        <div class="price-wrap">
                            <span class="price-new" style="color:var(--gold); font-weight:bold;">${p.price}</span>
                        </div>
                        <a href="store.html" class="btn-cart"><i class="fa-solid fa-cart-shopping"></i></a>
                    </div>
                </div>
            </div>
        `;
        delay++;
    });
    return html;
}

try {
    let storeFile = fs.readFileSync('store.html', 'utf8');
    storeFile = storeFile.replace(
        /<div class="product-grid" id="products-grid">[\s\S]*?<\/section>/,
        `<div class="product-grid" id="products-grid">\n${buildStoreGrid()}\n</div>\n        </div>\n    </section>`
    );
    fs.writeFileSync('store.html', storeFile, 'utf8');
    
    let indexFile = fs.readFileSync('index.html', 'utf8');
    indexFile = indexFile.replace(
        /<div class="grid-3">[\s\S]*?<div style="text-align:center; margin-top:40px;">/,
        `<div class="grid-3">\n${buildIndexGrid()}\n        </div>\n        <div style="text-align:center; margin-top:40px;">`
    );
    fs.writeFileSync('index.html', indexFile, 'utf8');
    
    console.log('Arabic instruments injected successfully!');
} catch(e) {
    console.error(e);
}
