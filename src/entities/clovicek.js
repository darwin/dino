ig.module('game.entities.clovicek').requires('impact.entity').defines(function() {

    EntityClovicek = ig.Entity.extend({
        size: {
            x: 8,
            y: 8
        },
        maxVel: {
            x: 100,
            y: 100
        },
        friction: {
            x: 150,
            y: 0
        },

        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,

        health: 10,
        speed: 20,
        flip: false,

        animSheet: new ig.AnimationSheet('media/clovicek.png', 8, 8),

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('run', 0.2, [0, 1]);
            this.addAnim('death', 1, [2]);
        },

        update: function() {
            // near an edge? return!
            if (!ig.game.collisionMap.getTile(
            this.pos.x + (this.flip ? +1 : this.size.x - 1), this.pos.y + this.size.y + 1)) {
                this.flip = !this.flip;
            }

            var xdir = this.flip ? -1 : 1;
            this.vel.x = this.speed * xdir;

            this.currentAnim.flip.x = !this.flip;

            this.parent();
        },

        handleMovementTrace: function(res) {
            this.parent(res);

            // collision with a wall? return!
            if (res.collision.x) {
                this.flip = !this.flip;
            }
        },

        check: function(other) {
            this.currentAnim = this.anims.death;
            this.speed = 0;
        }
    });

});
