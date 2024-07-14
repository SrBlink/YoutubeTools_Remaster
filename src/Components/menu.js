
function CreateMenuConfig() {

    var showMenu = false;

    const controlsMenu = {
        menu: null,
        arrowMenu: null,
        selectResolutionMenu: null,
        selectExpandedMenu: null,
        inputSpeedMenu: null,
        smallSpeedMenu: null,
    }

    async function on() {
        onEvents();
        await createMenuTemplate();
        await createEvents();
        await refreshMenuConfig();
    }

    async function refreshMenuConfig() {

        const storageValues = {
            Resolution: _storageLocal.get(Constants.Storage.Resolution)?.data,
            Expanded: _storageLocal.get(Constants.Storage.Expanded)?.data,
            Speed: (_storageLocal.get(Constants.Storage.Speed)?.data),
        }

        controlsMenu.selectResolutionMenu.value = storageValues.Resolution ?? Constants.Video.Resolution.default;
        controlsMenu.selectExpandedMenu.value = storageValues.Expanded ?? Constants.Video.Expanded.default;
        controlsMenu.inputSpeedMenu.value = storageValues.Speed ?? Constants.Video.Speed.default;
        controlsMenu.smallSpeedMenu.innerHTML = `${storageValues.Speed != null ? storageValues.Speed / 100 * Constants.Video.Speed.MaxSpeed : Constants.Video.Speed.default}x`;
    }

    function onEvents() {
        _event.on(Constants.Events.Route.VideoScreen, () => handleShowMenu(true));
        _event.on(Constants.Events.Route.VideoScreen, refreshMenuConfig);
    }

    async function createMenuTemplate() {
        const body = await doc.qAsync('body');


        const menuHtml = `
             <div class="tools-container"> 
                <div id="seta-toogle-show-menu" class="tools-seta-painel">
                    <i class="fa fa-angle-left"></i>
                </div>
                <div id="tools-painel-menu" class="tools-painel">
                    <div class="tools-painel-content">
                        <label class="tools-painel-label">Resolução</label>
                        <select id="select-resolution-menu" class="tools-painel-select">
                            <option value="${Constants.Video.Resolution.nenhum}">Nenhum</option>
                            <option value="${Constants.Video.Resolution.maximo}">Máxima</option>
                            <option value="${Constants.Video.Resolution[2160]}">4k</option>
                            <option value="${Constants.Video.Resolution[1440]}">2k</option>
                            <option value="${Constants.Video.Resolution[1080]}">1080p</option>
                            <option value="${Constants.Video.Resolution[720]}">720p</option>
                        </select>

                        <label class="tools-painel-label">Visualização</label>
                        <select id="select-expanded-option-menu" class="tools-painel-select">
                            <option value="${Constants.Video.Expanded.normal}">Normal</option>
                            <option value="${Constants.Video.Expanded.expandido}">Expandido</option>
                        </select>

                        <label class="tools-painel-label">Velocidade</label>
                        <input id="input-speed-option-menu" class="tools-painel-range" type="range" />
                        <small id="small-speed-text-menu"class="tools-painel-small"> </small>

                    </div>
                </div>
             </div>       
        `
        const fragmentElement = doc.create('div');
        fragmentElement.innerHTML = menuHtml;

        body.appendChild(fragmentElement.firstElementChild);

        controlsMenu.menu = await doc.qAsync('#tools-painel-menu');
        controlsMenu.arrowMenu = await doc.qAsync('#seta-toogle-show-menu');
        controlsMenu.selectResolutionMenu = await doc.qAsync('#select-resolution-menu');
        controlsMenu.selectExpandedMenu = await doc.qAsync('#select-expanded-option-menu');
        controlsMenu.inputSpeedMenu = await doc.qAsync('#input-speed-option-menu');
        controlsMenu.smallSpeedMenu = await doc.qAsync('#small-speed-text-menu');
    }

    async function createEvents() {


        controlsMenu.arrowMenu.event('click', () => handleShowMenu());
        controlsMenu.selectResolutionMenu.event('change', handleResolution);
        controlsMenu.selectExpandedMenu.event('change', handleExpanded);
        controlsMenu.inputSpeedMenu.event('input', handleSpeed);

    }

    function handleResolution(event) {
        const resolution = event?.target?.value;
        _storageLocal.insert(Constants.Storage.Resolution, { data: resolution });
        _event.emit(Constants.Events.MenuConfig.Resolution, resolution);
    }

    function handleExpanded(event) {
        const expanded = event?.target?.value;
        _storageLocal.insert(Constants.Storage.Expanded, { data: expanded });
        _event.emit(Constants.Events.MenuConfig.Expanded, expanded);
    }

    function handleSpeed(event) {

        const speed = +event?.target?.value;
        const speedVideo = speed / 100 * Constants.Video.Speed.MaxSpeed;

        const smallTextSpeed = doc.q('#small-speed-text-menu');
        smallTextSpeed.innerHTML = `${speedVideo}x`

        _storageLocal.insert(Constants.Storage.Speed, { data: speed });
        _event.emit(Constants.Events.MenuConfig.Speed, speedVideo);
    }

    async function handleShowMenu(toggle = showMenu) {

        showMenu = !toggle;
        const arrowRight = `<i class="fa fa-angle-right"></i>`;
        const arrowLeft = `<i class="fa fa-angle-left"></i>`;

        if (showMenu) {
            controlsMenu.menu.classList.add('active');
            controlsMenu.arrowMenu.innerHTML = arrowRight;
        }
        else {
            controlsMenu.menu.classList.remove('active');
            controlsMenu.arrowMenu.innerHTML = arrowLeft;
        }
    }

    return {
        on,
    };

};