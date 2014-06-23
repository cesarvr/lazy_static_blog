

var doc   	= window.document;
var lazy  	= lazy || {};
lazy.utils  = lazy.utils || {};
lazy.resources = [];
var site = {};
var routes = {};
var posts = {};

(function () {




	var _script = [];
	var _cnt = 0;
	var _template_cache = {};

	lazy.loadjs = function(script_list, callback){
		_script = script_list;
		
		lazy.callback = callback;
		lazy.file_count = script_list.length;
		lazy.make_tags(_script[_cnt]);
	}

	lazy.make_tags = function( tag ){
			
			console.log("cargando: " +tag);
			var _tmp = doc.createElement('script');
			var that = this; 
			
			_tmp.type = "text/javascript";
			_tmp.onload = _tmp.onreadystatechange = function() { 
			
				 /* IE 8 */
				 if(typeof document.attachEvent === "object"){
				 	console.log("stat: " + _tmp.readyState);
					
					if (_tmp.readyState === 'loaded' || _tmp.readyState === 'complete'){
						

						lazy.file_count--;

						if (lazy.file_count == 0) {
							that.callback();
						}else 
							that.make_tags( _script[  _script.length - lazy.file_count ] );

					 }
				}else{
				
					lazy.file_count--;
	           		if (lazy.file_count == 0) {
								that.callback();
							}else 
								that.make_tags( _script[  _script.length - lazy.file_count ] );
	            }

			};	

		_tmp.src = tag;  
		doc.getElementsByTagName('head')[0].appendChild(_tmp);
	};


	lazy.network = function(method, url, callback){
		var xhr = new XMLHttpRequest();
		xhr.open(method, url, true);

		// Hack to pass bytes through unprocessed.
		//xhr.overrideMimeType('text/plain; charset=x-user-defined');
		
		xhr.onreadystatechange = function(e) {
		  if (this.readyState == 4 && this.status == 200) {
		    	callback(this.responseText);
		  }
		}

		xhr.send();
	};

	
	lazy.load_resources = function(resources, callback){

		var url = resources[0];
		resources.splice(0,1);

		lazy.network('GET', url, function(data){
			if (resources.length !== 0) {
				lazy.resources.push(data);
				lazy.load_resources(resources, callback);
			}else{
				lazy.resources.push(data);
				var res = lazy.resources;
				lazy.resources = [];
				callback.apply(null, res);
			}

		});

	}


	lazy.list_blogs = function(idElement, template){	

		var el = document.querySelector(idElement);

		lazy.load_resources(["routes.json",template], function(config, template){

			lazy.routes = JSON.parse(config);
			var htmlCompileData = lazy.utils.compile(template, lazy.routes);

			for (var i = 0; i < htmlCompileData.length; i++) {
				el.innerHTML +=  htmlCompileData[i];
			};

		});
	}


	/*
		Load all necesary resources & templates.
	*/

	lazy.init = function(){

		lazy.load_resources([
			"config.json",
			"routes.json",
			"layout/head.html",
			"layout/header.html",
			"layout/footer.html"

		], function(config, routes, headHTML, bodyHTML, footerHTLM){

			site 	= JSON.parse(config);
			routes 	= JSON.parse(routes); 

			document.querySelector("head").innerHTML = lazy.compile(headHTML, null);
			document.querySelector("body").innerHTML = lazy.compile(bodyHTML, null);
		

			document.querySelector("body").innerHTML += lazy.compile(footerHTLM, null);
			
			lazy.load_custom_tag();				
		});	
	}
	

	lazy.test_cmp = function(){

		lazy.load_resources(["routes.json", 'template/blog_list.html'], function(post, tmpl){
			posts = JSON.parse(post);
			console.log('cvz-> ' + lazy.compile(tmpl) );

		});			

	}

	lazy.load_custom_tag = function(){
		
		var el = document.querySelector("content");
		var template = el.getAttribute('template');
		
		if( template.search('.html') === -1) template += '.html'; 				
		
		lazy.load_resources([template], function(tmplData){
			
			console.log(lazy.compile(tmplData,null));

		});
					

	}

	
	lazy.History = function(){

		window.onpopstate = function(event){
			console.log("--> "+ document.location );
		}
		
		var stateObj = { home: "begin" };
		history.pushState(stateObj, "page 2", "#home");

	}


	lazy.foreach = function(array, callback){

		for (var i = array.length - 1; i >= 0; i--) {
			callback(array[i]);
		};

	}





	/*
		Look recursively for all the {{ code.js }}, tags and execute the javascript. 
	*/

	lazy.compile = function(){

		var scope = null;
		var expression = "";
		var code_js = [];
		
		var compiler = compiler || {};
		var that = this;

		
	compiler.codeJS ={

		strbuild : "",
		inject_cmp : false, 
		_code: [],

		init: function(str){
			str = this.formatting(str);
			this.strbuild += "\"" + str + "\"";
			return this;

		},

		formatting: function(str){
			str = str.trim();
			return str.replace(/\"/g , " \\\" ");
		},

		add_code: function(line){
			this._code.push("\""+ this.formatting(line) + "\"");
		},

		format_code: function(){

			return this._code.toString();

		},

		add: function(str){
	
			str = this.formatting(str);

			if(str.search(';') !== -1){

				this.strbuild += 'lazy.compile([' + this.format_code() + "]," + "post);"

			}

			this.strbuild += str;
			
			return this;

		},

		toString : function(){
			return this.strbuild;
		}


	}; 

		var docjs = Object.create(compiler.codeJS);



		var build_exp = function(htmlTemplate){
			//deleting <% %>
				
			var line = "";

			if( htmlTemplate.length >0 ){
				line = htmlTemplate[0];
				htmlTemplate.splice(0,1);
				
				if(line.trim() === "" && htmlTemplate.length >0) 
					build_exp(htmlTemplate);
				
			}else{ 
				
				eval(docjs.strbuild);
			}
			

			var exp_parser = /(<%)(\D+)(%>)/;
			var parsed = exp_parser.exec(line);

			if(parsed !== null ){
				docjs.add( parsed[2] + "\n" );
				build_exp( htmlTemplate );
			}

		
			docjs.add_code( line );
			build_exp(htmlTemplate);

		}
		
		var cmp = function(template, post){

			if( typeof template === 'string' ) {
    			var lstLines = template.match(/[^\r\n]+/g);
				build_exp( lstLines );
			}
			
			
			for (var i = template.length - 1; i >= 0; i--) {
				var line = template[i];
				var parsed = /{{(.+)}}/.exec(line);

				if (parsed !== null ) {
					var js = parsed[1]; 
					template[i] = line.replace(/{{(.+)}}/, eval(js));
				};

			};

			template = template.replace('{{'+code_blk+'}}', eval(code_blk) );
			cmp(template, object); 
		

		

	
			return scope;
		};	

		var cmpe = function(template, object){

			alert(template);
			alert(object);



		};

		return cmp;
	}();
	
}());



