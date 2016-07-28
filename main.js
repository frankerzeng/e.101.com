var flag = true;
var urls_real = [];
var init = function () {
    chrome.tabs.getSelected(function (w) {
        // 当前的标签页url
        console.log(w.url);

        // 判断是否考试页面
        if (isExamUrl(w.url)) {
            document.getElementById('addBtn').style.display = "block";
            document.getElementById('titleId').innerHTML = "<h1>考试页面</h1>";
            console.log('bb');
            document.getElementById('addBtn').onclick = function () {
                sendMessage("", 2);

                document.getElementById('addBtn').style.display = "none";
                if (flag) {
                    _onCompleted();
                }
            };
        } else {
            document.getElementById('titleId').innerHTML = "<h1>不是考试页面</h1>";

        }
    })
};

function _onCompleted() {
    chrome.webRequest.onCompleted.addListener(
        function (details) {
            var url_ = details.url;
            //var url_ = "http://cloud.e.101.com/v1/unitcloud/unitquestion/list/baseinfo?jsoncallback=jQuery17106038348522552544_1469688139388&uqids=69109&access_token=a1188a18326c4ba1a0a80542d5da8c6f&_=1469688147682";

            if (url_.indexOf("/baseinfo") > 1) {
                url_real = url_.replace("/baseinfo", "");
                console.log(url_);
                console.log(url_real);
                urls_real.push(url_real);
            }
        },
        {urls: ["http://cloud.e.101.com/*"]}
    );
    flag = false;
}

function _onBeforeRequest() {
    chrome.webRequest.onBeforeRequest.addListener(
        function (details) {
            console.log('----OnBeforeRequest');
            console.log(details);
        },
        {urls: ["http://e.101.com/*", "https://e.101.com/*", "http://cloud.e.101.com/*"]},
        ["blocking", "requestBody"]
    );
}

function _onBeforeSendHeaders() {
    chrome.webRequest.onBeforeSendHeaders.addListener(
        function (details) {
            console.log('----onBeforeSendHeaders');
            console.log(details);
        },
        {urls: ["http://e.101.com/*", "https://e.101.com/*", "http://cloud.e.101.com/*"]},
        ["blocking", "requestHeaders"]
    );
}


// 发送消息
function sendMessage(data, type) {
    chrome.tabs.query({active: true}, function (tab) {
        console.log('---tab');
        console.log(tab);
        for (var i = 0; i < tab.length; i++) {
            if (isExamUrl(tab[i].url)) {
                chrome.tabs.sendMessage(tab[i].id, {
                    data: data,
                    type: type,
                    length: urls_real.length
                }, function (response) {
                    console.log("response--00----main1");
                    console.log(response);
                    if (type == 1 && response != undefined && response.farewell == "end") {
                        document.getElementById('titleId').innerHTML = "<h1>数据填充结束</h1>";
                    } else if (type == 2 && response != undefined && response.farewell == "end") {
                        document.getElementById('titleId').innerHTML = "<h1>开始请求题目数据</h1>";
                        setTimeout(function () {
                            console.log("---urls_real");
                            console.log(urls_real);
                            for (var i = 0; i < urls_real.length; i++) {
                                console.log(urls_real[i] + '----==');
                                httpRequest(urls_real[i], htmlFill)
                            }
                        }, 1000);
                    }
                });
            }
        }

    });
}

// 接收消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (1) {
        sendResponse({farewell: "baybay"});
    }
});

function isExamUrl(url) {
    return (url.length > 20 && url.substr(7, 10) == "e.101.com/");
}

function httpRequest(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            console.log(xhr);
            callback(xhr.responseText);
        }
    };
    xhr.send();
}
function htmlFill(data) {
    sendMessage(data, 1);
}

init();