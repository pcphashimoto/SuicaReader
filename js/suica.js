/**
 * refer: http://sourceforge.jp/projects/felicalib/wiki/suica 
 * refer: http://www.sony.co.jp/Products/felica/business/tech-support/st_usmnl.html
 */

var suica = {
	devices : {
		3 : "精算機",
		4 : "携帯型端末",
		5 : "車載端末",
		7 : "券売機",
		8 : "券売機",
		9 : "入金機",
		18 : "券売機",
		20 : "券売機等",
		21 : "券売機等",
		22 : "改札機",
		23 : "簡易改札機",
		24 : "窓口端末",
		25 : "窓口端末",
		26 : "改札端末",
		27 : "携帯電話",
		28 : "乗継精算機",
		29 : "連絡改札機",
		31 : "簡易入金機",
		70 : "VIEW ALTTE",
		72 : "VIEW ALTTE",
		199 : "物販端末",
		200 : "自販機"
	},
	procs : {
		1 : "運賃支払(改札出場)",
		2 : "チャージ",
		3 : "券購(磁気券購入)",
		4 : "精算",
		5 : "精算 (入場精算)",
		6 : "窓出 (改札窓口処理)",
		7 : "新規 (新規発行)",
		8 : "控除 (窓口控除)",
		13 : "バス (PiTaPa系)",
		15 : "バス (IruCa系)",
		17 : "再発 (再発行処理)",
		19 : "支払 (新幹線利用)",
		20 : "入A (入場時オートチャージ)",
		21 : "出A (出場時オートチャージ)",
		31 : "入金 (バスチャージ)",
		35 : "券購 (バス路面電車企画券購入)",
		70 : "物販",
		72 : "特典 (特典チャージ)",
		73 : "入金 (レジ入金)",
		74 : "物販取消",
		75 : "入物 (入場物販)",
		198 : "物現 (現金併用物販)",
		203 : "入物 (入場現金併用物販)",
		132 : "精算 (他社精算)",
		133 : "精算 (他社入場精算)",
	},
	getHistoryRequest : function(blocknum) {
		blocknum = blocknum | 10;
		var data = [ 1, 0x0f, 0x09, blocknum ]
		for ( var i = 0; i < blocknum; i++) {
			data = data.concat([ 0x80, i ])
		}
		return data;
	},
	parseHistoryResponse : function(res) {
		if (res[0] | res[1]) {
			console.error(res)
			return;
		}
		var blocknum = res[2];
		var blocklen = 16
		var ret = [];
		for ( var i = 0; i < blocknum; i++) {
			var offset = 3 + blocklen * i;
			var blockdata = res.slice(offset, offset + blocklen)
			var model = suica.model(blockdata)
			model && ret.push(model);
		}
		return ret;
	},
	model : function(data) {
		if (!data[0])
			return;
		var date = (data[4] << 8) + data[5];
		var proc = data[1];
		var isTrain = true
		switch (proc) {
		case 70:
		case 73:
		case 74:
		case 75:
		case 198:
		case 203:
			//物販
			isTrain = false
			break;
		case 13:
		case 15:
		case 31:
		case 35:
			//バス
			isTrain = false
			break;
		}
		var ret = {
			device : suica.devices[data[0]],
			proc : suica.procs[data[1]],
			isTrain : isTrain,
			date : new Date(2000 + ((date >> 9) & 127), ((date >> 5) & 15) - 1,
					date & 31),
			enterLine : data[6],
			enterStation : data[7],
			exitLine : data[8],
			exitStation : data[9],
			balance : data[10] + (data[11] << 8),
			serial : (data[12] << 16) + (data[13] << 8) + data[14]
		}
		return ret;
	},
	stations : [],
	init : function() {
		$.get("stations.txt", function(data) {
			stations = JSON.parse(data)
		})
	},
	getStation : function(line, station) {
		if (line & station) {
			if (stations[line] && stations[line][station]
					&& stations[line][station][2]) {
				return stations[line][station][2];
			}
			return "[" + line + ":" + station + "]";
		}
		return "";
	}
};

$(document).ready(suica.init);