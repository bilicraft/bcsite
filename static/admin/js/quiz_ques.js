$(function(){

	var tpl = ui('#tpl');
	var quizList = ui('#quiz-list');
	quizList.sp = ui('#quiz-list-sp', {
		gotoPage : function(n){
			quizList.refresh(n - 1);
		}
	});
	quizList.add = function(d){
		var e = tpl.dwQuizListItem.clone();
		e.refresh = function(d){
			e.tData = d;
			e.dwID.dwText.innerHTML = d.id;
			e.dwQuestion.dwText.innerHTML = d.content.replace(/\n/g, '<br>');
			e.dwAnswer.dwText.innerHTML = d.answer;
		};
		e.refresh(d);
		quizList.element.appendChild(e);
		return e;
	};
	quizList.refresh =  function(page){
		var pageSize = 20;
		page = page || 0;
		var offset   = page * pageSize;
		quizList.loading(true);
		G.method('quiz.list_question', {
			offset : offset,
			limit  : pageSize
		}, function(c, d){
			quizList.loading(false);
			quizList.$.empty();
			d.list.forEach(function(x){
				quizList.add(x);
			});
			quizList.sp.refresh(page + 1, Math.ceil(d.total / pageSize));
		}, function(c, m){
			quizList.loading(false);
			G.error(m);
		});
	};
	quizList.$.on('click', '.ctrl-item', function(){
		var $p = $(this).parents('.quiz-list-item');
		var td = $p[0].tData;
		switch(this.dataset.action){
			case 'edit':
				var ef = quizEditFrame({
					type : 'edit',
					save : function(d){
						$p[0].refresh(d.quiz);
					},
					close : function(){
						$p.removeClass('editing');
					},
					data : td
				});
				$p.prepend(ef.$).addClass('editing');
				setTimeout(function(){
					ef.$.slideDown();
				}, 10);
				break;
			case 'remove':
				ui.confirm({
					text : '确定要删除这道题目吗？',
					okCallback : function(){
						G.method('quiz.rm_questions', {
							ids : td.id
						}, function(c, d){
							$p.slideUp(200, function(){
								ui.notify('已删除');
								$p.remove();
							});
						}, function(c, m){
							G.error(m)
						});
					}
				});
				break;
			default:
				break;
		}
	});
	var rowAdd = ui('#row-add');

	var btnAdd = ui('#btn-add', {
		click : function(){
			var e = quizEditFrame({
				type : 'add',
				close : function(){
					btnAdd.$.show();
				},
				save : function(){
					quizList.refresh();
				}
			});
			btnAdd.$.hide();
			rowAdd.$.append(e.$);
			setTimeout(function(){
				e.$.slideDown();
			}, 10);
		}
	});


	function quizEditFrame(option){
		var default_option = {
			type : 'add',
			close : null,
			save : null,
			data : {
				id : 0,
				content : '',
				ignore_case : 1,
				answer : '',
			}
		};
		option = ui.initOption(default_option, option);
		var t = tpl.dwQuizEditFrame.clone();
		var e = ui(t);
		e.close = function(){
			if(option.close){
				option.close.call(e);
			}
			e.$.slideUp(200, function(){
				e.$.remove();
			});
		};
		var btnRemove = ui(t.dwRowHead.dwBtnRemove, {
			click : function(){
				e.close();
			}
		});
		var textQuestion = ui(t.dwRowText.dwO.dwI.dwText);
		if(option.data.content){
			textQuestion.val(option.data.content)
		}
		var iptAnswer = ui(t.dwRowAnswer.dwAnswer, {
			limit : 10
		});
		if(option.data.answer){
			iptAnswer.val(option.data.answer)
		}
		var toggleCase = ui(t.dwRowAnswer.dwCase);
		toggleCase.val((option.data.ignore_case != 1));
		var iptBtnSave = ui(t.dwRowRule.dwBtnSave, {
			click : function(){
				var answer = iptAnswer.val();
				if(!answer || !answer.length){
					ui.alert('请输入问题答案');
					return false;
				}
				if(answer.length > 10){
					ui.alert('答案太长，请保持在10个字内。');
					return false;
				}
				var content    = textQuestion.val();
				var ignore_case = toggleCase.val() ? 0 : 1;
				if(!content.length){
					ui.alert('请输入问题');
					return false;
				}
				iptBtnSave.loading(true);
				var mt;
				if(option.data.id > 0){
					mt = 'quiz.edit_question';
				}else{
					mt = 'quiz.add_question';
				}
				G.method(mt, {
					content : content,
					answer   : answer,
					id       : option.data.id,
					ignore_case : ignore_case
				}, function(c, d){
					iptBtnSave.loading(false);
					ui.notify('保存成功');
					if(option.type == 'add'){
						textQuestion.val('');
						iptAnswer.val('');
					}
					d.quiz.ignore_case = parseInt(d.quiz.ignore_case);
					option.save && option.save.call(e, d);
				}, function(c, m){
					iptBtnSave.loading(false);
					ui.alert(m);
				});
			}
		});
		e.element.className += ' is-' + option.type;
		return e;
	}

	quizList.refresh();

});