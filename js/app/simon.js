define(['jquery'], function($) {
	'use strict';

	var Simon = {
		sequence: [],
		copy: [],
		round: 0,
		active: true,

		init: function () {
			var that = this;
			$('#start').on('click',function () {
				that.startGame();
            });
        },
		startGame: function () {
            this.sequence = [];
            this.copy = [];
            this.round = 0;
            this.active = true;
			$('#lose').hide();
			this.newRound();
        },
        randNumber: function () {
			return Math.floor( ( Math.random() * 4 ) + 1 );
        },
		newRound: function () {
			$('[data-round]').text(++this.round);
			this.sequence.push(this.randNumber());
			this.copy = this.sequence.slice(0);
			this.animate(this.sequence);
        },
		registerClick: function (e) {
			var desiredResponse = this.copy.shift();
			var actualResponse = $(e.target).data('tile');
			this.active = (desiredResponse === actualResponse);
			this.checkLose();
        },
        checkLose: function () {
			if(this.copy.length === 0 && this.active) {
				this.deactivateSimonBoard();
                this.newRound();
			} else if (!this.active) {
				this.deactivateSimonBoard();
                this.endGame();
			}
        },
		endGame: function () {
			$('#lose').show();
			$( $('[data-round]').get(0) ).text('0');
        },
        activateSimonBoard: function () {
			var that = this;
			$('.simon')
				.on('click', '[data-tile]', function (e) {
					that.registerClick(e);
                })
				.on('mousedown','[data-tile]', function () {
					$(this).addClass('active');
					that.playSound($(this).data('tile'));

                })
                .on('mouseup','[data-tile]', function () {
                    $(this).removeClass('active');
                });

            $('[data-tile]').addClass('hoverable');

        },
        deactivateSimonBoard: function() {
                $('.simon')
                    .off('click', '[data-tile]')
                    .off('mousedown', '[data-tile]')
                    .off('mouseup', '[data-tile]');

                $('[data-tile]').removeClass('hoverable');
        },
        animate: function (sequence) {

				var i = 0;
				var that = this;
				var interval = setInterval(function () {

					that.playSound(sequence[i]);
					that.lightUp(sequence[i]);

					i++;

					if(i >= sequence.length){
						clearInterval(interval);
						that.activateSimonBoard();
					}

                }, 600);
        },
		lightUp: function (tile) {
			var $tile = $('[data-tile=' + tile + ']').addClass('lit animated fadeInDown');
            window.setTimeout(function() {
                $tile.removeClass('lit animated fadeInDown');
            }, 300);
        },
		playSound: function (tile) {
            var audio = $('<audio autoplay></audio>');
            audio.append('<source src="sounds/' + tile + '.ogg" type="audio/ogg" />');
            audio.append('<source src="sounds/' + tile + '.mp3" type="audio/mp3" />');
            $('[data-action=sound]').html(audio);
        }
		

	};

	return Simon;

});
