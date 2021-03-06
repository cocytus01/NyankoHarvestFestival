var itemsLayer;
var cat;
var basket;
var xSpeed = 0; //カートの移動速度
var flg = -1;
var detectedX;　 //現在タッチしているX座標
var savedX;　 //前回タッチしていたX座標
var touching = false;　 //タッチ状況管理用flag
var audioEngine;
var i = 1;
var score1 = 0;
var score2 = 0;
var score3 = 0;
var scorelabel1;
var scorelabel2;
var scorelabel3;

var time = 60;
var time_label;

var gameScene = cc.Scene.extend({
  onEnter: function() {
    this._super();
    gameLayer = new game();
    gameLayer.init();
    this.addChild(gameLayer);

    audioEngine = cc.audioEngine;
    if (audioEngine.isMusicPlaying()) {
      audioEngine.playMusic(res.bgm , true);
    }
  }
});

var game = cc.Layer.extend({
  init: function() {
    this._super();
    //グラデーション背景
    //  var backgroundLayer = cc.LayerGradient.create(cc.color(0,0,0,255), cc.color(0x46,0x82,0xB4,255));

    //森の背景
    var background = new cc.Sprite(res.background_png);
    var size = cc.director.getWinSize();
    background.setPosition(cc.p(size.width / 2.0, size.height / 2.0));
    var backgroundLayer = cc.Layer.create();
    backgroundLayer.addChild(background);
    this.addChild(backgroundLayer);

    //アイテムがおちてくるレイヤー
    itemsLayer = cc.Layer.create();
    this.addChild(itemsLayer);

    //ショッピングカートを操作するレイヤー
    topLayer = cc.Layer.create();
    this.addChild(topLayer,0);

    cat = cc.Sprite.create(res.cat_0png);

    counter = cc.Sprite.create(res.counter_png);
    this.addChild(counter);
    counter.setPosition(415,24);

    /*scoreText = cc.LabelTTF.create("0",score ,"Arial","100");
    this.addChild(scoreText);
    scoreText.fillStyle = "black";
    scoreText.setPosition(400,50);*/

    scorelabel1 = new cc.LabelTTF( "0", "PixelMplus12", 25);
    scorelabel1.setPosition(cc.p(462, 18));
    scorelabel1.fillStyle = "black";
    this.addChild(scorelabel1);

    scorelabel2 = new cc.LabelTTF( "0", "PixelMplus12", 25);
    scorelabel2.setPosition(cc.p(432, 18));
    scorelabel2.fillStyle = "black";
    this.addChild(scorelabel2);

    scorelabel3 = new cc.LabelTTF( "0", "PixelMplus12", 25);
    scorelabel3.setPosition(cc.p(402, 18));
    scorelabel3.fillStyle = "black";
    this.addChild(scorelabel3);

    basket = cc.Sprite.create(res.basket_png);
    topLayer.addChild(cat,2);
    topLayer.addChild(itemsLayer,1);
    topLayer.addChild(basket,0);

    cat.addChild(basket,0);
    cat.setPosition(240, 65);
    basket.setPosition(75,80);


    this.schedule(this.addItem, 1);

    //タッチイベントのリスナー追加
    cc.eventManager.addListener(touchListener, this);
    //カートの移動のため　Update関数を1/60秒ごと実行させる　
    this.scheduleUpdate();
  },
  addItem: function() {
    var item = new Item();
    itemsLayer.addChild(item, 1);
  },
  removeItem: function(item) {
    itemsLayer.removeChild(item);
  },
  //カートの移動のため　Update関数を1/60秒ごと実行させる関数
  update: function(dt) {
    if (touching) {
      //現在タッチしているX座標と前回の座標の差分をとる
      var deltaX = savedX - detectedX;
      //差分でカートが右にいくか左にいくかを判断する
      if (deltaX > 0) {
        xSpeed = -2;
        flg = 1;
      }
      if (deltaX < 0) {
        xSpeed = 2;
        flg = -1;
      }
      //saveXに今回のX座標を代入し、onTouchMovedイベントで
      //detectedX変数が更新されても対応できるようにする
      savedX = detectedX;
      if (xSpeed > 0) {
        cat.setFlippedX(true);
        basket.setFlippedX(true);
        basket.setPosition(basket.getPosition().x/2,basket.getPosition().y)

        i+=1;
        if(i==1){cat.initWithFile(res.cat_1png);cat.setFlippedX(true);}
        if(i==2){cat.initWithFile(res.cat_2png);cat.setFlippedX(true);}
        if(i==3){i=0}
      }
      if (xSpeed < 0) {
        cat.setFlippedX(false);
        basket.setFlippedX(false);
        //basket.setPosition(cat.getPosition().x+40,cat.getPosition().y+20);
        basket.setPosition(75,80);

        i+=1;
        if(i==1){cat.initWithFile(res.cat_1png);}
        if(i==2){cat.initWithFile(res.cat_2png);}
        if(i==3){i=0}
      }

      cat.setPosition(cat.getPosition().x + xSpeed, cat.getPosition().y);
      //basket.setPosition(basket.getPosition().x , basket.getPosition().y);
      //basket.setPosition(75 + xSpeed,80);
    }
  }
});

