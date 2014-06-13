
(function(){

	

	lazy.inyector("head", "layout/head.html"); //  HEAD 

	lazy.inyector("#header", "layout/header.html"); // HEADER 

	lazy.list("routes.json", "template/list.html"); // CONTENT 

	lazy.inyector("#footer", "layout/footer.html"); // FOOTER 




})();