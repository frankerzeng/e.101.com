var urls_real = [];
var init = function () {
    chrome.tabs.getSelected(function (w) {
        var addBtn = document.getElementById('addBtn');
        if (isExamUrl(w.url)) {
            addBtn.style.display = "block";
            document.getElementById('titleId').innerHTML = "<h1>考试页面</h1>";
            addBtn.onclick = function () {
                addBtn.style.display = "none";
                _onCompleted();
                sendMessage("", 2);
            };
        } else {
            document.getElementById('titleId').innerHTML = "<h1>不是考试页面</h1>";
        }
    })
};

function _onCompleted() {
    chrome.webRequest.onCompleted.addListener(
        function (details) {
            if (details.url.indexOf("/baseinfo") > 1) {
                url_real = details.url.replace("/baseinfo", "");
                urls_real.push(url_real);
            }
        },
        {urls: ["http://cloud.e.101.com/*"]}
    );
}

function _onBeforeRequest() {
    chrome.webRequest.onBeforeRequest.addListener(
        function (details) {
            console.log(details);
        },
        {urls: ["http://e.101.com/*", "https://e.101.com/*", "http://cloud.e.101.com/*"]},
        ["blocking", "requestBody"]
    );
}

function _onBeforeSendHeaders() {
    chrome.webRequest.onBeforeSendHeaders.addListener(
        function (details) {
            console.log(details);
        },
        {urls: ["http://e.101.com/*", "https://e.101.com/*", "http://cloud.e.101.com/*"]},
        ["blocking", "requestHeaders"]
    );
}


// 发送消息
function sendMessage(data, type) {
    chrome.tabs.query({active: true}, function (tab) {
        for (var i = 0; i < tab.length; i++) {
            if (isExamUrl(tab[i].url)) {
                chrome.tabs.sendMessage(tab[i].id, {
                    data: data,
                    type: type,
                    length: urls_real.length
                }, function (response) {
                    if (type == 1 && response != undefined && response.farewell == "end") {
                        document.getElementById('titleId').innerHTML = "<h1>数据填充结束</h1>";
                    } else if (type == 2 && response != undefined && response.farewell == "end") {
                        document.getElementById('titleId').innerHTML = "<h1>开始请求题目数据</h1>";
                        setTimeout(function () {
                            for (var i = 0; i < urls_real.length; i++) {
                                setTimeout(function () {
                                    httpRequest(urls_real[i], htmlFill)
                                }, 1000);
                            }
                        }, 2000);
                        sendMessage("", 3);
                    } else if (type == 3 && response != undefined && response.farewell == "end") {
                        document.getElementById('titleId').innerHTML = "<h1>已提交</h1>";
                    }
                });
            }
        }
    });
}

// 接收消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    sendResponse({farewell: "baybay"});
});

function isExamUrl(url) {
    return (url.length > 20 && url.substr(7, 10) == "e.101.com/");
}

function httpRequest(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            callback(xhr.responseText);
        }
    };
    xhr.send();
}
function htmlFill(data) {
    sendMessage(data, 1);
}

init();