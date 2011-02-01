ig.module('game.entities.teller').requires('impact.entity').defines(function() {

    EntityTeller = ig.Entity.extend({
        size: {
            x: 32,
            y: 64
        },

        _wmScalable: true,
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(0, 255, 255, 0.7)',

        target: null,
        wait: -1,
        waitTimer: null,
        canFire: true,
        
        duration: 5,

        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.NEVER,

        init: function(x, y, settings) {
            if (settings.checks) {
                this.checkAgainst = ig.Entity.TYPE[settings.checks.toUpperCase()] || ig.Entity.TYPE.A;
                delete settings.check;
            }

            this.parent(x, y, settings);
            this.waitTimer = new ig.Timer();
        },
        
        action: function() {
            ig.game.tell(this.text, this.text2, this.duration, this.who, this.target, this.bubble);
        },

        check: function(other) {
            if (this.canFire && this.waitTimer.delta() >= 0) {
                this.action();

                if (this.wait == -1) {
                    this.canFire = false;
                } else {
                    this.waitTimer.set(this.wait);
                }
            }
        },

        update: function() {}
    });

});