(function() {
	var holder = document.getElementById('holder');
	var paper = Raphael(holder, 1280, 800);

	var preference = {
		P: [640, 400],
		//中心位置
		ALPHA: 0,
		//星轨的初始角度
		MAXRANGE: 1000,
		//最远的星轨到中心的距离，越大分布越稀疏
		NUMOFTRAILS: 100,
		//星轨条数，数目增大严重影响性能，3000左右能模拟真实自然界场景
		MAGNITUDE: {
			NUM: [10, 23, 67, 229, 738, 2420],
			//模拟自然界中星等，分别为一等星、二等星。。。
			LIGHT: [1, 1 / 1.35, 1 / 1.35 / 1.35, 1 / 1.35 / 1.35 / 1.35, 1 / 1.35 / 1.35 / 1.35 / 1.35, 1 / 1.35 / 1.35 / 1.35 / 1.35 / 1.35, 1 / 1.35 / 1.35 / 1.35 / 1.35 / 1.35 / 1.35] //各星等间亮度差异
		},
		speed: 120000,
		//星轨运行速度，完成一圈所需要的ms
		step: 360 //步进，星轨完成动画总共运行的角度
	};

	function starTrail(P) {

		//计算svg path elliptical arc算法的customAttributes函数
		paper.customAttributes.arc = function(origin, degree, distance, alpha) {
			var coords = getCoords(origin, degree, distance, alpha);
			//q:第二个参数的区间算法需要改进，0～180,180～360,360～540。。。
			//a:alpha相对180的倍数，再mod 2，这样就能划分区间
			var a = Math.floor(alpha / 180) % 2;
			var path = 'M' + coords[0][0] + ' ' + coords[0][1] + 'a' + distance + ' ' + distance + ' ' + 0 + ' ' + a + ' ' + 1 + ' ' + (coords[1][0] - coords[0][0]) + ' ' + (coords[1][1] - coords[0][1]);
			return {
				path: path
			};
		};

		paper.customAttributes.magnitude = function() {
			var m = magnitude();
			return {
				stroke: "white",
				"stroke-width": m.strokeWidth,
				opacity: m.opacity
			}
		};

		function getCoords(o, d, dis, al) {
			var coords = [
				[],
				[]
			];
			var radians = (d / 180) * Math.PI,
				alpha = al % 360,
				radiansPlus = ((d + alpha) / 180) * Math.PI;
			coords[0][0] = 640 + Math.cos(radians) * dis;
			coords[0][1] = 400 + Math.sin(radians) * dis;
			coords[1][0] = 640 + Math.cos(radiansPlus) * dis;
			coords[1][1] = 400 + Math.sin(radiansPlus) * dis;
			return coords;
		}

		function magnitude() {
			var m = {};
			var grade = function() {
					var g;
					if (preference.MAGNITUDE.NUM[0]) {
						g = preference.MAGNITUDE.LIGHT[0];
						preference.MAGNITUDE.NUM[0]--;
					} else if (preference.MAGNITUDE.NUM[1]) {
						g = preference.MAGNITUDE.LIGHT[1];
						preference.MAGNITUDE.NUM[1]--;
					} else if (preference.MAGNITUDE.NUM[2]) {
						g = preference.MAGNITUDE.LIGHT[2];
						preference.MAGNITUDE.NUM[2]--;
					} else if (preference.MAGNITUDE.NUM[3]) {
						g = preference.MAGNITUDE.LIGHT[3];
						preference.MAGNITUDE.NUM[3]--;
					} else if (preference.MAGNITUDE.NUM[4]) {
						g = preference.MAGNITUDE.LIGHT[4];
						preference.MAGNITUDE.NUM[4]--;
					} else if (preference.MAGNITUDE.NUM[5]) {
						g = preference.MAGNITUDE.LIGHT[5];
						preference.MAGNITUDE.NUM[5]--;
					}
					return g;
				}();
			m.opacity = grade;
			m.strokeWidth = grade * 2;
			return m;
		}

		var set = paper.set();

		for (var i = P.NUMOFTRAILS; i--; i > 0) {
			var distance = Math.random() * P.MAXRANGE,
				degree = Math.random() * 360,
				al = P.ALPHA;
			set.push(paper.path().attr({
				magnitude: []
			}).attr({
				arc: [P.P, degree, distance, al]
			}));
		}

		(function() {
			set.forEach(function(el) {
				var d = el.attrs.arc[1],
					dis = el.attrs.arc[2],
					al = el.attrs.arc[3];
				el.animate({
					arc: [
						[640, 400], d, dis, (al + P.step)]
				}, P.speed, 'linear');
			});
		})();

	}

	starTrail(preference);
})();