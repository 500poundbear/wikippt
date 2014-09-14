var cheerio = require("cheerio");
var request = require('request');
var fs = require("fs");
$ = cheerio.load('<h2 class="title">Hello</h2>');

$('h2.title').text('Hello there');
$('h2').addClass('welcome');

console.log($.html());

var links = {};
links['getintro'] = "http://en.wikipedia.org/w/api.php?action=query&prop=extracts&titles=Hanoi&exintro=true&format=json";
links['getbody'] = "http://en.wikipedia.org/w/api.php?action=query&prop=extracts&titles=Hanoi&format=json";


var extract={};
request(links['getbody'],function(error, response,body){
	if(!error && response.statusCode ==200){
		processintro(body);
		var string="";
		string+="# Introduction\n";
		var cnter=0;
		for(var x in extract.extract){
			if(cnter>5){
				string+="\n\n---\n\n##Second\n";
				cnter=0;
			}
			string+="* "+extract.extract[x]+"\n";
			cnter++;
		}	
		/*fs.writeFile("yolo.md",string,function (err){
			if(err)console.log(err);
		});*/
		//console.log(string);
	}
});
function processintro(body){
	var temp = JSON.parse(body).query.pages;
	var first;
	/* Finds the one and only child and saves it into first */
	for(var i in temp){
		if(temp.hasOwnProperty(i) && typeof(i)!=='function'){
			first = temp[i];break;
		}
	}
	/* copies results back into extract */
	for(var i in first){
		if(first.hasOwnProperty(i) && typeof(i)!=='function'){
			extract[i]=first[i];
		}
	}
	/* time to split extract into parts */
	text = extract.extract;

	/*Splits extract into blocks based on the <hx> tags */
	var regEx = /\<h[1-6]\>.*?\<\/h[1-6]\>.*?(?=\<h[1-6]\>)/ig;
	text = text.split(regEx);


	/* Removes all offending tags in text body*/
//	text = text.replace(/(<([^>]+)>)/ig,"");
	
	for(var q in text){
		//console.log(text[q]);
		//console.log('\n\n\n');
	}

/*
	var collector = [];
	for(var i in text){
		text[i] = text[i].trim();
		text[i] = text[i].split('. ');
		for(var q in text[i]){
			collector.push(text[i][q]);
		}
	}
	extract.extract = collector;*/
}
//Helper functions
var testregex = /<h2>/g;
var teststring = "woop<h2>bah<b><h2>hey<b>dohdohdoh</h2>";
console.log(teststring);
String.prototype.splitz = function(regex){
	return this.split(regex);
}
Object.prototype.splitz = function(regex){
	var retun = [];
	for(var i in this){
		if(typeof this[i]==='string'){
			var temp = this[i].splitz(regex);
			for(var j in temp){
				if(typeof temp[j]==='string'&&temp[j]!='')retun.push(temp[j]);		
			}
		}
	}
	return retun;
}
Object.prototype.trim = function(){}
//console.log(teststring.splitz(testregex).splitz('o'));
String.prototype.replacez = function(regex,rep){
	return this.replace(regex,rep);
}
//console.log(teststring.replacez(testregex,'FUC').replacez('bah','MIAN'));


