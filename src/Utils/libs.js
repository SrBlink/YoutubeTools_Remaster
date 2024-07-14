function Package() {
    
    async function on() {
        await addFontAwesome();
    }

    async function addFontAwesome() {
        const head = await doc.qAsync('head');

        const linkFontAwesome = doc.create('link', {
            href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
            rel: 'stylesheet'
        })

        head.appendChild(linkFontAwesome);
    }


    return { on };
}