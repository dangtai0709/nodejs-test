var routes = [
	{path: "/api/", controller: "LoginController"},
	{path: "/api/danhsachphieuyeucau", controller: "CardsRequirementController"},
	{path: "/api/notification/user", controller: "UserNotificationController"},
];

exports.activate = function(app){
	routes.forEach(route => { 
		app.use(route.path, require("../controllers/" + route.controller));
	});	
};