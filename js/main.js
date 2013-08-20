//Initialize function
var init = function() {
	// TODO:: Do your initialization job
	console.log("init() called");
	
	// add eventListener for tizenhwkey
	document.addEventListener('tizenhwkey', function(e) {
		if (e.keyName == "back")
			tizen.application.getCurrentApplication().exit();
	});

	var adapter = tizen.nfc.getDefaultAdapter();
	
	var onSuccessCB = {
			onattach : function(nfcTag) {
				console.log("NFC Tag's type is " + nfcTag.type);
				for ( var i in nfcTag.properties) {
					console.log("key:" + i + " value:" + nfcTag.properties[i]);
				}

				if (nfcTag.isSupportedNDEF) {
					//read
					nfcTag.readNDEF(function(message) {
						alert(JSON.stringify(message));
						console.log(message);
					});
					
					//write
					var mes = new tizen.NDEFMessage([new tizen.NDEFRecordURI("https://www.tizen.org/")]);
					//nfcTag.writeNDEF(mes,console.log);
				}
				

				if (nfcTag.type == "FELICA") {
					var idm = nfcTag.properties["IDm"];
					
					/**
					 * read suica
					 */
					var req = suica.getHistoryRequest(10);
					console.log(req);
					
					nfcTag.transceive(req, onReadSuica, function(e) {
						console.error(e)
					})
				}

			},
			ondetach : function() {
				console.log("NFC Tag is detached");
			}
	}
	adapter.setTagListener(onSuccessCB/*, [ "FELICA" ]*/);
	
	function onReadSuica(response) {
		console.log("success")
		console.log(response)
		$("#notification").notification( "open" );
				
		var histories = suica.parseHistoryResponse(response);
		console.log(histories)
		
		
		$("#historyList").empty().hide()
		for ( var i in histories) {
			var s = histories[i];
			var li = $("<li>")
			li.append($("<div>").append($("<span>").addClass("device").text(s.device)).append($("<span>").addClass("proc").text(s.proc)));
			if(s.isTrain){
				if(s.exitStation){
					li.append($("<div>").addClass("enter").text("入： " + suica.getStation(s.enterLine, s.enterStation)));
					li.append($("<div>").addClass("exit").text("出： " + suica.getStation(s.exitLine, s.exitStation)));
				}else{
					li.append($("<div>").addClass("enter").text(suica.getStation(s.enterLine, s.enterStation)));
				}
			}
			li.append($("<div>").addClass("date").text(s.date.toLocaleDateString()));
			li.append($("<div>").addClass("balance").text("残高￥" + s.balance));
			li.append($("<div>").addClass("serial").text("No." + s.serial));
			li.appendTo("#historyList")
		}
		$("#historyList").listview("refresh").fadeIn()
	}
};
$(document).ready(init);