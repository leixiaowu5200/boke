var net=require('net');
var readline=require('readline');
var client=new net.Socket();
var port=3000;
var hostname='192.168.12.49';


client.connect(port,hostname,()=>{
	client.write('上线了')
})

client.on('data',(data)=>{
	console.log(''+data)
	say()
})
var r1=readline.createInterface({
	input:process.stdin,
	output:process.stdout
})

function say(){//每个用户可以自行编辑的内容，写入到服务器的数据  只要跟数据相关就放到data里调用
	r1.question('',(str)=>{
		client.write(str)//把这个数据写过去
	})
}