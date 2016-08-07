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

	navigator.mediaDevices.enumerateDevices().then((devices) => {
		$scope.videoDevices = devices.map((device) => device.toJSON()).filter((device) => device.kind == "videoinput");
		$scope.deviceId = $scope.videoDevices[$scope.videoDevices.length - 1].deviceId;
		$scope.switchCamera();
	}).catch((err) => $scope.err = err);

	if(!navigator.getUserMedia)
		navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

	$scope.switchCamera = () => {
		navigator.getUserMedia({
			video: { deviceId: $scope.deviceId }
		},(stream) => {
			/** @type {HTMLVideoElement} */
			var video = document.getElementById("video");
			video.onloadedmetadata = (eve) => video.play();
			video.src = URL.createObjectURL(stream);
		},(error) => {
			$scope.err = error;
			console.error(error);
		});
	};
});