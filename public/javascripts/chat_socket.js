/**
 * Created by Lesson on 2015/10/14.
 */
var socket = io.connect("http://172.20.28.244:3000");

socket.on('say',function(name,msg){
    addMessage(name,getLocalHMS(),msg);
});

socket.on('user_list',function(_user_list){
    useUserList(_user_list);
});

socket.on('need_nickname',function(){
    var name =  $.cookie('chat_nickname');
    if(null == name || name == ""){
        $('#loginModal').modal('show');
    }else{
        changeNickname(name);
    }
});

socket.on('change_nickname_error',function(_error_msg){
    console.log('change_nickname_error : ' + _error_msg);
    $('#login-modal').modal('show');
    $("#nickname-error").text(_error_msg);
    $("#nickname-error").show();
    $('#nickname-edit').focus();
});

socket.on('change_nickname_done',function(_old_name,_new_name){
    console.log('change_nickname_done('+_new_name + ',' + _old_name + ')');
    $.cookie('chat_nickname',_new_name);
    $('#loginModal').modal('hide');
    $("#nickname-error").hide();
    $('#my-nickname').text('昵称：'+_new_name);

    if(_old_name != null && _old_name != ""){
        addServerMessage(getLocalHMS(), '[' + _old_name + '] 改名为 [' + _new_name + ']');
    }
    updateListCount();
});

socket.on('user_join',function(_nick_name){
    console.log('user_join(' + _nick_name + ')');
    addUserList(_nick_name);
    updateListCount();
    addServerMessage(getLocalHMS(), '[' + _nick_name + '] 进入了聊天室。');
});

socket.on('user_change_nickname',function(_old_nick_name,_new_nick_name){
    console.log('user_change_nickname('+_old_nick_name + ', '+_new_nick_name+')');
    removeListUser(_old_nick_name);
    addUserList(_new_nick_name);
});

socket.on('user_quit',function(_nick_name){
    console.log('user_quit('+_nick_name + ')');
    removeListUser(_nick_name);
    updateListCount();
    addServerMessage(getLocalHMS(), '[' + _nick_name + '] 离开了聊天室。');
});
function say(_content){
    socket.emit('say',_content);
}

function changeNickname(_nickname){
    socket.emit('chang_nickname',_nickname);
}