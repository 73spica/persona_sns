var module = angular.module('my-app', ['onsen']);
module.controller('AppController', function($scope) { });
module.controller('PageController', function($scope) {
    // canvas要素を動的に変えるためのスコープ
    $scope.canvas_height = 500;

    //createjsの描画領域の定義
    var stage = new createjs.Stage("freeDraw");
    var free = new createjs.Shape();
    var line_ctn = new createjs.Container(); // 黒いライン用コンテナ
    var msg_ctn = new createjs.Container(); // メッセージ用コンテナ
    stage.addChild(line_ctn) // ラインの方を下にしたい
    stage.addChild(msg_ctn) // メッセージの方を上にしたい
    var c = 0; // 何かに使えるカウンタ

    // 主に座標等の，描画に必要な変数の初期化
    var len_base = [30,35,40,45]
    var t_len = len_base[Math.floor(Math.random()*4)]; // 黒い線の上底．太さが決まる
    var b_len = len_base[Math.floor(Math.random()*4)]; // 黒い線の下底．太さが決まる
    var lt = 0 // left top. 黒線の左上の座標
    var rt = 0
    var lb = [80,30] //今はwを-スタートにしてるので
    var rb = [100,30]
    var h = 80
    var w = -70
    var change_side = 200
    var ff = true;
    var change_f = false; // 実際は一つ前のメッセージの送信者 != 今のメッセージの送信者的なこと
    var my_side = false; // 実際は上のチェンジの結果どっちさいどにいるか
    // コントローラー ( controller ) 内の処理
    $scope.myName = "";
    $scope.clickHandler = function() {
        ons.notification.alert({ message: "Hello " + $scope.myName });
    }


    $scope.drawMsgForm = function() {
        var free = new createjs.Shape();
          var frame = new createjs.Shape();
          frame.graphics.beginFill("White");
          frame.graphics.moveTo(40,300); //(0,0)座標から書き始める
          frame.graphics.lineTo(70,270); //(70,100)まで辺を書く
          frame.graphics.lineTo(78,280);
          frame.graphics.lineTo(82,270);
          frame.graphics.lineTo(82,240);
          frame.graphics.lineTo(310,220);
          frame.graphics.lineTo(300,340);
          frame.graphics.lineTo(82,330);
          frame.graphics.lineTo(82,310);
          frame.graphics.lineTo(70,315);
          frame.graphics.lineTo(66,300);
          stage.addChild(frame);


          free.graphics.beginFill("Black");
          free.graphics.moveTo(50,300); //(0,0)座標から書き始める
          free.graphics.lineTo(70,280); //(70,100)まで辺を書く
          free.graphics.lineTo(78,290);
          free.graphics.lineTo(88,280);
          free.graphics.lineTo(88,250);
          free.graphics.lineTo(300,230);
          free.graphics.lineTo(290,330);
          free.graphics.lineTo(88,320);
          free.graphics.lineTo(88,300);
          free.graphics.lineTo(70,305);
          free.graphics.lineTo(66,290);
          stage.addChild(free);
          stage.update();
    }

    // ==== Draw Line ====
    // ■メッセージが１行のとき
    // 横の動き幅　：40 ~ 60
    // 縦の動き高さ：80
    // 動きをある程度決めてしまう。まず、横の動きは以下の２択とする
    // ・２回で端から端まで行く
    // ・１回で端から端まで行く
    // 縦の動きは以下の１種類とする
    // ・必ず80px
    // さらに上底と下底の長さを決めて線の太さを決める．
    // ・10px~30px
    // ・上底の長さは一つ前の下底の長さに依存する
    $scope.drawLine = function(ff) {
        // 必要なパラメータを生成する
        // 縦の高さ．とりま80固定
        // 横の幅．とりまひとつだけ
        // 線の幅．最初だけ上底も下底も決める．
        // 自分の方に行くときは300を基準にする
        if(c%5==1 || c%5==3){
            change_f = true;
            my_side = !my_side
        }

        if(change_f){
            t_len = b_len;
            b_len = len_base[Math.floor(Math.random()*4)];

            // 座標を決めていく
            lt = lb //これ，グローバルにlb,rb作っとけばうまくできそう．
            rt = rb
            lb = [lt[0]+change_side, lt[1]+h] //今はwを-スタートにしてるので
            rb = [lb[0]+b_len, lb[1]]
            change_side = -change_side
            free.graphics.beginFill("Black");
            free.graphics.moveTo(lt[0],lt[1]); //(0,0)座標から書き始める
            free.graphics.lineTo(lb[0],lb[1]);
            free.graphics.lineTo(rb[0],rb[1]);
            free.graphics.lineTo(rt[0],rt[1]); //(70,100)まで辺を書く
            line_ctn.addChild(free);

            if($scope.canvas_height < rb[1]){
                $scope.canvas_height = rb[1] + 50
                // $scope.$apply()
            }
            console.log($scope.canvas_height);
            var bmp = new createjs.Bitmap("/img/an_chat.png");
            bmp.scaleX = 1.3
            bmp.scaleY = 1.3
            console.log(my_side)
            if(my_side){
                if(200>lb[0]-100){
                    bmp.x = 200;
                } else {
                    bmp.x = lb[0]-100;
                }
            }else{
                bmp.x = lb[0]-25;
            }
            bmp.y = lb[1]-25;
            msg_ctn.addChild(bmp);
            stage.update();
            change_f = false;
            return
        }
        if(ff){
            var bmp = new createjs.Bitmap("/img/an_chat.png");
            bmp.scaleX = 1.3
            bmp.scaleY = 1.3
            bmp.x = lb[0]-25;
            bmp.y = lb[1]-25;
            msg_ctn.addChild(bmp);
            createjs.Ticker.on("tick", function () {
                // Stageの描画を更新します
                stage.update();
              });
            return
        }
        t_len = b_len;
        b_len = len_base[Math.floor(Math.random()*4)];

        // 座標を決めていく
        lt = lb //これ，グローバルにlb,rb作っとけばうまくできそう．
        rt = rb
        lb = [lt[0]+w, lt[1]+h] //今はwを-スタートにしてるので
        rb = [lb[0]+b_len, lb[1]]
        w = -w
        free.graphics.beginFill("Black");
        free.graphics.moveTo(lt[0],lt[1]); //(0,0)座標から書き始める
        free.graphics.lineTo(lb[0],lb[1]);
        free.graphics.lineTo(rb[0],rb[1]);
        free.graphics.lineTo(rt[0],rt[1]); //(70,100)まで辺を書く
        line_ctn.addChild(free);

        if($scope.canvas_height < rb[1]){
            $scope.canvas_height = rb[1] + 50
            // $scope.$apply()
        }
        console.log($scope.canvas_height);
        var bmp = new createjs.Bitmap("/img/an_chat.png");
        bmp.scaleX = 1.3
        bmp.scaleY = 1.3
        if(my_side){
            if(200>lb[0]-100){
                bmp.x = 200;
            } else {
                bmp.x = lb[0]-100;
            }
        }else{
            bmp.x = lb[0]-25;
        }
        bmp.y = lb[1]-25;
        msg_ctn.addChild(bmp);
        stage.update();
    }

    $scope.sendMsg = function() {
        $scope.drawLine(ff);
        ff = false;
        c += 1
        // $scope.drawMsgForm();
    }
    ons.ready(function() {
// 初期化 ( Init ) 用のコードをここに置きます。
    });
});