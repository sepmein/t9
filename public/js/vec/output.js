(function() {
	var href = window.location.href;
	$('#url').attr('href', href).html(href);

	$('#send').submit(function(event) {
		event.preventDefault();
		var to = $('#sendTo').val();
		$.post('/vec/sendUrl',{
			to: to,
			url: href
		},function(data){
			if(data.status) {
				//show success info
				console.log('success');
				$('#sendTo').val('发送成功');
			} else {
				//show failure info
				console.log(data.info);
				$('#errMessage').text(data.err).show(300).delay(2000).hide(200);
			}
		});
	});
})();

(function() {
	var holder = document.getElementById('holder');
	var paper = Raphael(holder, 300, 150);
	paper.customAttributes.along = function(a) {
		return {
			path: logo.getSubpath(0, a)
		};
	};
	var set = paper.set();
	var logo = paper.path('M40 10L75 100L120 10M170 12A44 44 0 1 0 170 98M117 55H280M240 12A44 44 0 1 0 240 98').attr({
		opacity: 0,
		stroke: 'rgb(100,100,100)'
	});
	var c = paper.path().attr({
		along: 0,
		'stroke-width': '5',
		stroke: '#268ABB'
	});
	paper.rect(0, 0, 600, 120).attr({
		fill: '#000',
		opacity: 0,
		href: '/vec',
		cursor: 'point'
	});

	function logoAnimation() {

	}
	setTimeout(function() {
		c.animate({
			along: logo.getTotalLength()
		}, 5000,function(){
			$('p.speech').show('fast');
		});
	}, 500);
})();