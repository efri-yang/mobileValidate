<?php 
	session_start();
	$session_authcode=$_SESSION["authcode"];
	$user_authcode=strtolower($_REQUEST["captchaCode"]);
	if($user_authcode==$session_authcode){
		echo 1;   
	}else{
		echo 0;   
	}   
 ?>