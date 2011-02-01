ig.module('game.entities.player').requires('impact.entity', 'game.entities.lava').defines(function() {

    EntityPlayer = ig.Entity.extend({

        // The players (collision) size is a bit smaller than the animation
        // frames, so we have to move the collision box a bit (offset)
        size: {
            x: 13,
            y: 10
        },
        offset: {
            x: 7,
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

        type: ig.Entity.TYPE.A,
        // Player friendly group
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.PASSIVE,

        animSheet: new ig.AnimationSheet('media/player.png', 23, 12),

        // These are our own properties. They are not defined in the base
        // ig.Entity class. We just use them internally for the Player
        flip: false,
        accelGround: 400,
        accelAir: 200,
        jump: 180,
        health: 10,
        flip: false,

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Add the animations
            this.addAnim('idle', 1, [2, 3]);
            this.addAnim('run', 0.07, [0, 1]);
            this.addAnim('jump', 1, [0]);
            this.addAnim('fall', 0.4, [1]);
            this.addAnim('dead', 1, [4, 5]);
        },

        kill: function(from) {
            ig.game.spawnEntity('EntityCorpse', this.pos.x, this.pos.y, {
                overrideAlpha: (from instanceof EntityLava)?0.5:1.0
            });
            this.parent();
        },

        update: function() {

            // move left or right
            var accel = this.standing ? this.accelGround : this.accelAir;
            if (ig.input.state('left')) {
                this.accel.x = -accel;
                this.flip = true;
            } else if (ig.input.state('right')) {
                this.accel.x = accel;
                this.flip = false;
            } else {
                this.accel.x = 0;
            }

            // jump
            if (this.standing && ig.input.pressed('jump')) {
                this.vel.y = -this.jump;
            }

            // set the current animation, based on the player's speed
            if (this.vel.y < 0) {
                this.currentAnim = this.anims.jump;
            } else if (this.vel.y > 0) {
                this.currentAnim = this.anims.fall;
            } else if (this.vel.x != 0) {
                this.currentAnim = this.anims.run;
            } else {
                this.currentAnim = this.anims.idle;
            }

            this.currentAnim.flip.x = this.flip;

            // move!
            this.parent();
        }
    });

});
