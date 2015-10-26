
function appendZero(obj){
    if(obj < 10) return "0" + "" +obj;
    else return obj;
}

function getLocalHMS(){
    var time = (new Date()).getTime();
    var d = new Date();
    return appendZero(d.getHours()) + ":" +appendZero(d.getMinutes()) + ":" +appendZero(d.getSeconds());
}

function getStringLength(_str){
    return _str.replace(/[^\u0000-\u00ff]/g, "tt").length;
}

function chatBodyToBottom(){
    var msg_list = $(".msg-list-body");
    msg_list[0].scrollTop = msg_list[0].scrollHeight;
}

function onClickSendMessage() {
    var edit = $('#input-edit');
    var content = edit.val();   //获取值
    if(''== content){
        return;
    }
    say(content);
    edit.val('');   //赋值
}

function addMessage(_name,_time,_content){
    var msg_list = $(".msg-list-body");
    _content = QxEmotion.Parse(_content);
    msg_list.append(
            '<div class="clearfix msg-wrap"><div class="msg-head">' +
            '<span class="msg-name label label-primary pull-left">' +
            '<span class="glyphicon glyphicon-user"></span>&nbsp;&nbsp;' + _name + '</span>' +
            '<span class="msg-time label label-default pull-left">' +
            '<span class="glyphicon glyphicon-time"></span>&nbsp;&nbsp;' + _time + '</span>' +
            '</div><div class="msg-content">' + _content + '</div></div>'
    );
    chatBodyToBottom();
}

function addServerMessage(_time,_content){
    var msg_list = $(".msg-list-body");
    _content = QxEmotion.Parse(_content);
    msg_list.append(
            '<div class="clearfix msg-wrap"><div class="msg-head">' +
            '<span class="msg-name label label-danger pull-left">' +
            '<span class="glyphicon glyphicon-info-sign"></span>&nbsp;&nbsp;系统消息</span>' +
            '<span class="msg-time label label-default pull-left">' +
            '<span class="glyphicon glyphicon-time"></span>&nbsp;&nbsp;' + _time + '</span>' +
            '</div><div class="msg-content">' + _content + '</div></div>'
    );
    chatBodyToBottom();
}
function addUserList(_user){
    var user_lsit = $("#user_list");
    user_lsit.append('<tr><td>' + _user + '</td></tr>');
    updateListCount();
}

function useUserList(_user_list){
    var user_lsit = $("#user_list").html("");
    for(var i = 0; i < user_lsit.length; i++){
        addUserList(_user_list[i]);
    }
    updateListCount();
}

function removeListUser(_user){
    $("#user_list tr").each(function(){
        if(_user == $(this).find('td').text()){
            $(this).remove();
        }
    });
}
function onClickChangeNickname(){
    $('#loginModal').modal('show');
}

function updateListCount(){
    var list_count = $('#user_list').find('tr').length;
    $('#list_count').text("当前在线：" + list_count + "人");
}
function onClickApplyNickname(){
    var nick_name = $('#nickname-edit');
    var nick_error = $('#nickname-error');
    var my_name = $("#my-nickname");
    var name = nick_name.val();
    if("" == name){
        nick_error.text("请填写昵称。");
        nick_error.show();
        nick_name.focus();
        return;
    }
    var name_len = getStringLength(name);
    if(name_len < 4 || name_len > 16){
        nick_error.text("请填写正确的昵称，应为4到16个字符。");
        nick_error.show();
        return;
    }
    if(name == $.cookie('chat_nickname')){
        nick_error.text("你本来就叫【"+name+"】。");
        nick_error.show();
        return;
    }

    changeNickname(name);
    //my_name.text("昵称："+name);
    //$('#loginModal').modal('hide');
    //nick_error.hide();
}

/*响应事件*/
$('#input-edit').keydown(function(_event) {
    if(13 == _event.keyCode) {
        onClickSendMessage();
    }
});
QxEmotion($('#emotion-btn'), $('#input-edit'));