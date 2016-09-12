angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,$http,$ionicPlatform,$ionicLoading) {
  $ionicLoading.show({
      template: 'Working...'
    }).then(function(){
       console.log("The loading indicator is now displayed");
    });
    var url = window.location.href;
      console.log('fhkadsvfadfvhdvfhd '+url);
    $scope.data = {}
    $scope.scan = function(){
      cordova.plugins.barcodeScanner.scan(
        function (result) {
          if(!result.cancelled)
          {
            console.log(result);
            url = [];
            url = window.localStorage.getItem("external_load").split('/');
            console.log(url);
            if(url[0] != ""){
                $scope.data.fieldType = url[7].split('?')[0];//result.format;
                console.log($scope.data.fieldType);
                $scope.data.text = result.text;  
                $scope.data.recId = url[4];
                $scope.data.codeType = result.format;     
                method = 'POST';
                headers =[];
                headers["Authorization"] = "Bearer "+ url[5];
                url = 'https://'+ url[6].split('.')[1] +'.salesforce.com/services/apexrest/serviceLauncherBarcode';
                headers["Content-Type"] = "application/json";
                $http({
                        headers: headers,
                        method: method,
                        url: url,
                        data: {data:$scope.data}
                    })
                    .success(function(data, status, headers, config) {
                      console.log('Status : ',status);
                      console.log(data);
                      window.localStorage.setItem("external_load","");
                      window.open('salesforce1://sObject/'+$scope.data.recId +'/view', '_system', 'location=no');
                      navigator.app.exitApp();
                    })
                    .error(function(data, status, headers, config) {
                        console.log('Status : ',status);
                        console.error(data);
                        window.localStorage.setItem("external_load","");
                        window.open('salesforce1://sObject/'+$scope.data.recId +'/view', '_system', 'location=no');
                        navigator.app.exitApp();
                    });
              }else{
                navigator.app.exitApp();
              }
          }
          else
          {
            //alert("You have cancelled scan");
            navigator.app.exitApp();
          }
        },
        function (error) {
            console.log("Scanning failed: " + error);
        },
        {
          "preferFrontCamera" : false, // iOS and Android
          "showFlipCameraButton" : true, // iOS and Android
          "prompt" : "Place a barcode inside the scan area", // supported on Android only
          "formats" : "PDF417,AZTEC", // default: all but PDF_417 and RSS_EXPANDED
          "orientation" : "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
        }
      );
    }
    $ionicPlatform.ready(function() {
      $scope.scan();
    });
    $scope.open = function(){ 
      window.open('com.salesforce.salesforce1://sObject/0012800000lsZC6/view', '_system', 'location=no');
        console.log('Twitter is available');
      }
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
