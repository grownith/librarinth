/* global angular */

var FPSs = [];
function FPS($scope) {
	FPSs.push($scope.frame);
	if (FPSs.length > 10)
		FPSs.shift();

	$scope.frame = 0;
	$scope.FPS = FPSs.reduce((sum, fps) => sum + fps, 0);

	if ($scope && $scope.canvas && $scope.canvas.scene && $scope.canvas.objects) {
		$scope.canvas.scene.objects.forEach((obj) => {
			obj.pos = obj.next;
			obj.next = { x: -10 + (Math.random() * 20), z: -10 + (Math.random() * 20) };
		});
	}

	setTimeout(() => {
		FPS($scope);
		$scope.$apply();
	}, 100);
}

angular.module("TTTT",["ngMaterial"]).controller("TT",($scope) => {
	if(!navigator.mediaDevices)
	  navigator.mediaDevices = {};
	
	if(!navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices.getUserMedia = function(constraints) {
			var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);
			return new Promise(function(resolve,reject) {
				if(!getUserMedia)
					return reject(new Error('getUserMedia is not implemented in this browser'));
		
				getUserMedia.call(navigator, constraints, resolve, reject);
			});
		}
	}

	$scope.switchCamera = function() {
		var video = document.getElementById("v");
		navigator.mediaDevices.getUserMedia({
			video: {
				width: 800,
				height: 400,
				deviceId: { exact: $scope.deviceId },
				optional: [{ sourceId: $scope.deviceId }]
			}
		},(stream) => {
			video.src = URL.createObjectURL(stream);
		},(error) => { throw error; });
	};

	navigator.mediaDevices.enumerateDevices().then((devices) => {
		$scope.devices = devices.filter((device) => device.kind == "videoinput").map((device) => device.toJSON());
		$scope.deviceId	= $scope.devices[$scope.devices.length - 1].deviceId;
		$scope.switchCamera();
	}).catch((err) => {
		console.error(err);
		$scope.err = err;
	});
});
