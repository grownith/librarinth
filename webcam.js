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

	navigator.mediaDevices.enumerateDevices().then((devices) => {
		$scope.videoDevices = devices.map((device) => device.toJSON()).filter((device) => device.kind == "videoinput");
		$scope.deviceId = $scope.videoDevices[0].deviceId;
		$scope.$apply();

		var video = document.getElementById("v");
		navigator.getUserMedia({
			video: { deviceId: { exact: $scope.deviceId } }
		},(stream) => {
			/** @type {HTMLVideoElement} */
			video.src = URL.createObjectURL(stream);
			video.onloadedmetadata = (eve) => {
				video.play();
			};
		},(error) => {
			console.error(error);
			$scope.err = error;
		});

	}).catch((err) => $scope.err = err);
});