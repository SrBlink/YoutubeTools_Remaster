const _event = {
    listeners: {},

    on: function (evento, callback) {
        if (!this.listeners[evento]) {
            this.listeners[evento] = [];
        }
        this.listeners[evento].push(callback);
    },

    emit: function (evento, dados) {
        if (this.listeners[evento]) {
            this.listeners[evento].forEach(function (callback) {
                callback(dados);
            });
        }
    },
};