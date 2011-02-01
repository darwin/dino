ig.module('game.entities.lava').requires('impact.entity').defines(function() {

    EntityLava = ig.Entity.extend({
        _wmScalable: true,
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(255, 0, 0, 0.6)',
        size: {
            x: 8,
            y: 8
        },

        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.PASSIVE,

        flip: false,
        
        fadeStart: 2,
        fadeEnd: 5,

        init: function(x, y, settings) {
            this.parent(x, y, settings);
        },

        update: function() {
            this.parent();
        },

        check: function(other) {
            other.receiveDamage(10, this);
        }
    });

});
