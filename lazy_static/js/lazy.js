
var doc   	= window.document;
var lazy  	= lazy || {};
lazy.utils  = lazy.utils || {};

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

	lazy.inyector = function(idElement, url){

		var el = document.querySelector(idElement);

		lazy.network('GET', url, function(responseText){

			el.innerHTML = responseText;

		});
	}

	lazy.load_resources = function(resoureces, callback){

		 
		lazy.network('GET', url, function(responseText){

			el.innerHTML = responseText;

		});

	}




	lazy.load_template = function(template, callback){

		if( _template_cache[template] === null ){
			lazy.network('GET', template, function(htmlTmpl){
				_template_cache[template] = htmlTmpl;
				callback(htmlTmpl);
			});

		}else
			return callback(_template_cache[template]);
	}


	lazy.list = function(configJS, template){
	

		lazy.load_resources([configJS, template], function({config, templateHTML}){



		});

	}


	lazy.utils = {};
	lazy.utils.compile = function(html, data){

		var htmlSegment = ""; 

		for (var i = data.length - 1; i >= 0; i--) {
			data[i]
		};





	}

}());



