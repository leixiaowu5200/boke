var express = require('express');
var router = express.Router();
var mongodb = require("mongodb").MongoClient;
var db_str="mongodb://localhost:27017/lcw";
var jwt = require('jsonwebtoken');
var ObjectId = require('mongodb').ObjectId;
var async= require("async");
/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express',username:req.session.username});
  res.render('index',{username:req.session.username});
});
//登录
router.get("/login",(req,res)=>{
	res.render("login",{})
})
//注册
router.get("/register",(req,res)=>{
	res.render("register",{})
})
//测试
router.get("/test",(req,res)=>{
	res.send("测试一下能不能打印")
})
/* //测试
router.get("/test",(req,res)=>{
	res.render("test",{})
}) */
//退出登录
router.get("/relogin",(req,res)=>{
	req.session.destroy(function(err){//销毁session
		if(err){//如果异常
			console.log(err)
		}else{
			res.redirect("/login")//调用一个中间件，重新定向到某个路径，自定义想让跳首页或登录都可以
		}
	})
})

// 校验token
router.post("/jiaoyan",(req,res)=>{
	let token=req.headers.token;//请求头
	let miyao = "jwt";
	jwt.verify(token,miyao,(err,data)=>{
		if(err){
			res.json({code:401,msg:"登录已过期"})
		}else{
			res.json({code:200,msg:"登录成功"})
		}
	})
})
/* //博客简单倒序排序展示
router.get("/boke",(req,res)=>{
	// res.render("boke",{})//这里也要用到数据库了，注释掉这个渲染重新写
	mongodb.connect(db_str,(err,dbs)=>{
		dbs.collection("boke",(err,coll)=>{
			coll.find().sort({_id:-1}).toArray((err,data)=>{
				res.render("boke",{data:data});//rander也是个中间件,直接传整个数组
				dbs.close()
			})
		})
	})
}) */
//博客分页功能
router.get("/boke",(req,res)=>{
	// res.render("boke",{})//这里也要用到数据库了，注释掉这个渲染重新写
	mongodb.connect(db_str,(err,dbs)=>{
		dbs.collection("boke",(err,coll)=>{
			//页码
			var pageNo=req.query.pageNo;//get请求 query传参
			pageNo=pageNo?pageNo:1;//默认是第一页。
			//总页数 根据数据库取到的数据赋值，暂时先设置为0；
			var page=0;
			// 每页展示数量
			var size=2;//规定每页显示2条
			//总数据数量
			var count=0;
			// 根据查找数量几条，和几条以后
			//一次操作里对这个集合两次查找，查询方式不一样，互不影响，所以用个异步流程模块，做两个没有关系的异步函数
			async.series([
				function(callback){//这个函数存在的目的就是给上边声明的变量赋值，没有其他操作
					coll.find().toArray((err,result)=>{
						count=result.length;
						page=Math.ceil(count/size);

						pageNo=pageNo<=1?1:pageNo;
						pageNo=pageNo>=page?page:pageNo;

						// 不需要返回什么实际意义的东西所以
						callback(null,'');//null无错误
						dbs.close()
					})
				},
				function(callback){
					coll.find().sort({_id:-1}).limit(size).skip(size*(pageNo-1)).toArray((err,info)=>{//从0条以后开始查2条
						//info 根据前边所有条件查询到的符合条件的数组数据
						callback(null,info);//info作为返回值供回调函数使用
						dbs.close()

					})
				}
			],(err,data)=>{
				//data == ["",info] 第一个异步函数返回值是空 第二个函数返回值是info
				res.render("boke",{data:data[1],pageNo:pageNo,page:page});//所有前端需要用的数据都传过去
			})
		})
	})
})

//详情
router.get("/detail",(req,res)=>{
	console.log(req.query)//主件ID值打印的话去终端命令框查看
	// let id=req.query.id;//这里就要用objectID替换掉了  请求头的IDreq.query.id
	let id = ObjectId(req.query.id);
	mongodb.connect(db_str,(err,dbs)=>{
		dbs.collection("boke",(err,coll)=>{
			coll.find({_id:id}).toArray((err,data)=>{//查询数据的条件是错的所以要先查询下然后在到最上边写ObjectID
				res.render("detail",{detail:data[0]});//rander也是个中间件,直接传整个数组
				dbs.close()
			})
		})
	})
})

router.get("/xiugai",(req,res)=>{
	let id = ObjectId(req.query.id);
	mongodb.connect(db_str,(err,dbs)=>{
		dbs.collection("boke",(err,coll)=>{
			coll.find({_id:id}).toArray((err,data)=>{//查询数据的条件是错的所以要先查询下然后在到最上边写ObjectID
				res.json({detail:data[0]});
				dbs.close()
			})
		})
	})
})
module.exports = router;
