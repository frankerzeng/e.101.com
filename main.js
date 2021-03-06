var urls_real = [];
var url_xue = false;
var parper_url = '';
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
            if (parper_url != '') {
                return;
            }
            if (details.url.indexOf("xue.101.") > 1) {
                console.log('===========================all listener');
                console.log(details.url);

                if (details.url.indexOf("/questions?qid") > 1) {
                    url_xue = true;
                    url_real = details.url.replace("/questions", "/analysis");
                    //url_real = "http://xue.101.com/ndu/v1/m/exams/d/sessions/s/analysis?qid=3756a44f-a644-44f7-8903-d79e0cf031c1_0&_=1476066669344";
                    var index_start = url_real.indexOf('exams/');
                    var index_end = url_real.indexOf('analysis');
                    var replact_str = "exams/55ecf203-ade1-461f-b2ad-f6f2c2f450d8/sessions/ab02319d-3288-42c6-8641-9034a29220a2/";

                    //var replact_str = "exams/55ecf203-ade1-461f-b2ad-f6f2c2f450d8/sessions/ab02319d-3288-42c6-8641-9034a29220a2/";
                    //var replact_str = "exams/882d5b5c-0fa7-410b-9e05-a87e6d49ecb9/sessions/751fac0b-eef0-4eb0-9086-6366132bb882/";
                    //exams/882d5b5c-0fa7-410b-9e05-a87e6d49ecb9/sessions/5dff18b0-9edc-4242-9fe0-d17f3dde7dfb

                    //url_real = url_real.substring(0, index_start) + replact_str + url_real.substring(index_end);

                    console.log("===2");
                    console.log(url_real);

                    urls_real.push(url_real);
                } else if (details.url.indexOf("/papers?") > 1) { // http://xue.101.com/ndu/v1/exams/8aff9a26-a798-4a2e-b6ec-d99fb1f0c4d2/papers?_=1483531958207 返回考试ID
                    console.log('=========================== papers');
                    console.log(details.url);
                    httpRequest(details.url, function (data) {
                        console.log('-----> data');
                        data = JSON.parse(data);
                        data = 'http://xue.101.com/ndu/v1/papers/' + data[0]['id'];
                        console.log(data);
                        urls_real.push(data);
                        parper_url = data;
                    }, false);
                }
            } else {
                console.log(1111111);
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
        console.log("_1");
        for (var i = 0; i < tab.length; i++) {
            console.log(11);
            if (isExamUrl(tab[i].url)) {
                console.log(1121);
                console.log(tab[i].url);
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
                            if (parper_url != '') {
                                console.log('================???');
                                console.log(parper_url);
                                setTimeout(function () {
                                    httpRequest(parper_url, htmlFill, false)
                                }, 1000);
                                url_xue = 1;
                                return;
                            }
                            console.log("urls_real======array");
                            console.log(urls_real);
                            for (var i = 0; i < urls_real.length; i++) {
                                (function (i) {
                                    setTimeout(function () {
                                        httpRequest(urls_real[i], htmlFill, true)
                                    }, 1000);
                                })(i);
                            }
                        }, 2000);
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

function httpRequest(url, callback, asy) {
    console.log("url======array");
    console.log(url);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, asy);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            callback(xhr.responseText);
        }
    };
    xhr.send();
}
function htmlFill(data) {
    console.log('--------->>>>>');
    console.log(data);
    sendMessage(data, 1);
}

init();