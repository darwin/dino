ig.module('game.entities.kill').requires('impact.entity').defines(function() {

    EntityKill = ig.Entity.extend({
        _wmScalable: true,
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(196, 0, 0, 0.7)',
        size: {
            x: 8,
            y: 8
        },

        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.PASSIVE,

        flip: false,

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
