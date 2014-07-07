
(function(){

	
	
	lazy.History.init(); //Listen for change in URL
	


	/*
		Add custom routes. 
	*/
	lazy.History.add_page({
		url: "#about",
		resource:"template/about.html"

	});


	//lazy.test_cmp();
})();
