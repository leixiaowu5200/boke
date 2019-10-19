var net=require('net');
var server=new net.Server();
var obj={};//用来存放 所有连到这个服务器的客户
var i=0;//流水账号

server.on('connection',(client)=>{
    client.name=++i;
    obj[client.name]=client;
	client.on('data',(data)=>{//区分
		console.log('服务器收到：'+client.name+data)
		huifu(client,data)//
	})
	
})

function huifu(client,message){//除了回复对象 还要接受消息的形参
    for(let i in obj){
        obj[i].write(client.name+"说"+message)
    }
}

server.listen(3000)