var _storageLocal;
var _validator;
var _videoScreen;
var _menu;
var _windowEvents;
var _route;
var _package;

function addDependenceService() {
    _storageLocal = StorageLocal();
    _validator = Validator();
    _videoScreen = VideoScreen();
    _menu = CreateMenuConfig();
    _windowEvents = WindowEvents();
    _route = MonitoringRoute();
    _package = Package();
}