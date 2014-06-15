
var doc   	= window.document;
var lazy  	= lazy || {};
lazy.utils  = lazy.utils || {};
lazy.resources = [];

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


//---------
	lazy.inyector = function(idElement, url){

		var el = document.querySelector(idElement);

		lazy.network('GET', url, function(responseText){

			el.innerHTML = responseText;

		});
	}
//----------	


	
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







	lazy.page = function(pageToCompile){


		lazy.network('GET', pageToCompile, function(pageHTML){

			lazy.page.body = document.querySelector("body");
			lazy.page.body.innerHTML += pageHTML;
			lazy.compile(pageHTML);
			



		});
	
	}

	lazy.include = function(pageHTML){
		lazy.network('GET', pageHTML, function(data){

			lazy.page.body.innerHTML = data;
			return data;

		});
	}

	lazy.compile = function(pageHTML){

			var ini_code = pageHTML.search('{{');
			var end_code = pageHTML.search('}}'); 

			if (ini_code === -1 && end_code === -1 ) {
				
				//return pageHTML;
			}else{
			
				var code_blk = pageHTML.substring(ini_code + 2, end_code);

				//compile ?
				pageHTML.replace(code_blk, eval(code_blk) );
				//lazy.utils.compileV2(pageHTML);

			}



	}




}());



