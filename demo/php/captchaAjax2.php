<?php 
	session_start();
	$session_authcode=$_SESSION["authcode"];
	echo $session_authcode;   
 ?>