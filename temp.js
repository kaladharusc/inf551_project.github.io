angular.module('app', ["firebase"])
.filter('escape', function() {
    return function(value) {
        value = value.replace(/\\/g,'');
        return value;

        // return window.encodeURIComponent(value);
    }

})
.controller("AppController", function($scope, $firebaseArray, $firebaseObject) {

    var ref = firebase.database().ref("dc/");
    var query = ref.orderByChild("name").limitToFirst(10);
    $scope.comics = $firebaseArray(query);

    $scope.user = {};
    $scope.searchHistory = [];
    var init = function() {
        clickDisplay();
        $scope.user.name = "Kaladhar Reddy M";
        // faceBookAuthenticate();
    };

    var updateHistory = function(search) {
        if (!search) {
            return;
        }

        var userHistRef = firebase.database().ref("users/"+$scope.user.name+"/history");
        var newHistObj = userHistRef.push();
        newHistObj.set({
            "time": Date(),
            "value": search
        })
    };

    $scope.saveClicks = function(page_id) {
        console.log(page_id);
        var clicksRef = firebase.database().ref("clicks/"+page_id);
        var clickObj = $firebaseObject(clicksRef);
        clickObj.$loaded().then(function() {
            clickObj['$value'] = clickObj['$value'] ? clickObj['$value'] + 1: 1;
            clickObj.$save().then(function(ref) {
                console.log(ref);
            })
        })
    };



    var clickDisplay = function() {
        var clicksRef = firebase.database().ref("clicks/");
        var clicksList = $firebaseObject(clicksRef);

        $scope.clickList = clicksList;
        clicksList.$watch(function() {
            console.log(event);
            console.log(clicksList);
        })
    };



    $scope.removeHistory = function() {
        $scope.searchHistory = []
    };

    $scope.clickHistory = function(search) {
        $scope.searchInput = search;
    };


    $scope.getSearchHistory = function() {
        var userHistRef = firebase.database().ref("users/"+$scope.user.name+"/history/");
        $scope.searchHistory = $firebaseArray(userHistRef);

        console.log($scope.searchHistory);
    }

    $scope.callFireBase = function(search) {
        var searchKey = search || $scope.searchInput;
        var query = ref.orderByChild("name").startAt(searchKey).endAt(searchKey+"\uf8ff").limitToFirst(10);
        $scope.comics = $firebaseArray(query);
        updateHistory($scope.searchInput);
    };

    $scope.callWithAlign = function() {
        if (!$scope.alignValue) {
            return;
        }
        var query = ref.orderByChild("ALIGN").equalTo($scope.alignValue).limitToFirst(10);
        $scope.comics = $firebaseArray(query);
    };

    $scope.callWithAlive = function() {
        var query = ref.orderByChild("ALIVE").equalTo($scope.aliveValue).limitToFirst(10);
        $scope.comics = $firebaseArray(query);
    };

    $scope.callWithAppearances = function() {
        var query = ref.orderByChild("APPEARANCES").startAt($scope.appearances).limitToFirst(20);
        $scope.comics = $firebaseArray(query);
    };

    $scope.callWithHair = function() {
        var query = ref.orderByChild("HAIR").equalTo($scope.hair).limitToFirst(20);
        $scope.comics = $firebaseArray(query);
    };

    $scope.callWithID = function() {
        var query = ref.orderByChild("ID").equalTo($scope.id).limitToFirst(20);
        $scope.comics = $firebaseArray(query);
    };

    $scope.callWithSex = function() {
        var query = ref.orderByChild("SEX").equalTo($scope.sex).limitToFirst(20);
        $scope.comics = $firebaseArray(query);
    };

    var faceBookAuthenticate = function() {
        var provider = new firebase.auth.FacebookAuthProvider();
        // provider.addScope('user_birthday');
        firebase.auth().useDeviceLanguage();
        provider.setCustomParameters({
            'display': 'popup'
        });


        var userRef = firebase.database().ref("users/");
        var userObj = $firebaseObject(userRef);
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            console.log(result);
            var user = result.user;
            userObj[user.displayName] = {"history":[""]};
            userObj.$save().then(function(ref) {
                console.log("success");
                $scope.user.name = user.displayName;
                // $scope.$apply();
                // userRef.key === userObj.$id; // true
            }, function(error) {
                console.log("Error:", error);
            });
            console.log(user)
            // ...
        }).catch(function(error) {
            console.log(error);
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
    };


    init();

});