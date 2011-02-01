/*
This entity shakes the screen when its triggeredBy() method is called - usually
through an EntityTrigger entity.


Keys for Weltmeister:

strength 
	max amount of screen movement in pixels
	default: 8

duration 
	duration of the screen shaking in seconds
	default: 1
*/

ig.module('game.entities.earthquake').requires('impact.entity').defines(function() {

    EntityEarthquake = ig.Entity.extend({
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(80, 130, 170, 0.7)',

        size: {
            x: 8,
            y: 8
        },

        duration: 1,
        strength: 8,
        quakeTimer: null,

        init: function(x, y, settings) {
            this.quakeTimer = new ig.Timer();
            this.parent(x, y, settings);
            this.dx = 0;
            this.dy = 0;
        },

        triggeredBy: function(entity, trigger) {
            this.quakeTimer.set(this.duration);
        },

        update: function() {
            this.dx = 0;
            this.dy = 0;
            var delta = this.quakeTimer.delta();
            if (delta < -0.1) {
                var s = this.strength * Math.pow(-delta / this.duration, 2);
                if (s > 0.5) {
                    this.dx = Math.random().map(0, 1, -s, s);
                    this.dy = Math.random().map(0, 1, -s, s);
                    ig.game.screen.x += this.dx;
                    ig.game.screen.y += this.dy;
                }
            }
        }
    });

});