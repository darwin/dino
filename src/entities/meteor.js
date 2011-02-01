ig.module('game.entities.meteor').requires('impact.entity', 'game.entities.particle').defines(function() {

    EntityMeteor = ig.Entity.extend({
        size: {
            x: 16,
            y: 16
        },
        offset: {
            x: 0,
            y: 0
        },

        maxVel: {
            x: 100,
            y: 200
        },
        friction: {
            x: 0,
            y: 0
        },

        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,

        animSheet: new ig.AnimationSheet('media/meteor.png', 16, 16),
        dir: 'left',
        speed: 200,

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('lfall', 0.2, [0, 2]);
            this.addAnim('rfall', 0.2, [1, 3]);
        },

        bang: function() {
            var eq = ig.game.getEntityByName('eqg');
            if (eq) {
                eq.triggeredBy(this);
            } else {
                console.log('No global earthquake. Define entity "eqg"');
            }

            ig.game.spawnEntity('EntityMeteorek', this.pos.x, this.pos.y, {
                vel: {
                    x: this.vel.x,
                    y: this.vel.y
                }
            });
            ig.game.spawnEntity('EntityMeteorek', this.pos.x, this.pos.y, {
                vel: {
                    x: -this.vel.x,
                    y: this.vel.y
                }
            });
            if (Math.random() < 0.4) {
                ig.game.spawnEntity('EntityMeteorek', this.pos.x, this.pos.y, {
                    vel: {
                        x: 0,
                        y: this.vel.y * 1.2
                    }
                });
            }
            if (Math.random() < 0.2) {
                ig.game.spawnEntity('EntityMeteorek', this.pos.x, this.pos.y, {
                    vel: {
                        x: this.vel.x * 0.4,
                        y: this.vel.y * 1.2
                    }
                });
            }

            this.kill();
        },

        handleMovementTrace: function(res) {
            if (res.collision.y) {
                this.bang();
            }
            this.parent(res);
        },

        update: function() {
            var xdir = 0;
            if (this.dir == 'left') xdir = -1;
            if (this.dir == 'right') xdir = 1;

            this.accel.x = 200 * xdir;

            this.parent();
        },

        check: function(other) {
            other.receiveDamage(10, this);
        }
    });

    EntityMeteorek = EntityParticle.extend({
        size: {
            x: 8,
            y: 8
        },
        offset: {
            x: 0,
            y: 0
        },

        maxVel: {
            x: 200,
            y: 200
        },
        friction: {
            x: 0,
            y: 0
        },

        collides: ig.Entity.COLLIDES.PASSIVE,
        bounciness: 0.7,

        lifetime: 1,
        fadetime: 1,
        bounciness: 0.6,

        animSheet: new ig.AnimationSheet('media/meteorek.png', 8, 8),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('roll', 0.2, [0, 1]);
        },

        update: function() {
            this.parent();
            if (this.standing) {
                this.kill();
            }
        }
    });

});
