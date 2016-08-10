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

	if(!navigator.getUserMedia)
		navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

	$scope.switchCamera = function() {
		var video = document.getElementById("v");
		navigator.getUserMedia({
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
		$scope.devices = devices.filter((device) => {
			return device.kind == "videoinput";
		}).map((device) => device.toJSON());
	}).catch((err) => {
		console.error(err);
		$scope.err = err;
	});
});
