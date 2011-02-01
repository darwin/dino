ig.module('game.entities.samicka').requires('impact.entity').defines(function() {

    EntitySamicka = ig.Entity.extend({
        size: {
            x: 13,
            y: 10
        },
        offset: {
            x: 7,
            y: 2
        },

        maxVel: {
            x: 50,
            y: 200
        },
        friction: {
            x: 800,
            y: 0
        },

        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.PASSIVE,

        animSheet: new ig.AnimationSheet('media/player.png', 23, 12),

        flip: false,
        accelGround: 200,
        accelAir: 200,
        jump: 180,
        health: 10,
        flip: false,
        dir: 'left',
        
        waitDelay: 2,
        minWaitRepeatTime: 5,

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Add the animations
            this.addAnim('walk', 0.10, [14, 15]);
            this.addAnim('wait', 0.5, [16, 17]);
            this.addAnim('talk', 0.5, [16, 17]);
            this.addAnim('cry', 0.3, [18, 19]);

            this.waitTimer = new ig.Timer();
        },

        kill: function(from) {
        },

        update: function() {
            
            // near an edge? jump!
            if (this.standing && !ig.game.collisionMap.getTile(this.pos.x + (this.flip ? -3 : this.size.x + 3), this.pos.y + this.size.y + 1)) {
                this.dir = (this.dir=='left')?'right':'left';
                console.log('flip');
            }

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

            
            // set the current animation, based on the player's speed
            this.currentAnim = this.anims.walk;
            if (this.talks) {
                this.currentAnim = this.anims.talk;
                this.accel.x = 0;
                this.vel.x = 0;
            } 
            if (this.cries) {
                this.currentAnim = this.anims.cry;
                this.accel.x = 0;
                this.vel.x = 0;
            } 

            if (this.waitTimer.delta() < this.waitDelay) {
                this.currentAnim = this.anims.wait;
                this.accel.x = 0;
                this.vel.x = 0;
            } else {
                if (this.waitTimer.delta()> this.minWaitRepeatTime) {
                    if (Math.random()<0.01) {
                        this.waitTimer.reset();
                    }
                }
            }

            var player = ig.game.getEntitiesByType(EntityPlayer)[0];
            if (player && Math.abs(this.vel.x)<=0.01) {
                this.flip = !(player.pos.x - this.pos.x >= 0);
            }

            this.currentAnim.flip.x = this.flip;

            // move!
            this.parent();
        }
    });

});
