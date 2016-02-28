$(function(){

	var char = Char(window, document.getElementById('char'));
	char.changeSkin(C.quizSkin());
	char.changeRad(1100);

	var quizQuestion = ui('#quiz-question')
	var vv = {
		correct : ui('#vv-correct'),
		wrong   : ui('#vv-wrong'),
		failed  : ui('#vv-failed'),
		success : ui('#vv-success'),
		loading : ui('#vv-loading'),
	};


	var iptAnswer = ui('#ipt-answer');
	var btnNext   = ui('#btn-next', {
		click : function(){
			next();
		}
	});


	var currentNum = ui('#current-num');
	var totalNum   = ui('#total-num');
	var correctNum = ui('#correct-num');

	var life = ui('#life');
	life.val = function(v){
		if(v === undefined){
			return this.hp || 0;
		}
		this.hp = v;
		this.element.style.height = Math.floor(400 * v) + 'px';
	};

	function switchView(name){
		var i;
		for(i in vv){
			if(i != name){
				vv[i].$.hide();
			}
		}
		if(name){
			vv[name].$.fadeIn(100);
		}
	}

	function loadSession(session){
		currentNum.$.html(session.answered + 1);
		totalNum.$.html(session.total);
		correctNum.$.html(session.correct);
		life.val(1 - (session.answered - session.correct) / session.die_on);
	}

	function loadQuestion(content){
		quizQuestion.$.html(content.replace(/\n/g, '<br>'));
	}


	function start(){
		switchView('loading');
		setTimeout(function(){
			var d = initData();
			switchView();
			loadQuestion(d.question_content);
			loadSession(d.session);
		}, 1000);
	}

	function next(){
		switchView('loading');
		setTimeout(function(){
			var d = randData();
			switchView(d.state);
			if(d.state == 'correct' || d.state == 'wrong'){
				loadQuestion(d.question_content);
				loadSession(d.session);
				setTimeout(function(){
					switchView();
				}, 1000);
			}else{
				btnNext.$.hide();
			}
		}, 1000);
	}

	var _randSession = {
		total    : 10,
		answered : 0,
		correct  : 0,
		die_on   : 5
	};
	var wrongLimit = 6;

	function randData(){
		_randSession.answered ++;
		var state = Math.random() > 0.5 ? 'correct' : 'wrong';
		if(state == 'correct'){
			_randSession.correct ++;
		}else{
			if((_randSession.answered - _randSession.correct) >= _randSession.die_on){
				state = 'failed';
			}
		}
		if(_randSession.answered == _randSession.total){
			if(_randSession.correct >= _randSession.total - _randSession.die_on){
				state = 'success';
			}else{
				state = 'failed';
			}
		}
		return {
			state : state,
			session : _randSession,
			question_content : Dict.createSentence() + "\n\n" + 
								"A." + Dict.createSentence() + "\n" + 
								"B." + Dict.createSentence() + "\n" + 
								"C." + Dict.createSentence() + "\n" + 
								"D." + Dict.createSentence() + "\n"
		}
	}

	function initData(){
		return {
			session : _randSession,
			question_content : 	Dict.createSentence() + "\n\n" + 
								"A." + Dict.createSentence() + "\n" + 
								"B." + Dict.createSentence() + "\n" + 
								"C." + Dict.createSentence() + "\n" + 
								"D." + Dict.createSentence() + "\n"
		}
	}

	function playMIDI(){
		MIDI.Player.loadFile(C.staticPath() + '/quiz/res/cirno.mid', function(){
			var cvs = document.getElementById('voice-cvs');
			var ctx = cvs.getContext('2d');
			cvs.width = 600;
			cvs.height = 50;
		    ctx.fillStyle = '#66ccff';
			MIDI.Player.addListener(function(data) { // set it to your own function!
			    ctx.clearRect(0, 0, 600, 50);
		    	if(data.velocity > 0){
		    		ctx.fillRect(data.note * 6, 10, 6, 30);
		    	}
			});
			MIDI.Player.start();
		}, function(){

		}, function(x){
			console.log(x)
		});
		MIDI.Player.start();
	}

	playMIDI();
	start();

});