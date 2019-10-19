var express = require('express');
var router = express.Router();
var mongodb = require("mongodb").MongoClient;
var db_str="mongodb://localhost:27017/lcw";
var jwt = require('jsonwebtoken');
var ObjectId = require('mongodb').ObjectId;
var upload=require("./upload");
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//注册
/* router.post("/register",function(req,res){
	//连接数据库，然后找集合 然后
	console.log(req.body)
	
	res.json({masg:"OK"})//这里就是测试一下
}) */
//注册
router.post("/register",function(req,res){
	//连接数据库，找到数据库就找集合 然后插入数据,插入完数据一定记得关闭数据库
	mongodb.connect(db_str,(err,dbs)=>{
		dbs.collection("user",(err,coll)=>{
			coll.find({username:req.body.username}).toArray((err,data)=>{
				if(data.length>0){//data根据username查出来符合条件的数据
					res.json({msg:"用户名重复"});
					dbs.close()
				}else{
					coll.insert(req.body,()=>{
						res.json({msg:"注册成功"})
						dbs.close()
					})
				}
			})
			
			
		})
	})
})

//登录
router.post("/login",function(req,res){
	mongodb.connect(db_str,(err,dbs)=>{//连接数据库
		dbs.collection("user",(err,coll)=>{//找集合
			coll.find(req.body).toArray((err,data)=>{
				if(data.length>0){//如果用户名和密码的长度大于0就是存在就可以登录
				let content={name:req.body.username};//规定一个token的主体信息
				var miyao='jwt';//定义个密钥 
				let token=jwt.sign(content,miyao,{expiresIn:10*1*1});//通过sign签名  生成token  填入主题信息 后边规定下能保存的时长expirseIn:10*1*1;
					// 登录成功以后将用户名存储到session服务器
					req.session.username=req.body.username;
					res.json({msg:"登录成功",token:token});//要返回给前端，所以这里多个返回值token
					dbs.close();
				}else{
					res.json({msg:"用户名或密码错误"})
					dbs.close();
				}
			})
		})
	})
})

//博客
router.post("/boke",(req,res)=>{
	mongodb.connect(db_str,(err,dbs)=>{
		dbs.collection("boke",(err,coll)=>{
			coll.insert(req.body,()=>{
				res.json({msg:"发布成功"})
				dbs.close();
			})
		})
	})
})
//删除
router.post("/delte",(req,res)=>{
	let id = ObjectId(req.body.id);//请求主体里边的ID所以是req.body.id请求头的ID就是req.query.id
	console.log(id);
	mongodb.connect(db_str,(err,dbs)=>{//找数据库
		dbs.collection("boke",(err,coll)=>{//找集合
			coll.remove({_id:id},()=>{
				res.json({msg:"删除成功"})
				dbs.close();
			})
		})
	})
})
//修改详情
router.post("/xiugai",(req,res)=>{
	let id = ObjectId(req.body.id);//请求主体里边的ID所以是req.body.id请求头的ID就是req.query.id
	console.log(id);
	mongodb.connect(db_str,(err,dbs)=>{//找数据库
		dbs.collection("boke",(err,coll)=>{//找集合
			coll.find({_id:id}).toArray((err,data)=>{
				res.json(data[0]);
				dbs.close();
			})
		})
	})
})
//点击保存按钮保存
router.post("/save1",(req,res)=>{
	let id = ObjectId(req.body.id);//请求主体里边的ID所以是req.body.id请求头的ID就是req.query.id
	console.log(id);
	mongodb.connect(db_str,(err,dbs)=>{//找数据库
		dbs.collection("boke",(err,coll)=>{//找集合
			coll.update({_id:id},{$set:{title:req.body.title,con:req.body.con}},(err,data)=>{
				res.json({msg:"保存成功"});
				dbs.close();
			})
		})
	})
})

//插入图片的方法
router.post("/uploadImg",(req,res)=>{
	upload(req,res)
})

module.exports = router;
