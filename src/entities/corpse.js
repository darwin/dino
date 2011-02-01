ig.module('game.entities.corpse').requires('impact.entity').defines(function() {

    EntityCorpse = ig.Entity.extend({
        size: {
            x: 8,
            y: 10
        },
        offset: {
            x: 8,
            y: 2
        },

        maxVel: {
            x: 100,
            y: 200
        },
        friction: {
            x: 600,
            y: 0
        },

        animSheet: new ig.AnimationSheet('media/player.png', 23, 12),
        friend: false,

        init: function(x, y, settings) {
            var a = 4;
            if (settings.friend) {
                a = 6 + 2*(Math.random()*4).floor();
            }
            this.addAnim('corpse', 0.7, [a, a+1]);
            
            if (settings.overrideAlpha) {
                this.currentAnim.alpha = settings.overrideAlpha;
            }
            this.parent(x, y, settings);
        },

        update: function() {
            this.parent();
        },

    });

});
