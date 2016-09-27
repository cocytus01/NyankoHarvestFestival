//myScene.js
var MyLayer = cc.Layer.extend({
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

        var Title_png = cc.Sprite.create(res.Title_png);
         Title_png.setPosition(size.width / 2, size.height / 2 + 50);
        this.addChild(Title_png);

        var start_png = cc.Sprite.create(res.start_png);
        start_png.setPosition(size.width / 2, size.height / 2 - 50);
        this.addChild(start_png);

        var help_png = cc.Sprite.create(res.help_png);
        help_png.setPosition(size.width / 2, size.height / 2 - 130);
        this.addChild(help_png);
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
      /*if(touch.getLocation().x < 1 && touch.getLocation().x > 1000 &&
        touch.getLocation().y < 1 && touch.getLocation().y > 1000){
        cc.director.runScene(new gameScene());
      }*/

        return true;
    },
    onTouchMoved: function(touch, event) {},
    onTouchEnded: function(touch, event) {
      //bgmの再生をとめる
        if (audioEngine.isMusicPlaying()) {
          audioEngine.stopMusic();
        }
        //クリック時のSE再生
        //audioEngine.playEffect("res/zabun.mp3");
        //audioEngine.playEffect("res/se_select16.wav");
        // 次のシーンに切り替える
        cc.director.runScene(new gameScene());
    },
});

var MyScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new MyLayer();
        this.addChild(layer);
    }
});
