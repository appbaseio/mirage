// chrome.app.runtime.onLaunched.addListener(
//     function () {
//         chrome.system.display.getInfo(function(info) {
// 	    var width = info[0].workArea.width;
// 	    var height = info[0].workArea.height;
// 	    chrome.app.window.create('site/index.html', {
// 	        bounds: {
// 	            width: width,
// 	            height: height
// 	        },
// 	    });
// 	});
//     }
// );

chrome.browserAction.onClicked.addListener((tab) => {
  chrome.browserAction.setPopup({
    'popup': 'chrome-specific/popup.html'
  });
});