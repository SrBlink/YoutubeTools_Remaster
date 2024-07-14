function VideoScreen() {

    async function on() {
        onEvents();
        deleteVideoCheck();
    }

    async function refreshVideoScreen() {


        if (isVideoCheck()) {
            console.log("Video ja possui as configurações aplicadas....")
            return
        };

        const volumeStorage = JSON.parse(_storageLocal.get(Constants.Storage.Volume)?.data);

        const storageValues = {
            Resolution: _storageLocal.get(Constants.Storage.Resolution)?.data,
            Expanded: _storageLocal.get(Constants.Storage.Expanded)?.data,
            Speed: (_storageLocal.get(Constants.Storage.Speed)?.data ?? 0) / 100 * Constants.Video.Speed.MaxSpeed,
            Volume: volumeStorage.muted ? 0 : volumeStorage.volume / 100, //Criar método para atualizar a barra de audio do youtube com base no valor.
        }

        console.log("aplicando as config no video ...")

        await setVideoSpeed(storageValues.Speed);
        await setVideoExpanded(storageValues.Expanded);
        await setVideoResolution(storageValues.Resolution);
        await setVolumeVideo(storageValues.Volume);
    }



    function onEvents() {
        _event.on(Constants.Events.Route.VideoScreen, deleteVideoCheck)
        _event.on(Constants.Events.Route.VideoScreen, refreshVideoScreen)

        _event.on(Constants.Events.Window.CloseScreen, deleteVideoCheck)
        _event.on(Constants.Events.Window.FocusScreen, async () => {

            if (_route.isVideoScreenUrl()) {
                await refreshVideoScreen()
                if (!isVideoCheck()) insertVideoCheck();
            }
        })

        _event.on(Constants.Events.MenuConfig.Resolution, setVideoResolution)
        _event.on(Constants.Events.MenuConfig.Expanded, setVideoExpanded)
        _event.on(Constants.Events.MenuConfig.Speed, setVideoSpeed)

    }

    function isVideoCheck() {
        const keyVideo = _route.getParametersUrl()['v'];
        const videoCheck = _storageLocal.get(keyVideo);

        return !!videoCheck?.data
    }

    function insertVideoCheck() {
        const keyVideo = _route.getParametersUrl()['v'];
        console.log("Inserindo check de config no video...")
        _storageLocal.insert(keyVideo, { data: 'check' });
    }

    function deleteVideoCheck() {
        const keyVideo = _route.getParametersUrl()['v'];
        _storageLocal.deleteByid(keyVideo);
    }

    async function setVideoResolution(resolution) {

        if (!resolution || resolution == Constants.Video.Resolution.nenhum) return;

        const detailsVideo = await doc.qAsync('.ytp-settings-button');
        if (!detailsVideo) return;

        detailsVideo.click();

        const menuVideo = await doc.qAllAsync('.ytp-menuitem');

        const resolutionMenu = menuVideo?.find(optionItem => optionItem.innerText.toUpperCase()?.indexOf('QUALIDADE') > -1);

        if (!resolutionMenu) return;

        resolutionMenu.click();

        var listResolution = await doc.qAllAsync('.ytp-menuitem[role=menuitemradio]');

        //Retirar todos as resoluções premium da lista (Resolução Premium não da pra ser selecionada por usuários comuns)
        listResolution = listResolution?.filter(resolutionItem => resolutionItem?.innerText.toUpperCase()?.indexOf('PREMIUM') == -1);

        if (!listResolution?.length) return;

        if (resolution == Constants.Video.Resolution.maximo)
            listResolution[0].click();
        else {

            const resolutionSelected = listResolution.find(resolutionItem => resolutionItem?.innerText?.toUpperCase()?.indexOf(resolution) > -1);

            //Regra para selecionar a resolução mais alta caso a resolução desejada não for encontrada.
            resolutionSelected ? resolutionSelected.click() : listResolution[0].click();
        }
    }

    async function setVideoExpanded(modeVideo) {

        if (!modeVideo) return;

        const buttonSizeVideo = await doc.qAsync('.ytp-size-button');

        if (!buttonSizeVideo) return;

        if (modeVideo == Constants.Video.Expanded.expandido && buttonSizeVideo.getAttribute('title') == 'Modo Teatro (t)') {
            doc.q('.ytp-size-button[title="Modo Teatro (t)"]')?.click();
        }

        if (modeVideo == Constants.Video.Expanded.normal && buttonSizeVideo.getAttribute('title') == 'Visualização padrão (t)') {
            doc.q('.ytp-size-button[title="Visualização padrão (t)')?.click();
        }
    }

    async function setVideoSpeed(velocidade) {

        if (!velocidade) return;

        const video = await doc.qAsync('video')

        if (!video || !_validator.videoIsValid(video)) return;

        video.playbackRate = velocidade;
    }

    async function setVideoTranslate(translateMode) {

        // debugger;
        const buttonLegend = await doc.qAsync('.ytp-subtitles-button');

        if (!buttonLegend) return;

        const buttonLegendActive = buttonLegend.getAttribute('aria-pressed') == 'true';

        if (buttonLegend == null) return;

        if (translateMode && !buttonLegendActive)
            buttonLegend.click();

        if (!translateMode && buttonLegendActive)
            buttonLegend.click();
    }

    function setRemoveViewed(active) {

        if (active && interval) return;

        if (!active) {
            clearInterval(interval)
            return;
        }

        var interval = setInterval(() => {

            var listVideosDelete = [];

            listVideosDelete.push(...doc.qAll('ytd-video-renderer'))

            //Retira os videos vistos da lista abaixo do video sendo visualizado.
            listVideosDelete.push(...doc.qAll('ytd-compact-video-renderer'))

            //Retira os videos vistos do home e quando entra nos canais.
            // listVideosDelete.push(...doc.qAll('ytd-rich-item-renderer'))


            listVideosDelete?.filter(videoLayer => videoLayer.q('#progress'))?.forEach(videosViewed => {
                if (videosViewed) {
                    console.log("Videos viewed removed ...")
                    videosViewed?.remove()
                }
            })

        }, Constants.TimeVideosRemove);
    }

    function setRemoveReels(active) {
        if (active && interval) return;

        if (!active) {
            clearInterval(interval)
            return;
        }

        var interval = setInterval(() => {

            doc.qAll('ytd-reel-shelf-renderer')?.forEach(reels => {
                if (reels) {
                    console.log('Reels removed...')
                    reels?.remove()
                }
            })

        }, Constants.TimeVideosRemove);
    }

    function setRemoveMixPlaylist(active) {
        if (active && interval) return;

        if (!active) {
            clearInterval(interval)
            return;
        }

        var interval = setInterval(() => {

            doc.qAll('ytd-radio-renderer')?.forEach(mixPlaylist => {
                if (mixPlaylist) {
                    console.log('MixPlaylist removed...')
                    mixPlaylist?.remove()
                }
            })

        }, Constants.TimeVideosRemove);
    }

    async function updateIconVolume(volume) {
        const posicaoMaximaSlider = 40
        const slider = await doc.qAsync('.ytp-volume-slider-handle');
        const iconVolume = await doc.qAsync('.ytp-mute-button > svg > path.ytp-svg-fill');

        const posicaoSlider = volume * posicaoMaximaSlider;

        console.log('posicao slider...', posicaoSlider)
        slider.style.left = `${posicaoSlider}px`;

        if (posicaoSlider < 20 && posicaoSlider > 0)
            iconVolume.setAttribute('d', Constants.Video.IconVolume.VolumeLow)

        if (posicaoSlider > 20)
            iconVolume.setAttribute('d', Constants.Video.IconVolume.VolumeHigh)

        if (posicaoSlider <= 0 || volume <= 0)
            iconVolume.setAttribute('d', Constants.Video.IconVolume.VolumeMuted)
    }

    async function setVolumeVideo(volume) {
        console.log("Incluindo volume no video...", volume)

        if (volume == null) return;

        volume = volume > 1 ? 1 : volume;
        volume = volume < 0 ? 0 : volume;

        const video = await doc.qAttributeAsync('video', 'src');

        video.volume = volume;
        await updateIconVolume(volume);
    }



    return {
        on
    }
}