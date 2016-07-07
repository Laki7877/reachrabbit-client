# Application source

Angular app source separate into angular components / modules, stylesheets, and 3rd party vendors.

## Application instance

Our application have root level scripts. Each script correspond to one web app.

For example, a landing page app

```
// landingApp.js

// import components or modules
var components = [
	require('./components/common'),
	require('./modules/landing')
];

angular.module('app', components)
  .run(function($state) {
  	// start application with state 'brand'
    $state.go('brand');
  });
```

will create a bundled landingApp.js in `public/js` folder. This can then be imported by `public/index.html` for use.


## Components and Modules

Our angular application consist of two main subjects, components and modules. Modules are usually larger than components and should represent an individual web application. 

For example, `brand` module represents collection of webpages for brand users. `table` component represents reusable table directives and helpers for all other module to use.
 
## State

Since our angular application is a single page app in its nature, we no longer have multiple **web pages**. However, each page under angular are defined as **state**. For example, `home` state is the application homepage, and `home.signup` maybe the home's signup page.

## Importing modules from static UI

Assuming you have raw ui for a new modules.

1. Create and name new folder under modules. (i.e, `myModule/`)
2. Create `index.js` under the created folder
```
angular.module('yourModule', [])
	.config(function($stateProvider) {
		// create your module webpages or state
		$stateProvider	
			.state('home', {
				url: '/', // header url, this is optional
				controller: 'myController',
				templateUrl: 'myindex.html', // html for this page
				css: 'folder/myCss.css' // exclusive css for this state

			});
	});

// require recursively
require('bulk-require')(__dirname, ['**/*.js', '!index.js']);

// export module name
module.exports = 'yourModule';
```
3. Add your controller under this module (i.e. `myController.js`)
```
angular.module('yourModule')
	.controller('myController', function($scope) {
		// do something with $scope
	});
```
4. Add your view under this module (i.e. `myindex.html`)

## Create a new application to use module

1. Create new app under root `app/` folder

```
// myApp.js
var components = [
	require('./modules/myModule')
];
angular.module('app', components)
  .run(function($state) {
    $state.go('home'); //go to mymodule's home state
  });
```

2. run `gulp build`

3. create new base html in `public` folder that reference your app.

```
<html>
	<head>
		<script src="js/myApp.js"></script>
	</head>
	<body>
		<div class="container">
			<div data-ui-view></div>
		</div>
	</body>
</html>
```