/* global angular */

var Precision6 = (v) => Math.floor(v * 100000) / 100000;
var Precision3 = (v) => Math.floor(v * 1000) / 1000;
var Precision2 = (v) => Math.floor(v * 100) / 100;

function FPS($scope) {
	$scope.FPS = $scope.frame * 10;
	$scope.frame = 0;

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

angular.module("TTTT", []).controller("TT", ($scope) => {
	if (!window.DeviceMotionEvent)
		return alert("Not Support DeviceMotionEvent");

	navigator.mediaDevices.enumerateDevices().then((devices) => {
		$scope.mediaDevices = devices.reduce((obj, device) => {
			var dev = {};
			for (var key in device)
				dev = device[key];

			if (!obj[device.kind])
				obj[device.kind] = [];

			obj[device.kind].push(dev);
			return obj;
		}, {});
	}).catch((err) => $scope.err = err);

	navigator.geolocation.watchPosition((pos) => {
		if (!pos)
			return;

		$scope.coord = { TimeStamp: pos.TimeStamp };
		for (var key in pos.coords)
			$scope.coord[key] = pos.coords[key];

		$scope.$apply();
	}, (err) => {
		$scope.err = err;
		$scope.$apply();
	});

	FPS($scope);

	var s = { x: 0, y: 0, z: 0 };
	var v = { x: 0, y: 0, z: 0 };

	$scope.reset = () => {
		s = { x: 0, y: 0, z: 0 };
		v = { x: 0, y: 0, z: 0 };
	};

	var last = performance.now();
	window.addEventListener("devicemotion", (eve) => {
		var now = performance.now();
		var t = (now - last) / 1000;
		last = now;

		var a = {
			x: Precision6(eve.acceleration.x),
			y: Precision6(eve.acceleration.y),
			z: Precision6(eve.acceleration.z)
		};

		s.x += (v.x * t) + (0.5 * a.x * t * t);
		s.y += (v.y * t) + (0.5 * a.y * t * t);
		s.z += (v.z * t) + (0.5 * a.z * t * t);

		v.x += t * a.x;
		v.y += t * a.y;
		v.z += t * a.z;

		$scope.frame++;
		$scope.values = [
			[Precision3(t), "pos", "vel", "acc"],
			["x", Precision2(s.x), Precision2(v.x), Precision2(a.x)],
			["y", Precision2(s.y), Precision2(v.y), Precision2(a.y)],
			["z", Precision2(s.z), Precision2(v.z), Precision2(a.z)],
		];

		$scope.$apply();
	}, true);
});