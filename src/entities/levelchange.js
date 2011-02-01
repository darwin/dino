ig.module('game.entities.levelchange').requires('impact.entity').defines(function() {

    EntityLevelchange = ig.Entity.extend({
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(0, 0, 255, 0.7)',

        size: {
            x: 8,
            y: 8
        },
        level: null,

        triggeredBy: function(entity, trigger) {
            if (this.level) {

                var levelName = this.level.replace(/^(Level)?(\w)(\w*)/, function(m, l, a, b) {
                    return a.toUpperCase() + b;
                });

                ig.game.curLevel = 'Level' + levelName;
                ig.game.loadLevel(ig.global[ig.game.curLevel]);
            }
        },

        update: function() {}
    });

});
