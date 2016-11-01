var app = angular.module('reachrabbitApp', ['ngRoute'] , function($httpProvider) {
    $httpProvider.defaults.headers.common = {
        'Accept': 'application/json ,application/json ,text/plain , ß*/*'
    };
    $httpProvider.defaults.headers.post = {
        'Content-Type': 'application/json'
    };
    $httpProvider.defaults.headers.put = {
        'Content-Type': 'application/json'
    };
});

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : 'pages/main.html',
            controller  : 'mainController'
        });
});

app.controller('mainController', function($scope, $http, $window) {

    $scope.checkAll = false;
    $scope.formData = {};
    $scope.formData.brandEmail = 'brand@reachrabbit.com';
    $scope.formData.brandPassword = 'test1234';
    $scope.formData.influencerEmail = 'influencer@reachrabbit.com';
    $scope.formData.influencerPassword = 'test1234';

    $http.get('/api/descriptions').success(function(data) {
        //_.each()
        $scope.descriptions = data;
        for(var i = 0 ; i < $scope.descriptions.length ; i++){
            $scope.descriptions[i].selected = $scope.checkAll;
        }
    }).error(function(data) {
        console.log('Error: ' + data);
    });
    
    $scope.runTest = function(testObj) {
        var obj = {
            'brandEmail': $scope.formData.brandEmail,
            'brandPassword': $scope.formData.brandPassword,
            'influencerEmail': $scope.formData.influencerEmail,
            'influencerPassword': $scope.formData.influencerPassword,
        };
        obj.files = [];
        obj.files.push(testObj);
        $http.post('/api/start', obj, []).success(function(data) {
            $window.alert(data);
        }).error(function(data) {
            console.log('Error: ' + data);
        });
    };

    $scope.checkAllChange = function() {
        for(var i = 0 ; i < $scope.descriptions.length ; i++){
            $scope.descriptions[i].selected = $scope.checkAll;
        }
    };

    $scope.change = function(index) {
        $scope.descriptions[index].selected = !$scope.descriptions[index].selected;
        for(var i = 0 ; i < $scope.descriptions.length ; i++){
            if(!$scope.descriptions[i].selected){
                $scope.checkAll = false;
                return
            }
        }
        $scope.checkAll = true;
    }

    $scope.runSeleted = function() {
        var obj = {
            'brandEmail': $scope.formData.brandEmail,
            'brandPassword': $scope.formData.brandPassword,
            'influencerEmail': $scope.formData.influencerEmail,
            'influencerPassword': $scope.formData.influencerPassword,
        };
        obj.files = [];
        for(var i = 0 ; i < $scope.descriptions.length ; i++){
            if($scope.descriptions[i].selected) {
                obj.files.push($scope.descriptions[i]);
            }
        }
        if(obj.files.length > 0) {
            $http.post('/api/start', obj, []).success(function(data) {
                $window.alert(data);
            }).error(function(data) {
                console.log('Error: ' + data);
            });
        }
    };
});
