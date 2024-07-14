function Validator() {
    function videoIsValid(videoElement) {
        if (!videoElement) return false;

        return !!videoElement?.getAttribute('src');
    }

    return { videoIsValid };
}
