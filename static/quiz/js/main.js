$(function(){

	var char = Char(window, document.getElementById('char'));
	char.changeSkin(C.quizSkin());
	char.changeRad(1100);


	var iptAnswer = ui('#ipt-answer');

	var btnNext   = ui('#btn-next');


	var life = ui('#life');
	life.val = function(v){
		if(v === undefined){
			return this.hp || 0;
		}
		this.hp = v;
		this.element.style.height = Math.floor(400 * v) + 'px';
	};


});