function WindowEvents() {


    function on() {
        addCloseEvent();
        addFocusEvent();
        addKeyDownEvent();
    }

    function addCloseEvent() {
        window.addEventListener('beforeunload', () => {
            console.log("fechando aba do navegador ...");
            _event.emit(Constants.Events.Window.CloseScreen)
        })

    }

    function addFocusEvent() {
        window.addEventListener('focus', () => {
            console.log("janela navegador focada ...");
            _event.emit(Constants.Events.Window.FocusScreen);
        })
    }

    function addKeyDownEvent() {
        window.addEventListener('keydown', (event) => {
            _event.emit(Constants.Events.Window.KeyPress, { data: event })
        })
    }



    return { on };
}