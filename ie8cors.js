//http://mcgivery.com/ie8-and-cors/


var RequestHelper = {
	GatewayURL: "https://www.yourdomain.on.ca/secure/gateway.html",
	Busy: false,
	sendRequest: function(url,success,$){
		var protocol = location.protocol;
		if(window.XDomainRequest){
			if(protocol == "http:"){
				if(RequestHelper.Busy){
					setTimeout(function(){
						RequestHelper.sendRequest(url,success,$);
					},50);
				} else {
					RequestHelper.Busy = true;
					$("body").append("<iframe id="ajaxProxy" style="display: none;" src="&quot;+RequestHelper.GatewayURL+&quot;" width="320" height="240"></iframe>"); 
					$("#ajaxProxy").load(function(){ 
						ajaxProxy.postMessage(url,"*"); 
						$(window).bind("message",function(e){ 
							$("#ajaxProxy").remove(); 
							$(window).unbind("message"); 
							RequestHelper.Busy = false; 
							success(e.originalEvent.data); 
						}); 
					}); 
				} 
			} else { 
				var xdr = new XDomainRequest(); 
				xdr.open("get", url); 
				xdr.onprogress = function () { }; 
				xdr.ontimeout = function () { }; 
				xdr.onerror = function () { }; 
				xdr.onload = function() { 
					success(xdr.responseText); 
				} 
				setTimeout(function () {
					xdr.send();
				}, 0); 
			} 
		} else { 
			$.ajax({ 
				type: "GET", 
				url: url, 
				dataType: "html", 
				async:true, success: 
				function (response){ 
					success(response); } 
				}); 
		} 
	} 
}
