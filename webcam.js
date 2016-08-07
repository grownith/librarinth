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
	}).catch((err) => $scope.err = err);

	$scope.switchCamera = () => {
		navigator.mediaDevices.getUserMedia({
			video: { deviceId: $scope.deviceId,width: 800, height: 500 }
		}).then((stream) => {
			/** @type {HTMLVideoElement} */
			var video = document.getElementById("video");
			video.onloadedmetadata = (eve) => video.play();
			video.src = URL.createObjectURL(stream);
		}).catch((error) => {
			$scope.err = error;
			console.error(error);
		});
	};
});