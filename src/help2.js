//myScene.js
var helpLayer2 = cc.Layer.extend({
    ctor: function() {
        this._super();

        var size = cc.director.getWinSize();

        //音楽再生エンジン
        audioEngine = cc.audioEngine;
        //bgm再生
        if (!audioEngine.isMusicPlaying()) {
          audioEngine.playMusic(res.bgm_title, true);
        }

        var TitleBG_png = cc.Sprite.create(res.TitleBG_png);
         TitleBG_png.setPosition(size.width / 2, size.height / 2);
        this.addChild(TitleBG_png);

        var howto2 = cc.Sprite.create(res.howto2_png);
         howto2.setPosition(size.width / 2, size.height / 2 + 50);
        this.addChild(howto2);

        //add code
         //タップイベントリスナーを登録する
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);

        return true;
    },

    onTouchBegan: function(touch, event) {

        return true;
    },
    onTouchMoved: function(touch, event) {},
    onTouchEnded: function(touch, event) {
      //bgmの再生をとめる
        if (audioEngine.isMusicPlaying()) {
          audioEngine.stopMusic();
        }
        cc.director.runScene(new helpScene3());

    },
});

var helpScene2 = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new helpLayer2();
        this.addChild(layer);
    }
});
