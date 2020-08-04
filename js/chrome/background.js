asanaModule.run(['AsanaConstants', 'AsanaGateway', "ChromeExtensionService", "$timeout", "$q", "StorageService",
function (AsanaConstants, AsanaGateway, ChromeExtensionService, $timeout, $q, StorageService) {
    //chrome.browserAction.setBadgeText({text: "NG"});
    //chrome.browserAction.setBadgeBackgroundColor({color: "#FC636B"});

    chrome.cookies.get({
        url: AsanaConstants.getBaseApiUrl(),
        name: AsanaConstants.ASANA_LOGIN_COOKIE_NAME
    }, function (cookie) {
        var loggedIn = !!(cookie && cookie.value);
        AsanaConstants.setLoggedIn(loggedIn);
    });

    chrome.cookies.onChanged.addListener(function (changeInfo) {
        if (AsanaConstants.isAsanaDomain(changeInfo.cookie.domain) && AsanaConstants.isAsanaLoginCookie(changeInfo.cookie.name)) {
            AsanaConstants.setLoggedIn(!changeInfo.removed);
        }
    });

    chrome.commands.onCommand.addListener(function(command) {
        if(command === "_execute_browser_action")
            chrome.browserAction.enable();
    });

    chrome.runtime.onInstalled.addListener(function(details){
        StorageService.setString("workspace", "");
        StorageService.clearArray("project");
        StorageService.clearArray("tag");
        StorageService.clearArray("follower");
        StorageService.setString("name", "");
        StorageService.setString("description", "");
    });
}]);