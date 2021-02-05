var routes = [
	{path: "/api/danhsachphieuyeucau", controller: "CardsRequirementController"},
];

exports.activate = function(app){
	routes.forEach(route => { 
		app.use(route.path, require("../controllers/" + route.controller));
	});	
};