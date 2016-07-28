// 发送消息
function sendMessage() {
    chrome.runtime.sendMessage({greeting: "hello"}, function (response) {
        console.log(response);
    });
}

var btnClass1 = ".test-goon-btn";
var btnClass2 = ".test-enter-btn";

// 接收消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(sender);
    console.log(request);
    // 填充html
    if (request.type == 1) {
        sendResponse({farewell: "end"});
        htmlFill(request.data);
        setTimeout(function () {
            $(".wt-submit-btn").click();
        }, 3000);
    } else if (request.type == 2) {
        var btn_length = $(btnClass1).length || $(btnClass2).length;
        console.log(btn_length);
        if (btn_length > 0) {
            beginExam();
            sendResponse({farewell: "end"});
        } else {
            var interval = setInterval(function () {
                var btn_length = $(btnClass1).length || $(btnClass2).length;
                console.log(btn_length);
                if (btn_length > 0) {
                    clearInterval(interval);
                    beginExam();
                    sendResponse({farewell: "end"});
                }
            }, 100);
            setTimeout(function () {
                clearInterval(interval);
            }, 5000)
        }
    }
});

function beginExam() {
    var btn1 = $(btnClass1)[0];
    var btn2 = $(btnClass2)[0];
    btn1.click();
    btn2.click();
}

function htmlFill(data) {
    var index_0 = data.indexOf("(");
    data = data.slice(index_0 + 1, -1);
    data = JSON.parse(data);

    for (var j = 0; j < data.Data.length; j++) {
        var data_tmp = data.Data[j];
        console.log("data-----");
        console.log(data_tmp);

        var questionType = data_tmp.QuestionType;
        console.log(questionType);

        // 单选题
        if (questionType == 10) {
            var subItems = data_tmp.SubItems;
            for (var i = 0; i < subItems.length; i++) {
                var answer = subItems[i].Answer;
                console.log(answer + answer);
                var indexAnswer = 0;
                if (answer == "B") {
                    indexAnswer = 1;
                } else if (answer == "C") {
                    indexAnswer = 2;
                } else if (answer == "D") {
                    indexAnswer = 3;
                }
                $('#' + data_tmp.Id).find(".wt-item-option").children().eq(indexAnswer).find("i").click();
            }
        } else if (questionType == 30) { // 判断题
            var subItems = data_tmp.SubItems;
            for (var i = 0; i < subItems.length; i++) {
                var answer = subItems[i].Answer;
                console.log(answer + answer);
                var indexAnswer = 0;
                if (answer == "错") {
                    indexAnswer = 1;
                }
                $('#' + data_tmp.Id).find(".wt-item-option").children().eq(indexAnswer).find("i").click();
            }
        }
    }

}
