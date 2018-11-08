$(document).ready(function() {
	alert("cont");

	// form validation
	$("tr").append("<span></span>")
	$("#username").focusin(function(){
		$("tr:nth-of-type(1) span").show();
		$("tr:nth-of-type(1) span").removeClass('ok error');
		$("tr:nth-of-type(1) span").addClass('info');
		$("tr:nth-of-type(1) span").text("Contain only alphabetical or numeric characters");
	})
	$("#username").focusout(function(){
		var uname = $('#username').val();
		var letterNumber = /^[0-9a-zA-Z]+$/;
		if(uname.length == 0)
		{
			$("tr:nth-of-type(1) span").hide();
		}
		else if(letterNumber.test(uname)) 
		{
			$("tr:nth-of-type(1) span").removeClass('info error');
			$("tr:nth-of-type(1) span").addClass('ok');
			$("tr:nth-of-type(1) span").text("OK");
		}
		else
		{
			$("tr:nth-of-type(1) span").removeClass('ok info');
			$("tr:nth-of-type(1) span").addClass('error');
			$("tr:nth-of-type(1) span").text("Error");
		}
	})


	$("#password").focusin(function(){
		$("tr:nth-of-type(3) span").show();
		$("tr:nth-of-type(3) span").removeClass('ok error');
		$("tr:nth-of-type(4) span").removeClass('ok error');
		$("tr:nth-of-type(4) span").hide();
		$("tr:nth-of-type(3) span").addClass('info');
		$("tr:nth-of-type(3) span").text("At least six characters long");
	})
	$("#password").focusout(function(){
		var pword = $('#password').val();
		if(pword.length == 0)
		{
			$("tr:nth-of-type(3) span").hide();
		}
		else if(pword.length>5) 
		{
			$("tr:nth-of-type(3) span").removeClass('info error');
			$("tr:nth-of-type(3) span").addClass('ok');
			$("tr:nth-of-type(3) span").text("OK");
		}
		else
		{
			$("tr:nth-of-type(3) span").removeClass('ok info');
			$("tr:nth-of-type(3) span").addClass('error');
			$("tr:nth-of-type(3) span").text("Error");
		}
	})

	$("#cpassword").focusin(function(){
		$("tr:nth-of-type(4) span").show();
		$("tr:nth-of-type(4) span").removeClass('ok error');
		$("tr:nth-of-type(4) span").addClass('info');
		$("tr:nth-of-type(4) span").text("Should match the password");
	})
	$("#cpassword").focusout(function(){
		var pword = $('#password').val();
		var cpword = $('#cpassword').val();
		if(cpword.length == 0)
		{
			$("tr:nth-of-type(4) span").hide();
		}
		else if(pword != cpword)
		{
			$("tr:nth-of-type(4) span").removeClass('ok info');
			$("tr:nth-of-type(4) span").addClass('error');
			$("tr:nth-of-type(4) span").text("Error");
		}
		else
		{
			$("tr:nth-of-type(4) span").removeClass('info error');
			$("tr:nth-of-type(4) span").addClass('ok');
			$("tr:nth-of-type(4) span").text("OK");
		}
	})

	$("#email").focusin(function(){
		$("tr:nth-of-type(2) span").show();
		$("tr:nth-of-type(2) span").removeClass('ok error');
		$("tr:nth-of-type(2) span").addClass('info');
		$("tr:nth-of-type(2) span").text("A valid email address");
	})
	$("#email").focusout(function(){
		var wemail = $('#email').val();
		var remail = /^\w+@\w+\.\w{3}$/;
		if(wemail.length == 0)
		{
			$("tr:nth-of-type(2) span").hide();
		}
		else if(remail.test(wemail)) 
		{
			$("tr:nth-of-type(2) span").removeClass('info error');
			$("tr:nth-of-type(2) span").addClass('ok');
			$("tr:nth-of-type(2) span").text("OK");
		}
		else
		{
			$("tr:nth-of-type(2) span").removeClass('ok info');
			$("tr:nth-of-type(2) span").addClass('error');
			$("tr:nth-of-type(2) span").text("Error");
		}
	})

	
});