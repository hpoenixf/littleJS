function JsonP(url,data,callback) {
	var jsp = document.createElement("script")
	jsp.type = "text/javascript"
	var dataStr = ""
	for(var i in data) {
		dataStr+=("&"+escape(i)+"="+escape(obj[i]))
	}
	jsp.src = url+"?callback="+callback+dataStr
	document.body.appendChild(jsp)
}



