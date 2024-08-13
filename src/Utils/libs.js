function Package() {
    
    async function on() {
        await addFontAwesome();
    }

    async function addFontAwesome() {
        const head = await doc.qAsync('head');

        const linkFontAwesome = doc.create('link', {
            // href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
            href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0',
            rel: 'stylesheet'
        })

        head.appendChild(linkFontAwesome);
    }

    // <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

    return { on };
}