ig.module( 
    'game.main' 
)
.requires(
    'impact.game',
    'impact.font',
    
    'game.entities.player',
    'game.entities.trigger',
    'game.entities.particle',
    'game.entities.hurt',
    'game.entities.earthquake',
    'game.entities.delay',
    'game.entities.debris',
    'game.entities.kill',
    'game.entities.soptik',
    'game.entities.rodicka',
    'game.entities.meteor',
    'game.entities.clovicek',
    'game.entities.corpse',
    'game.entities.lava',
    'game.entities.teller',
    'game.entities.levelchange',
    'game.entities.samicka',
    'game.levels.intro',
    'game.levels.earth',
    'game.levels.outro'
)
.defines(function(){

    MyGame = ig.Game.extend({
        gravity: 300,

        font: new ig.Font('media/04b03.font.png'),
        font2: new ig.Font('media/font-black.png'),
        bubble: new ig.Image( 'media/bubble.png' ),
        
        bduration: 0,
        curLevel: null,
        
        init: function() {
            this.bubbleTimer = new ig.Timer();
            this.cryTimer = new ig.Timer();
            
            ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
            ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
            ig.input.bind(ig.KEY.X, 'jump');
            ig.input.bind(ig.KEY.SPACE, 'restart');

            var gen = function(from, to) {
                var a = [];
                for (var i = from; i < to; i++) {
                    a.push(i);
                }
                return a;
            }
            var as = new ig.AnimationSheet('media/tiles.png', 8, 8);
            var lavaTopTile = 5 * 16 + 0;
            var lavaBottomTile = 5 * 16 + 8;
            var waterTopTile = 6 * 16 + 0;
            var waterBottomTile = 6 * 16 + 8;
            var fireSmall = 0 * 16 + 14;
            var fireMedium1 = 1 * 16 + 14;
            var fireMedium2 = 2 * 16 + 14;
            this.backgroundAnims = {
                'media/tiles.png': {
                    14: new ig.Animation(as, 0.3, gen(fireSmall, fireSmall + 2)),
                    30: new ig.Animation(as, 0.3, gen(fireMedium1, fireMedium1 + 2)),
                    46: new ig.Animation(as, 0.3, gen(fireMedium2, fireMedium2 + 2)),
                    80: new ig.Animation(as, 0.2, gen(lavaTopTile, lavaTopTile + 8)),
                    88: new ig.Animation(as, 0.2, gen(lavaBottomTile, lavaBottomTile + 8)),
                    96: new ig.Animation(as, 0.2, gen(waterTopTile, waterTopTile + 8)),
                    104: new ig.Animation(as, 0.2, gen(waterBottomTile, waterBottomTile + 8))
                }
            };

            // http://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
            var getParam = function(variable) {
                var query = window.location.search.substring(1);
                var vars = query.split("&");
                for (var i = 0; i < vars.length; i++) {
                    var pair = vars[i].split("=");
                    if (pair[0] == variable) {
                        return pair[1];
                    }
                }
            }
            
            this.bduration = 0;
            this.btext = null;
            this.btext2 = null;

            if (!this.curLevel) {
                var levelName = getParam('l') || "intro";
                levelName = levelName.replace(/^(\w)(\w*)$/, function(m, a, b) {
                    return a.toUpperCase() + b;
                });
                console.log('loading level:', levelName);
                this.curLevel = 'Level' + levelName;
            }
            this.loadLevel(ig.global[this.curLevel]);
        },

        update: function() {
            var player = this.getEntitiesByType(EntityPlayer)[0];
            if (player) {
                this.screen.x = player.pos.x - ig.system.width / 2;
                this.screen.y = player.pos.y - ig.system.height / 2;
            } else {
                if (ig.input.pressed('restart') || ig.input.pressed('jump')) {
                    this.init();
                    return;
                }
            }
            
            if (this.forceCry && this.cryTimer.delta()>2) {
                var samicka = this.getEntityByName('samicka');
                if (samicka) {
                    samicka.cries = true;
                }
            }
            

            this.parent();
        },
        
        drawBubble: function(player, text, text2) {
            if (!player) return;
            if (this.bwho) {
                player = ig.game.getEntityByName(this.bwho);
            }
            
            if (this.bubbleTimer.delta() >= this.bduration) {
                player.talks = false;
                
                if (this.btarget) {
                    for (var t in this.btarget) {
                        var teller2 = this.getEntityByName(this.btarget[t]);
                        if (teller2) {
                            teller2.action();
                            
                            // hack!
                            if (teller2.doCry) {
                                this.forceCry = true;
                                this.cryTimer.reset();
                            }
                        }
                    }
                }
                return;
            }
            
            player.talks = true;
            
            var flipX = false;
            if (player.currentAnim) {
                flipX = player.currentAnim.flip.x;
            }
            var x = player.pos.x;
            if (flipX>0) {
                x -= 9;
            } else {
                x += 18;
            }
            var y = player.pos.y - 32;
            x +=  - ig.game.screen.x - 90;
            y +=  - ig.game.screen.y - 4;

            var eq = ig.game.getEntityByName('eqg');
            if (eq) {
                x += eq.dx;
                y += eq.dy;
            }
            
            var origAlpha = ig.system.context.globalAlpha;
            ig.system.context.globalAlpha = this.bubbleTimer.delta().map(this.bduration - 0.5, this.bduration, 1, 0);
            
            this.bubble.drawTile(x, y, this.btype?1:0, 180, 32, flipX, false);
            
            x += 90;
            y += 4;
            if (text && text2) {
                ig.game.font2.draw(text, x, y, ig.Font.ALIGN.CENTER);
                ig.game.font2.draw(text2, x, y + 8, ig.Font.ALIGN.CENTER);
            } else {
                y += 4;
                ig.game.font2.draw(text, x, y, ig.Font.ALIGN.CENTER);
            }
            
            ig.system.context.globalAlpha = origAlpha;
        },

        draw: function() {
            this.parent();

            var player = this.getEntitiesByType(EntityPlayer)[0];
            
            if (player) {
                this.drawBubble(player, this.btext, this.btext2);
                this.font.draw('Arrow Keys + X for jump', 2, 2);
            } else {
                this.font.draw('Press SPACE and try to save dinos again', 2, 2);
            }
        },
        
        tell: function(text, text2, duration, who, target, type) {
            this.btext = text;
            this.btext2 = text2;
            this.bduration = duration;
            this.bwho = who;
            this.btarget = target;
            this.btype = type;
        
            this.bubbleTimer.reset();
        }
        
    });

    window.runGame(MyGame);
});
