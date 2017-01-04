// 发送消息
function sendMessage() {
    chrome.runtime.sendMessage({greeting: "hello"}, function (response) {
        console.log(response);
    });
}

var btnClass1 = ".test-goon-btn";
var btnClass2 = ".test-enter-btn";
var btnClass3 = ".ln-btn";

// 接收消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(1212);
    if (request.type == 1) { // 填充html
        sendResponse({farewell: "end"});
        htmlFill(request.data, request.url_xue);
    } else if (request.type == 2) {
        console.log('_-dd--');
        var btn_length = $(btnClass1).length || $(btnClass2).length || $(btnClass3).length;
        console.log('_---');
        console.log(btn_length);
        if (btn_length > 0) {
            beginExam();
            sendResponse({farewell: "end"});
        } else {
            var interval = setInterval(function () {
                var btn_length = $(btnClass1).length || $(btnClass2).length || $(btnClass3).length;
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
    } else if (request.type == 3) {
        var interval1 = setInterval(function () {
            var btn_length1 = $(".wt-submit-btn").length;
            console.log(btn_length1);
            console.log($(".wt-submit-btn"));
            console.log("=====btn_length1=====");
            if (btn_length1 > 0) {
                setTimeout(function () {
                    $(".wt-submit-btn")[0].click();
                    setTimeout(function () {
                        $('.ui-button-text').eq(0).click();
                    }, 500);
                }, 500);
                sendResponse({farewell: "end"});
                clearInterval(interval1);
            }
        }, 100);
    }
});

function beginExam() {

    var btn1 = $(btnClass1);
    var btn2 = $(btnClass2);
    var btn3 = $(btnClass3);

    if (btn1.length > 0) {
        btn1[0].click();
    } else if (btn2.length > 0) {
        btn2[0].click();
    } else if (btn3.length > 0) {
        btn3[0].click();
    }
}
var flag_alert = true;
function htmlFill(data, url_xue) {
    if (url_xue == 1) {
        console.log("-----------------------xue--");
        console.log(data);
        data = JSON.parse(data);
        console.log("-----------------------xuedd--");
        console.log(data);
        data = data.parts[0].questions;


        for (var j = 0; j < data.length; j++) {
            var data_tmp = data[j];

            var questionType = data_tmp.question_type;
            var subItems = data_tmp.items;
            var indexAnswer = 0;
            // 单选题
            if (questionType == 10) {
                for (var i = 0; i < subItems.length; i++) {
                    var answer = subItems[i].answer;
                    if (answer == "B") {
                        indexAnswer = 1;
                    } else if (answer == "C") {
                        indexAnswer = 2;
                    } else if (answer == "D") {
                        indexAnswer = 3;
                    } else if (answer == "E") {
                        indexAnswer = 4;
                    } else if (answer == "F") {
                        indexAnswer = 5;
                    } else if (answer == "G") {
                        indexAnswer = 6;
                    } else if (answer == "H") {
                        indexAnswer = 7;
                    }
                    $('#' + data_tmp.id).find(".wt-item-option").children().eq(indexAnswer).find("i").click();
                }
            } else if (questionType == 30) { // 判断题
                for (var i = 0; i < subItems.length; i++) {
                    var answer = subItems[i].answer;
                    if (answer == "错") {
                        indexAnswer = 1;
                    }
                    $('#' + data_tmp.id).find(".wt-item-option").children().eq(indexAnswer).find("i").click();
                }
            } else if (questionType == 15) { // 多选
                for (var i = 0; i < subItems.length; i++) {
                    var answer = subItems[i].answer;
                    if (answer.indexOf("A") >= 0) {
                        $('#' + data_tmp.id).find(".wt-item-option").children().eq(0).find("i").click();
                    }
                    if (answer.indexOf("B") >= 0) {
                        $('#' + data_tmp.id).find(".wt-item-option").children().eq(1).find("i").click();
                    }
                    if (answer.indexOf("C") >= 0) {
                        $('#' + data_tmp.id).find(".wt-item-option").children().eq(2).find("i").click();
                    }
                    if (answer.indexOf("D") >= 0) {
                        $('#' + data_tmp.id).find(".wt-item-option").children().eq(3).find("i").click();
                    }
                    if (answer.indexOf("E") >= 0) {
                        $('#' + data_tmp.id).find(".wt-item-option").children().eq(4).find("i").click();
                    }
                    if (answer.indexOf("F") >= 0) {
                        $('#' + data_tmp.id).find(".wt-item-option").children().eq(5).find("i").click();
                    }
                }
            } else if (questionType == 25) { // 主观题
                if (flag_alert) {
                    alert("考试包含主观题，请自行回答");
                    flag_alert = false;
                }
            }
        }
        return;
    }
    if (url_xue) {
        console.log("-----------------------xue--");
        console.log(data);
        data = eval(data);
        console.log("-----------------------xuedd--");
        console.log(data);


        for (var j = 0; j < data.length; j++) {
            var data_tmp = data[j];

            var questionType = data_tmp.question_type;
            var subItems = data_tmp.items;
            var indexAnswer = 0;
            // 单选题
            if (questionType == 10) {
                for (var i = 0; i < subItems.length; i++) {
                    var answer = subItems[i].answer;
                    if (answer == "B") {
                        indexAnswer = 1;
                    } else if (answer == "C") {
                        indexAnswer = 2;
                    } else if (answer == "D") {
                        indexAnswer = 3;
                    } else if (answer == "E") {
                        indexAnswer = 4;
                    } else if (answer == "F") {
                        indexAnswer = 5;
                    } else if (answer == "G") {
                        indexAnswer = 6;
                    } else if (answer == "H") {
                        indexAnswer = 7;
                    }
                    $('#' + data_tmp.id).find(".wt-item-option").children().eq(indexAnswer).find("i").click();
                }
            } else if (questionType == 30) { // 判断题
                for (var i = 0; i < subItems.length; i++) {
                    var answer = subItems[i].answer;
                    if (answer == "错") {
                        indexAnswer = 1;
                    }
                    $('#' + data_tmp.id).find(".wt-item-option").children().eq(indexAnswer).find("i").click();
                }
            } else if (questionType == 15) { // 多选
                for (var i = 0; i < subItems.length; i++) {
                    var answer = subItems[i].answer;
                    if (answer.indexOf("A") >= 0) {
                        $('#' + data_tmp.id).find(".wt-item-option").children().eq(0).find("i").click();
                    }
                    if (answer.indexOf("B") >= 0) {
                        $('#' + data_tmp.id).find(".wt-item-option").children().eq(1).find("i").click();
                    }
                    if (answer.indexOf("C") >= 0) {
                        $('#' + data_tmp.id).find(".wt-item-option").children().eq(2).find("i").click();
                    }
                    if (answer.indexOf("D") >= 0) {
                        $('#' + data_tmp.id).find(".wt-item-option").children().eq(3).find("i").click();
                    }
                    if (answer.indexOf("E") >= 0) {
                        $('#' + data_tmp.id).find(".wt-item-option").children().eq(4).find("i").click();
                    }
                    if (answer.indexOf("F") >= 0) {
                        $('#' + data_tmp.id).find(".wt-item-option").children().eq(5).find("i").click();
                    }
                }
            } else if (questionType == 25) { // 主观题
                if (flag_alert) {
                    alert("考试包含主观题，请自行回答");
                    flag_alert = false;
                }
            }
        }
        return;
    }

    var index_0 = data.indexOf("(");
    data = data.slice(index_0 + 1, -1);
    data = JSON.parse(data);
    console.log("-------------------------");
    console.log(data);

    for (var j = 0; j < data.Data.length; j++) {
        var data_tmp = data.Data[j];

        var questionType = data_tmp.QuestionType;
        var subItems = data_tmp.SubItems;
        var indexAnswer = 0;
        // 单选题
        if (questionType == 10) {
            for (var i = 0; i < subItems.length; i++) {
                var answer = subItems[i].Answer;
                if (answer == "B") {
                    indexAnswer = 1;
                } else if (answer == "C") {
                    indexAnswer = 2;
                } else if (answer == "D") {
                    indexAnswer = 3;
                } else if (answer == "E") {
                    indexAnswer = 4;
                } else if (answer == "F") {
                    indexAnswer = 5;
                } else if (answer == "G") {
                    indexAnswer = 6;
                } else if (answer == "H") {
                    indexAnswer = 7;
                }
                $('#' + data_tmp.Id).find(".wt-item-option").children().eq(indexAnswer).find("i").click();
            }
        } else if (questionType == 30) { // 判断题
            for (var i = 0; i < subItems.length; i++) {
                var answer = subItems[i].Answer;
                if (answer == "错") {
                    indexAnswer = 1;
                }
                $('#' + data_tmp.Id).find(".wt-item-option").children().eq(indexAnswer).find("i").click();
            }
        } else if (questionType == 15) { // 多选
            for (var i = 0; i < subItems.length; i++) {
                var answer = subItems[i].Answer;
                if (answer.indexOf("A") >= 0) {
                    $('#' + data_tmp.Id).find(".wt-item-option").children().eq(0).find("i").click();
                }
                if (answer.indexOf("B") >= 0) {
                    $('#' + data_tmp.Id).find(".wt-item-option").children().eq(1).find("i").click();
                }
                if (answer.indexOf("C") >= 0) {
                    $('#' + data_tmp.Id).find(".wt-item-option").children().eq(2).find("i").click();
                }
                if (answer.indexOf("D") >= 0) {
                    $('#' + data_tmp.Id).find(".wt-item-option").children().eq(3).find("i").click();
                }
                if (answer.indexOf("E") >= 0) {
                    $('#' + data_tmp.Id).find(".wt-item-option").children().eq(4).find("i").click();
                }
                if (answer.indexOf("F") >= 0) {
                    $('#' + data_tmp.Id).find(".wt-item-option").children().eq(5).find("i").click();
                }
            }
        } else if (questionType == 25) { // 主观题
            if (flag_alert) {
                alert("考试包含主观题，请自行回答");
                flag_alert = false;
            }
        }
    }

}
