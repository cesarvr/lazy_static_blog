
var doc   	= window.document;
var lazy  	= lazy || {};
lazy.utils  = lazy.utils || {};
lazy.resources = [];
var site = {};
var routes = {};

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

		lazy.load_resources(['template/blog_list.html'], function(tmpl){
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

	/*
		Look recursively for all the {{ code.js }}, tags and execute the javascript. 
	*/

	lazy.compile = function(){

		var scope = null;
		


		var prepare_exp = function(htmlTemplate){
			//deleting <% %>
			//
			
			var exp_open  = template.search('<%'); 
			var exp_close = template.search('%>');
			
			
					

			
		}
		
		var cmp = function(template, object){

			var ini_open  = template.search('{{');
			var end_close = template.search('}}');
			
			var exp_open  = template.search('<%'); 
			var exp_close = template.search('%>');
			
			
			if(exp_open !== -1 && exp_close !== -1){
				prepare_exp(template);	
			}
			
			if (ini_open === -1 && end_close === -1 ) {

				scope = template;
			}else{

				var code_blk = template.substring(ini_open + 2, end_close);

				template = template.replace('{{'+code_blk+'}}', eval(code_blk) );
				cmp(template, object); 
			}

		

	
			return scope;
		};	

		return cmp;
	}();
	
}());



