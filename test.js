var cheerio = require("cheerio");
var request = require('request');
var fs = require("fs");
$ = cheerio.load('<h2 class="title">Hello</h2>');

$('h2.title').text('Hello there');
$('h2').addClass('welcome');

console.log($.html());

var links = {};
links['getintro'] = "http://en.wikipedia.org/w/api.php?action=query&prop=extracts&titles=Hanoi&exintro=true&format=json";

var extract={};
request(links['getintro'],function(error, response,body){
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
		fs.writeFile("yolo.md",string,function (err){
			if(err)console.log(err);
		});
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

	var text = extract.extract;
	text = text.replace(/(<([^>]+)>)/ig,"");
	var regEx = /\./	;
	text = text.split(regEx);
	
	for(var i in text){
		text[i] = text[i].trim();
	}
	extract.extract = text;
}



