/**
 * Created by Lesson on 2015/10/13.
 */
var io = require('socket.io')();
var nickname_list = [];

function HasNickname(_nickname){
    console.log('HasNickname:'+nickname_list)
    for(var i = 0; i < nickname_list.length; i++){
        if(nickname_list[i] == _nickname){
            return true;
        }
    }
    return false;
}

function RemovieNickname(_nickname){
    for(var i = 0; i < nickname_list.length; i++){
        if(nickname_list[i] == _nickname){
           nickname_list.splice(i,1);
        }
    }
}
io.on('connection',function(socket){
    var address = socket.client.conn.remoteAddress;
    io.emit('user_list',nickname_list);
    io.emit('need_nickname');
    //监听离线事件
    socket.on('disconnect', function () {
        console.log(socket.id + ':disconnect');
        if(socket.nickname != null && socket.nickname != ""){
            io.emit('user_quit',socket.nickname);
            RemovieNickname(socket.nickname);
        }
    });
    //监听 say 事件
    socket.on('say', function(msg){
        if ("" == socket.nickname || null == socket.nickname) {
            console.log('nickname'+socket.nickname);
             io.emit('need_nickname');
        }
         io.emit('say',socket.nickname,msg);
    });

    socket.on('chang_nickname',function(_nickname){

        //console.log(socket.id + ': change_nickname(' + _nickname + ')');
        var name_len = _nickname.replace(/[^\u0000-\u00ff]/g, "tt").length;
        if(name_len < 4 || name_len > 16){
            return socket.emit('change_nickname_error', '请填写正确的昵称，应为4到16个字符。');
        }
        if(socket.nickname == _nickname){
            return io.emit('change_nickname_error', '你本来就叫【'+_nickname+'】。');
        }
        if(HasNickname(_nickname)){
            return io.emit('change_nickname_error', '此昵称已被人使用。');
        }
        var  old_name = "";
        if(socket.nickname != "" && socket.nickname != null){
            old_name = socket.nickname;
            RemovieNickname(old_name);
        }

        nickname_list.push(_nickname);
        socket.nickname = _nickname;

        console.log("用户名列表："+nickname_list);
        socket.emit('change_nickname_done',old_name,_nickname);
        if(old_name == ""){
            return io.emit('user_join',_nickname);
        }else{
            return io.emit('user_change_nickname',old_name,_nickname);
        }

        io.emit('say',"【"+_nickname+"】加入了聊天");
    });
});
exports.listen = function(_server){
    return io.listen(_server);
};