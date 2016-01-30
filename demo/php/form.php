<?php

   header("Content-type: text/html; charset=utf-8"); 
   if(isset($_REQUEST["authcode"])){
	   session_start();
	/*   echo $_REQUEST["authcode"]."<br/>";
 echo $_SESSION["authcode"];*/
	   if(strtolower($_REQUEST["authcode"])==$_SESSION["authcode"]){
		  echo "<p>输入正确！</p>";   
	   }else{
		  echo "<p>输入错误！</p>";   
	   }   
	   exit();
    }
?>

<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>验证码</title>
<script type="text/javascript" src="http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>
</head>

<body>
   <form method="post" action="captchaAjax.php">
      <div>
         验证码图片：<img id="captcha_img" border="1" src="captcha.php?r=<?php echo rand();?>" width="100">
         <a href="javascript:void(0)" id="btn1">看不清</a>
      </div>
      <div>请输入图片中的内容：<input type="text" name="authcode" value="" /></div>
      <div><input type="submit" value="提交" id="subtn1" /></div>
   </form>

   <script type="text/javascript">
   $(function(){
      $("#btn1").on("click",function(){
         var src="./captcha.php?r='+Math.random()";
         $("#captcha_img").attr("src",src)
      });

      $("#subtn1").on("click",function(event){
         event.preventDefault();
         $.ajax({
             
         })
      })
   })
   </script>
</body>
</html>


