var Item = cc.Sprite.extend({
  ctor: function() {
    this._super();
    //ランダムに虫と果物を生成する
    if (Math.random() < 0.1) {
      this.initWithFile(res.bug_png);
      this.isbug = true;
    } else {
      this.initWithFile(res.apple_png);
      this.isbug = false;
    }
  },
  //アイテムが生成された後、描画されるときに実行
  onEnter: function() {
    this._super();
    //ランダムな位置に
    this.setPosition(Math.random() * 400 + 40, 350);
    //ランダムな座標に移動させる
    var moveAction = cc.MoveTo.create(8, new cc.Point(Math.random() * 400 + 40, -50));
    this.runAction(moveAction);
    this.scheduleUpdate();
  },
  update: function(dt) {
    //当たり判定
    //var basketBoundingBox = cc.pAdd(cat.getPosition(), cc.p(50*flg, 10));
    var basketBoundingBox = cc.pAdd(cat.getPosition(), cc.p(50*flg, 30));
    var fruitBoundingBox = this.getBoundingBox();
    //rectIntersectsRectは２つの矩形が交わっているかチェックする
    var Hit = cc.rectContainsPoint(fruitBoundingBox, basketBoundingBox);
    if (Hit) {
      //削除する*/
      gameLayer.removeItem(this);
      console.log("FRUIT x:"+this.getPosition().x);

      score1++;
      //1桁が9以上になったら10桁を＋1
      if (score1 > 9) {
        score2++;
        if (score2 > 9) {
          score3++;
          score2 = 0;
          scorelabel3.setString(score3);
        }
        score1 = 0;
        scorelabel2.setString(score2)
      }
      scorelabel1.setString(score1);
    }
    //虫の処理　座標をチェックしてカートの接近したら　フルーツより虫に当たりやすくしている
    if (this.getPosition().y < 35 && Math.abs(this.getPosition().x - basket.getPosition().x) < 25 &&
      this.isbug) {
      gameLayer.removeItem(this);
      console.log("bug");
        //score --;
        //scoreText.setString(score);
        /*if(score > 0){
          score = 0;
          scoreText.setString("りんご:"+score);
        }*/

    }
    //地面に落ちたアイテムは消去
    if (this.getPosition().y < -30) {
      gameLayer.removeItem(this)
    }
  }
});

//バーチャルアナログパッド用のタッチリスナーの実装
var touchListener = cc.EventListener.create({
  event: cc.EventListener.TOUCH_ONE_BY_ONE,
  swallowTouches: true,
  onTouchBegan: function(touch, event) {
    touching = true;
    //現在タッチ中のX座標を保持する変数へ代入
    detectedX = touch.getLocation().x;
    //前回タッチしていたX座標として代入
    savedX = detectedX;
    return true;
  },
  onTouchMoved: function(touch, event) {
    //現在タッチ中のX座標を保持する変数へ代入
    detectedX = touch.getLocation().x;
  },
  onTouchEnded: function(touch, event) {
    //タッチflagをOFF
    touching = false;
  }
})
