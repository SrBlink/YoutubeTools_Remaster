

function MonitoringRoute() {

    var oldRoute = {
        url: window.location.href,
        queryStrings: window.location.search,
        parameters: getParametersUrl(),
    }

    var intervalMonitoring;

    

    function on() {


        if (isVideoScreenUrl()) {
            console.log("emiting event video Screen...")
            _event.emit(Constants.Events.Route.VideoScreen, { parameters: oldRoute.parameters })
        } else {
            console.log("emiting event Default Screen...")
            _event.emit(Constants.Events.Route.Default, { parameters: oldRoute.parameters });
        }

        intervalMonitoring = setInterval(() => {

            var newRoute = {
                url: window.location.href,
                queryStrings: window.location.search,
                parameters: getParametersUrl(),
            };

            if (oldRoute.url != newRoute.url) {

                if (oldRoute.parameters['v']) {
                    console.log("Enviando evento de route saindo da tela de video...");
                    _event.emit(Constants.Events.Route.ExitVideoScreen, { parameters: oldRoute.parameters })
                }

                if (isVideoScreenUrl()) {
                    console.log("emiting event video Screen...")
                    _event.emit(Constants.Events.Route.VideoScreen, { parameters: newRoute.parameters })
                } else {
                    console.log("emiting event Default Screen...")
                    _event.emit(Constants.Events.Route.Default, { parameters: newRoute.parameters });
                }

                oldRoute = {
                    ...newRoute
                }

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