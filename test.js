var cheerio = require("cheerio");
var request = require('request');
var fs = require("fs");
$ = cheerio.load('<h2 class="title">Hello</h2>');

$('h2.title').text('Hello there');
$('h2').addClass('welcome');


var links = {};
links['getintro'] = "http://en.wikipedia.org/w/api.php?action=query&prop=extracts&titles=Suicide_attack&exintro=true&format=json";
links['getbody'] = "http://en.wikipedia.org/w/api.php?action=query&prop=extracts&titles=Suicide_attack&format=json";


var extract={};

fs.open('yolo.md','w',function(){
	request(links['getintro'],writetofile);
	request(links['getbody'],writetofile);

});
var writetofile = function(error, response,body){
	if(!error && response.statusCode ==200){
		processintro(body);
		var string="";
		
		for(var q in extract.tidied){

			if(typeof extract.tidied[q]!=='function'&&extract.tidied[q].content!=="undefined"){
				if(extract.tidied[q].type==='bigheader'){
					string+="# "+extract.tidied[q].content+"\n";
					
				}else if(extract.tidied[q].type==='header'){
					string+="## ";
					string+=extract.tidied[q].content+"\n";
				}else if(extract.tidied[q].type==='content'){
					string+="* "+extract.tidied[q].content+"\n";
					string+="\n\n---\n\n\n";
				}
				/* RUN CONTENT SPLITTING FN HERE */
			
			}
		}
		fs.appendFile("yolo.md",string,function (err){
			if(err)console.log(err);
		});
		//console.log(string);
	}
};
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
	text = extract.extract.replace(/(\r\n|\n|\r)/gm,"");
/*Splits extract into blocks based on the <hx> tags */
	texttemp=text;
	var regEx = /\<h2\>.*?\<\/h2\>.*?(?=\<h2\>)/ig;
	text = text.match(regEx);
	//divides text into header(title) and content
	var tidypresent = [];
	regexheader = /\<h2\>.*?\<\/h2\>/gi;
	if(text==null){
		/*if no <h2> present </h2> --> like in intro*/
		text=[];
		text[0]=texttemp;
	}	
	for(var q=0;q<text.length;q++){
	/* Plan: if <h3> is present then keep a p with it. if no <h3> then just find p*/
		if(regexheader.test(text)){
			var temp={},tempa,tempb;
			temp['type']='bigheader';
			tempa = text[q].match(/\<h2\>(.*?)\<\/h2\>/);
			temp['content']= tempa[1];
			if(temp['content']=='See also')break;
			tidypresent.push(temp);
			tem2 = text[q].split(regexheader);//stores whatever is after the <h2></h2> tag
			tem2 = tem2[1];	
		}else tem2 = text[q];

			tem2 = tem2.split(/\<h3\>(.*?)\<\/h3\>\<p\>(.*?)\<\/p\>|\<p\>(.*?)\<\/p\>/);
			//
			//if patten follows h3 then h2, tem2[1] and tem2[2] stores h3 then p, else tem2[3] stores p and beyond
			//

			if(tem2[1]!=""&&typeof tem2[1]!="undefined"){
				temp={};
				temp['type']='header';
				temp['content']=tem2[1];
				tidypresent.push(temp);

				temp={};
				temp['type']='content';
				temp['content']=tem2[2];
				tidypresent.push(temp);
			}else if(tem2[3]!=""){/* No <h3> just p*/
		
				temp={};
				temp['type']='content';
				temp['content']=tem2[3];
				tidypresent.push(temp);
			}
		
		
	}
	console.log(tidypresent);
	extract.tidied = tidypresent;
}
//Helper functions
var testregex = /<h2>/g;
var teststring = "woop<h2>bah<b><h2>hey<b>dohdohdoh</h2>";
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


