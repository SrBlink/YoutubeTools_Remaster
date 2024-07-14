window.onload = Main;


async function Main() {
    addDependenceService();
    _package.on();
    
    await _videoScreen.on();
    await _menu.on();

    _route.on();
    _windowEvents.on();

    
}
