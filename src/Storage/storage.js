function StorageLocal() {

    function insert(key, data) {
        if (!key || !data) return;

        const dataStorage = JSON.stringify(data, null, 2);

        _storage.setItem(key, dataStorage);
    }

    function get(key) {

        if (!key) return;

        const data = _storage.getItem(key);

        if (!data) return;

        return JSON.parse(data);

    }

    function deleteByid(key) {
        if (!key) return;
        _storage.removeItem(key);
    }

    function deleteAll() {
        _storage.clear();
    }

    return { insert, get, deleteByid, deleteAll };
}

