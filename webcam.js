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
		devices.filter((device) => {
			return device.kind == "videoinput";
		}).forEach((device,i) => {
			navigator.getUserMedia({
				video: { deviceId: device.deviceId }
			},(stream) => {
				/** @type {HTMLVideoElement} */
				var video = document.getElementById("v" + i);
				video.src = URL.createObjectURL(stream);
				video.onclick = () => video.play();
			},(error) => { throw error; });
		});
	}).catch((err) => {
		console.error(err);
		$scope.err = err;
	});
});