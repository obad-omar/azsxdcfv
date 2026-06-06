const fs = require('fs');

const files = fs.readdirSync('.')
    .filter(file => file.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Replace the header and footer logo icon
    content = content.replace(
        /<div class="logo-icon-wrap"[^>]*>[\s\S]*?<\/div>/g,
        `<img src="images/logo.jpeg" alt="Mosiqati Logo" style="height: 48px; width: 48px; border-radius: 12px; margin-left: 12px; border: 1px solid var(--cyan); box-shadow: 0 0 12px rgba(0, 229, 255, 0.3); object-fit: cover;">`
    );

    // Replace the login modal logo if any
    content = content.replace(
        /<div class="login-logo-wrap"[^>]*>[\s\S]*?<\/div>/g,
        `<img src="images/logo.jpeg" alt="Logo" style="height: 64px; width: 64px; border-radius: 50%; border: 2px solid var(--cyan); margin: 0 auto 15px auto; box-shadow: 0 0 20px rgba(0, 229, 255, 0.4); object-fit: cover; display: block;">`
    );

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated logo in ${file}`);
});
