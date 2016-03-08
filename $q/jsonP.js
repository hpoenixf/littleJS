function JsonP(url,data,callback) {
	var jsp = document.createElement("script")
	jsp.type = "text/javascript"
	var dataStr = ""
	for(var i in data) {
		dataStr+=("&"+encodeURIComponent(i)+"="+encodeURIComponent(obj[i]))
	}
	jsp.src = url+"?callback="+callback+dataStr
	document.body.appendChild(jsp)
}



