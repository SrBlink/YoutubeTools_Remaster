

function MonitoringRoute() {
    var currentUrl = window.location.href;
    var intervalMonitoring;
    var parameters = getParametersUrl();
    var dataEvent = { parameters };


    function on() {


        if (isVideoScreenUrl()) {
            console.log("emiting event video Screen...")
            _event.emit(Constants.Events.Route.VideoScreen, dataEvent)
        } else {
            console.log("emiting event Default Screen...")
            _event.emit(Constants.Events.Route.Default, dataEvent);
        }

        intervalMonitoring = setInterval(() => {
            var url = window.location.href;
            if (currentUrl != url) {
                parameters = getParametersUrl();
                dataEvent = { parameters };

                if (isVideoScreenUrl()) {
                    console.log("emiting event video Screen...")
                    _event.emit(Constants.Events.Route.VideoScreen, dataEvent)
                } else {
                    console.log("emiting event Default Screen...")
                    _event.emit(Constants.Events.Route.Default, dataEvent);
                }

                currentUrl = url;
            }
        }, 1000)
    }

    function isVideoScreenUrl() {
        const parameterVideoId = getParametersUrl()
        return !!parameterVideoId['v'];
    }

    function getParametersUrl() {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries())
        return params;
    }

    function off() {
        clearInterval(intervalMonitoring);
    }


    return { on, off, getParametersUrl, isVideoScreenUrl }
}