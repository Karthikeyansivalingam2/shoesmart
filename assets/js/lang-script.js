
// ======================================
// Language Switcher Logic
// ======================================

const translations = {
    en: {
        home: "Home",
        about: "About",
        products: "Products",
        shop: "Shop",
        blog: "Blog",
        contact: "Contact",
        search: "Search",
        login: "Login / Register",
        wishlist: "Wishlist",
        basket: "Basket",
        heroTitle: "New Summer <strong>Shoes Collection</strong>",
        heroText: "Competently expedite alternative benefits whereas leading-edge catalysts for change. Globally leverage existing an expanded array of leadership.",
        shopBtn: "Shop Now",
        exploreBtn: "Explore All",

        // Product & Section Terms
        men: "Men",
        women: "Women",
        sports: "Sports",
        new: "New",
        addToCart: "Add to Cart",
        addToWishlist: "Add to Whishlist",
        quickView: "Quick View",
        compare: "Compare",
        bestsellers: "Bestsellers Products",
        nikeSpecial: "Nike Special",
        menCol: "Men Collections",
        womenCol: "Women Collections",
        sportsCol: "Sports Collections",

        // Product Titles (Keys must match original English text partially or fully)
        "Running Sneaker Shoes": "Running Sneaker Shoes",
        "Leather Mens Slipper": "Leather Mens Slipper",
        "Simple Fabric Shoe": "Simple Fabric Shoe",
        "Air Jordan 7 Retro": "Air Jordan 7 Retro",
        "Nike Air Max 270": "Nike Air Max 270",
        "Nike Air Max 270 SE": "Nike Air Max 270 SE",
        "Adidas Sneakers": "Adidas Sneakers",
        "Adidas Sneakers Shoes": "Adidas Sneakers Shoes",
        "Nike Basketball shoes": "Nike Basketball shoes"
    },
    hi: {
        home: "घर",
        about: "हमारे बारे में",
        products: "उत्पाद",
        shop: "दुकान",
        blog: "ब्लॉग",
        contact: "संपर्क",
        search: "खोजें",
        login: "लॉग इन",
        wishlist: "इच्छा सूची",
        basket: "टोकरी",
        heroTitle: "नई गर्मी <strong>जूते संग्रह</strong>",
        heroText: "परिवर्तन के लिए अग्रणी बढ़त उत्प्रेरक जबकि वैकल्पिक लाभ को सक्षम रूप से शीघ्र करें। विश्व स्तर पर नेतृत्व की एक विस्तारित सरणी का लाभ उठाएं।",
        shopBtn: "अभी खरीदें",
        exploreBtn: "सभी देखें",

        // Product & Section Terms
        men: "पुरुष",
        women: "महिला",
        sports: "खेल",
        new: "नया",
        addToCart: "कार्ट में डालें",
        addToWishlist: "इच्छा सूची में डालें",
        quickView: "त्वरित दृश्य",
        compare: "तुलना करें",
        bestsellers: "सबसे ज्यादा बिकने वाले उत्पाद",
        nikeSpecial: "नाइके विशेष",
        menCol: "पुरुषों का संग्रह",
        womenCol: "महिलाओं का संग्रह",
        sportsCol: "खेल संग्रह",

        // Product Titles
        "Running Sneaker Shoes": "रनिंग स्नीकर जूते",
        "Leather Mens Slipper": "चमड़े की पुरुषों की चप्पल",
        "Simple Fabric Shoe": "साधारण कपड़े का जूता",
        "Air Jordan 7 Retro": "एयर जॉर्डन 7 रेट्रो",
        "Nike Air Max 270": "नाइके एयर मैक्स 270",
        "Nike Air Max 270 SE": "नाइके एयर मैक्स 270 एसई",
        "Adidas Sneakers": "एडिडास स्नीकर्स",
        "Adidas Sneakers Shoes": "एडिडास स्नीकर्स जूते",
        "Nike Basketball shoes": "नाइके बास्केटबॉल जूते"
    },
    ta: {
        home: "முகப்பு",
        about: "எங்களை பற்றி",
        products: "தயாரிப்புகள்",
        shop: "கடை",
        blog: "வலைப்பதிவு",
        contact: "தொடர்பு",
        search: "தேடுக",
        login: "உள்நுழை",
        wishlist: "விருப்பம்",
        basket: "கூடை",
        heroTitle: "புதிய கோடை <strong>காலணி சேகரிப்பு</strong>",
        heroText: "மாற்றத்திற்கான முன்னணி வினையூக்கிகள் இருக்கும்போது மாற்று நன்மைகளை திறம்பட விரைவுபடுத்துங்கள்.",
        shopBtn: "வாங்க",
        exploreBtn: "ஆராயுங்கள்",

        // Product & Section Terms
        men: "ஆண்கள்",
        women: "பெண்கள்",
        sports: "விளையாட்டு",
        new: "புதிய",
        addToCart: "கூடையில் சேர்",
        addToWishlist: "விருப்பப்பட்டியலில் சேர்",
        quickView: "விரைவு பார்வை",
        compare: "ஒப்பிடுக",
        bestsellers: "அதிகம் விற்பனையாகும் பொருட்கள்",
        nikeSpecial: "நைக் சிறப்பு",
        menCol: "ஆண்கள் சேகரிப்பு",
        womenCol: "பெண்கள் சேகரிப்பு",
        sportsCol: "விளையாட்டு சேகரிப்பு",

        // Product Titles
        "Running Sneaker Shoes": "ஓடும் ஸ்னீக்கர் காலணிகள்",
        "Leather Mens Slipper": "ஆண்களுக்கான தோல் செருப்பு",
        "Simple Fabric Shoe": "எளிய துணி காலணி",
        "Air Jordan 7 Retro": "ஏர் ஜோர்டான் 7 ரெட்ரோ",
        "Nike Air Max 270": "நைக் ஏர் மேக்ஸ் 270",
        "Nike Air Max 270 SE": "நைக் ஏர் மேக்ஸ் 270 எஸ்இ",
        "Adidas Sneakers": "அடிடாஸ் ஸ்னீக்கர்கள்",
        "Adidas Sneakers Shoes": "அடிடாஸ் ஸ்னீக்கர்கள் காலணிகள்",
        "Nike Basketball shoes": "நைக் கூடைப்பந்து காலணிகள்"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Select all dropdown links
    const langLinks = document.querySelectorAll('.language-selector .dropdown-link');
    const currentLangText = document.querySelector('.language-selector .nav-action-text') || document.querySelector('.nav-action-text'); // Fallback

    // Function to update content
    function updateContent(lang) {
        if (!translations[lang]) return;
        const t = translations[lang];

        // 1. Navbar Links - Match by HREF for reliability
        const navMap = {
            'index.html': t.home,
            'about.html': t.about,
            'shop.html': t.shop,
            'blog.html': t.blog,
            'contact.html': t.contact
        };

        document.querySelectorAll('.navbar-item .navbar-link').forEach(link => {
            const href = link.getAttribute('href');
            if (navMap[href]) {
                link.textContent = navMap[href];
            }
        });

        // 2. Action Buttons
        const setText = (selector, text) => {
            const el = document.querySelector(selector);
            if (el) el.textContent = text;
        };

        const searchBtn = document.querySelector("button.nav-action-btn ion-icon[name='search-outline'] + .nav-action-text") ||
            document.querySelector("button.nav-action-btn:has(ion-icon[name='search-outline']) .nav-action-text");
        if (searchBtn) searchBtn.textContent = t.search;

        const loginBtn = document.querySelector("a.nav-action-btn[href='login.html'] .nav-action-text");
        if (loginBtn && !localStorage.getItem('footcap-user')) loginBtn.textContent = t.login;

        const wishBtn = document.querySelector("button.nav-action-btn:has(ion-icon[name='heart-outline']) .nav-action-text");
        if (wishBtn) wishBtn.textContent = t.wishlist;

        const bagBtn = document.querySelector("button.nav-action-btn:has(ion-icon[name='bag-outline']) .nav-action-text");
        if (bagBtn) {
            const currentPrice = bagBtn.querySelector('strong') ? bagBtn.querySelector('strong').textContent : '$0.00';
            bagBtn.innerHTML = `${t.basket}: <strong>${currentPrice}</strong>`;
        }

        // 3. Hero Section
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) heroTitle.innerHTML = t.heroTitle;
        const heroText = document.querySelector('.hero-text');
        if (heroText) heroText.textContent = t.heroText;
        const heroBtn = document.querySelector('.hero .btn-primary span');
        if (heroBtn) heroBtn.textContent = t.shopBtn;

        // 4. Section Titles (Bestsellers, Special, Collections)
        const sectionTitles = document.querySelectorAll('.section-title');
        sectionTitles.forEach(title => {
            if (title.textContent.includes('Bestsellers')) title.firstChild.textContent = t.bestsellers;
            // Note: Bestsellers title might have other structure, checking carefully
        });
        // Specific checks for known section titles
        const bestsellersTitle = Array.from(document.querySelectorAll('.h2.section-title')).find(el => el.innerText.includes('Bestsellers'));
        if (bestsellersTitle) bestsellersTitle.innerText = t.bestsellers;

        const nikeTitle = document.querySelector('.special-product .section-title .text');
        if (nikeTitle) nikeTitle.textContent = t.nikeSpecial;

        // Collection Cards Titles
        const collectionTitles = document.querySelectorAll('.collection-card .card-title');
        collectionTitles.forEach(title => {
            const text = title.textContent.trim();
            if (text.includes('Men')) title.textContent = t.menCol;
            if (text.includes('Women')) title.textContent = t.womenCol;
            if (text.includes('Sports')) title.textContent = t.sportsCol;
        });

        const collectionBtns = document.querySelectorAll('.collection-card .btn-link span');
        collectionBtns.forEach(btn => btn.textContent = t.exploreBtn);

        // 5. Product Cards Translation
        // Categories
        document.querySelectorAll('.card-cat-link').forEach(link => {
            const text = link.textContent.trim();
            if (text === 'Men') link.textContent = t.men;
            if (text === 'Women') link.textContent = t.women;
            if (text === 'Sports') link.textContent = t.sports;
        });

        // Titles
        document.querySelectorAll('.card-title > a').forEach(link => {
            // We use the English text as the key. 
            // Ideally, we should store a data-key attribute, but for now we try to match.
            // Problem: Once translated to Hindi, we can't translate back to Tamil easily without a map.
            // Solution: Use a dataset attribute to store original English text if not present.

            if (!link.dataset.langKey) {
                link.dataset.langKey = link.textContent.trim(); // Store original English
            }

            const key = link.dataset.langKey;
            if (t[key]) {
                link.textContent = t[key];
            } else if (translations['en'][key]) {
                // If key exists in EN but not current lang, fallback to key (English)
                link.textContent = key;
            }
        });

        // Badges
        document.querySelectorAll('.card-badge').forEach(badge => {
            const text = badge.textContent.trim();
            if (text === 'New' || text === 'नया' || text === 'புதிய') badge.textContent = t.new;
        });

        // Tooltips
        document.querySelectorAll('.card-action-tooltip').forEach(tooltip => {
            const text = tooltip.textContent.trim();
            // We need a stable key for tooltips too
            if (!tooltip.dataset.langKey) tooltip.dataset.langKey = text;
            const key = tooltip.dataset.langKey;

            if (key === 'Add to Cart') tooltip.textContent = t.addToCart;
            if (key === 'Add to Whishlist') tooltip.textContent = t.addToWishlist;
            if (key === 'Quick View') tooltip.textContent = t.quickView;
            if (key === 'Compare') tooltip.textContent = t.compare;
        });
    }

    // Event Listeners
    if (langLinks.length > 0) {
        langLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const text = e.target.textContent;
                let langCode = 'en';

                if (text.includes('Hindi')) langCode = 'hi';
                else if (text.includes('Tamil')) langCode = 'ta';
                else langCode = 'en';

                if (currentLangText) currentLangText.textContent = langCode.toUpperCase();

                // Save preference
                localStorage.setItem('footcap-lang', langCode);

                // Update UI
                updateContent(langCode);

                // Reload if on a page where dynamic JS rendering might overwrite changes (like shop)
                // actually, let's just reload to be safe and simple for the user, 
                // but checking the user request "last image laguage vera pola vennum"
                // he probably wants instant change without reload like before.
                // But some content might need reload. Let's stick to no-reload for instant feel if possible.
                // Alternatively, force reload to ensure consistent state if scripts run on load.
                // Let's try instant update first.
            });
        });
    } else {
        // Maybe we are on admin page which uses select
        const select = document.querySelector('select[onchange^="localStorage"]');
        if (select) {
            // Admin logic is handled inline in html
        }
    }

    // Expose globally
    window.updateLanguage = updateContent;

    // Check saved preference on load
    const savedLang = localStorage.getItem('footcap-lang');
    if (savedLang) {
        if (currentLangText) currentLangText.textContent = savedLang.toUpperCase();
        updateContent(savedLang);
    }
});
