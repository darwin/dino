ig.module('game.entities.soptik').requires('impact.entity', 'game.entities.particle', 'game.entities.lava').defines(function() {

    EntitySoptik = ig.Entity.extend({

        // The players (collision) size is a bit smaller than the animation
        // frames, so we have to move the collision box a bit (offset)
        size: {
            x: 17,
            y: 20
        },
        offset: {
            x: 5,
            y: 4
        },

        maxVel: {
            x: 100,
            y: 300
        },
        friction: {
            x: 600,
            y: 0
        },

        type: ig.Entity.TYPE.B,
        // Evil enemy group
        checkAgainst: ig.Entity.TYPE.A,
        // Check against friendly
        collides: ig.Entity.COLLIDES.PASSIVE,

        animSheet: new ig.AnimationSheet('media/soptik.png', 28, 24),

        flip: false,
        accelGround: 400,
        accelAir: 200,
        jump: 80,
        health: 10,
        dir: 'left',
        doJump: false,
        jumpiness: 0.1,
        turnFactor: 0.7,

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Add the animations
            this.addAnim('idle', 1, [0, 1]);
            this.addAnim('run', 0.15, [0, 1]);
            this.addAnim('jump', 1, [0]);
            this.addAnim('fall', 0.4, [1]);
        },

        update: function() {

            // move left or right
            var accel = this.standing ? this.accelGround : this.accelAir;
            if (this.dir == 'left') {
                this.accel.x = -accel;
                this.flip = true;
            } else if (this.dir == 'right') {
                this.accel.x = accel;
                this.flip = false;
            } else {
                this.accel.x = 0;
            }

            // near an edge? jump!
            if (this.standing && !ig.game.collisionMap.getTile(this.pos.x + (this.flip ? +4 : this.size.x - 4), this.pos.y + this.size.y + 1)) {
                this.doJump = true;
            }

            if (this.checkCounter) {
                this.checkCounter++;
                if (this.checkCounter > 5) {
                    if (Math.random() < this.turnFactor && Math.abs(this.checkX - this.pos.x) <= 5) {
                        if (this.dir == "left") {
                            this.dir = "right";
                        } else {
                            this.dir = "left";
                        }
                    }
                    this.checkCounter = 0;
                }
            }

            // jump
            if (this.standing && this.doJump) {
                if (this.jumpiness >= 0.99 || Math.random() < this.jumpiness) {
                    this.vel.y = -this.jump;

                    this.checkX = this.pos.x;
                    this.checkCounter = 1;
                }
            }
            this.doJump = false;

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

            if (this.currentAnim) {
                this.currentAnim.flip.x = this.flip;
            }

            // move!
            this.parent();
        },

        handleMovementTrace: function(res) {
            this.parent(res);

            // collision with a wall? jump!
            if (res.collision.x) {
                this.doJump = true;
            }
        },
        
        kill: function(from) {
            console.log(from);
            ig.game.spawnEntity('EntitySoptikCorpse', this.pos.x, this.pos.y, {
                vel: {
                    x: this.vel.x*0.1,
                    y: 0
                },
                flip: this.flip,
                overrideAlpha: (from instanceof EntityLava)?0.5:1.0
            });
            
            this.parent();
        },

        check: function(other) {
            other.receiveDamage(10, this);
        }
    });

    EntitySoptikCorpse = EntityParticle.extend({
        lifetime: 10,
        fadetime: 1,
        bounciness: 0,
        size: {
            x: 17,
            y: 20
        },
        offset: {
            x: 5,
            y: 4
        },
        vel: {
            x: 0,
            y: 0
        },
        flip: false,

        animSheet: new ig.AnimationSheet('media/soptik.png', 28, 24),

        init: function(x, y, settings) {
            this.addAnim('rot', 1, [2, 3]);
            if (settings.overrideAlpha) {
                this.currentAnim.alpha = settings.overrideAlpha;
            }
            this.parent(x, y, settings);
        },
        
        update: function() {
            if (this.currentAnim) {
                this.currentAnim.flip.x = this.flip;
            }
            this.parent();
        }
        
    });

});
