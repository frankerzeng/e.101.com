var urls_real = [];
var url_xue = false;
var init = function () {
    chrome.tabs.getSelected(function (w) {
        var addBtn = document.getElementById('addBtn');
        if (isExamUrl(w.url)) {
            addBtn.style.display = "block";
            document.getElementById('titleId').innerHTML = "<h1>考试页面</h1>";
            addBtn.onclick = function () {
                addBtn.style.display = "none";
                _onCompleted();
                console.log("===1");
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
            if (details.url.indexOf("xue.101.") > 1) {
                if (details.url.indexOf("/questions?qid") > 1) {
                    url_xue = true;
                    url_real = details.url.replace("/questions", "/analysis");
                    //url_real = "http://xue.101.com/ndu/v1/m/exams/d/sessions/s/analysis?qid=3756a44f-a644-44f7-8903-d79e0cf031c1_0&_=1476066669344";
                    var index_start = url_real.indexOf('exams/');
                    var index_end = url_real.indexOf('analysis');
                    var replact_str = "exams/55ecf203-ade1-461f-b2ad-f6f2c2f450d8/sessions/ab02319d-3288-42c6-8641-9034a29220a2/";
                    url_real = url_real.substring(0, index_start) + replact_str + url_real.substring(index_end);

                    console.log("===2");
                    console.log(url_real);

                    urls_real.push(url_real);
                }
            } else {
                if (details.url.indexOf("/baseinfo") > 1) {
                    url_real = details.url.replace("/baseinfo", "");
                    urls_real.push(url_real);
                }
            }
        },
        {urls: ["http://cloud.e.101.com/*", "http://xue.101.com/*"]} //监听发送的http请求，所有接口走此url
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
                    url_xue: url_xue,
                    length: urls_real.length
                }, function (response) {
                    if (type == 1 && response != undefined && response.farewell == "end") {
                        document.getElementById('titleId').innerHTML = "<h1>数据填充结束</h1>";
                    } else if (type == 2 && response != undefined && response.farewell == "end") {
                        document.getElementById('titleId').innerHTML = "<h1>开始请求题目数据</h1>";
                        setTimeout(function () {
                            console.log("urls_real======array");
                            console.log(urls_real);
                            for (var i = 0; i < urls_real.length; i++) {
                                (function (i) {
                                    setTimeout(function () {
                                        httpRequest(urls_real[i], htmlFill)
                                    }, 1000);
                                })(i);
                            }
                        }, 2000);
                        // 提交考试
                        //sendMessage("", 3);
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
    var patt = new RegExp('.101.com');
    return patt.test(url);
}

function httpRequest(url, callback) {
    console.log("url======array");
    console.log(url);
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