/*
The EntityDebris will randomly spawn a certain count of EntityDebrisParticle 
entities for a certain duration.

Keys for Weltmeister:

duration
	Duration in seconds over which to spawn EntityDebrisParticle entities.
	Default: 5
	
count
	Total count of particles to spawn during the #duration# time span.
	Default: 5
*/

ig.module('game.entities.rodicka').requires('impact.entity').defines(function() {

    EntityRodicka = ig.Entity.extend({
        _wmScalable: true,
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(0, 170, 170, 0.5)',

        size: {
            x: 8,
            y: 8
        },
        duration: 5,
        count: 1,
        dir: 'left',
        klass: 'Soptik',

        durationTimer: null,
        nextEmit: null,

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.durationTimer = new ig.Timer();
            this.nextEmit = new ig.Timer();
        },

        triggeredBy: function(entity, trigger) {
            this.durationTimer.set(this.duration);
            this.nextEmit.set(0);
        },

        update: function() {
            if (this.durationTimer.delta() < 0 && this.nextEmit.delta() >= 0) {
                this.nextEmit.set(this.duration / this.count);

                var x = Math.random().map(0, 1, this.pos.x, this.pos.x + this.size.x);
                var y = Math.random().map(0, 1, this.pos.y, this.pos.y + this.size.y);

                ig.game.spawnEntity('Entity' + this.klass, x, y, {
                    dir: this.dir,
                    speed: this.speed
                });
            }
        }
    });

});
