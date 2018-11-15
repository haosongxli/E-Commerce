$(document).ready(function() {
	$("#userSignUp").attr("disabled", "disabled");

	var mark1 = false;
	var mark2 = false;
	var mark3 = false;
	var mark4 = false;
	
	$("#username").focusout(function(){
		var uname = $('#username').val();

		$.ajax({type:"POST", url:"/checkUser", data:{uname: uname}, success: function(result){
			if(result == 1){
				$("#notice1").text("Sorry, the username has been used");
				$("#noticediv1").addClass('alert alert-warning');
				mark1 = false;
				$("#userSignUp").attr("disabled", "disabled");
			}else{
				$("#notice1").text("");
				$("#noticediv1").removeClass('alert alert-warning');
				mark1 = true;
				if(mark1 && mark2 && mark3 && mark4){
					$("#userSignUp").removeAttr("disabled");
				}
			}
		}})		
	})

	$("#email").focusin(function(){
		$("#noticediv2").removeClass('alert alert-warning');
		$("#notice2").text("");
		mark2 =false;
	})

	$("#email").focusout(function(){
		var wemail = $('#email').val();
		var remail = /^\w+@\w+\.\w{3}$/;
		if(remail.test(wemail)) 
		{
			$("#noticediv2").removeClass('alert alert-warning');
			$("#notice2").text("");
			mark2 = true;
		}
		else if(wemail.length != 0)
		{
			$("#noticediv2").addClass('alert alert-warning');
			$("#notice2").text("Please enter a valid email address");
		}
		if(mark1 && mark2 && mark3 && mark4){
			$("#userSignUp").removeAttr("disabled");

		}else{
			$("#userSignUp").attr("disabled", "disabled");
		}
	})

	$("#password").focusin(function(){
		$("#notice3").text("length of the password should be at least 5");
		$("#noticediv3").addClass('alert alert-info');
		mark3 = false;
	})

	$("#password").focusout(function(){
		var pword = $('#password').val();
		var cpword = $('#cpassword').val();
		if(pword.length == 0)
		{
			$("#notice3").text("");
			$("#noticediv3").removeClass('alert alert-info');
		}
		else if(pword.length>5) 
		{
			$("#notice3").text("");
			$("#noticediv3").removeClass('alert alert-info');
			mark3 = true;
		}
		else
		{
			$("#noticediv3").removeClass('alert-info');
			$("#noticediv3").addClass('alert-warning');
			$("#notice3").text("length of the password should be at least 6");
		}
		if(cpword != pword && cpword.length != 0){
			mark4 = false;
			$("#notice4").text("please reconfirm your password");
			$('#noticediv4').addClass('alert alert-warning');
		}
		if(cpword == pword && pword.length > 5){
			mark4 = true;
			$("#notice4").text("");
			$('#noticediv4').removeClass('alert alert-warning');
		}
		if(mark1 && mark2 && mark3 && mark4){
			$("#userSignUp").removeAttr("disabled");
		}else{
			$("#userSignUp").attr("disabled", "disabled");
		}
		
	})

	$("#cpassword").focusin(function(){
		$("#notice4").text("");
		$("#noticediv4").removeClass('alert alert-warning');
		mark4 = false;
	})

	$("#cpassword").keyup(function(){
		var pword = $('#password').val();
		var cpword = $('#cpassword').val();
		if(pword.length != 0){
			if(cpword != pword){
				$("#notice4").text("please reconfirm your password");
				$('#noticediv4').addClass('alert alert-warning');
			}else{
				$("#notice4").text("");
				$("#noticediv4").removeClass('alert alert-warning');
				mark4 = true;
			}
		}
		else{
			$("#notice4").text("");
			$("#noticediv4").removeClass('alert alert-warning');
		}
		if(mark1 && mark2 && mark3 && mark4){
			$("#userSignUp").removeAttr("disabled");
		}else{
			$("#userSignUp").attr("disabled", "disabled");
		}
	})	
});