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
    var rt = 0 // right top. 黒線の右上の座標
    var lb = [65,60] //light bottom．今はwを-スタートにしてるのでやや右側から．
    var rb = [85,60] // right bottom．
    var h = 80 // 高さの移動値．一回のメッセージでこの分動く
    var w = -40 // 横の移動値．一回のメッセージでこの分動く．自分側に移るときはまた別
    var change_side = 200 // 自分側と相手側に移るときはこれを使う．
    var ff = true; // first flag．最初だけ黒線が出ないので必要．
    var change_f = false; // 実際は一つ前のメッセージの送信者 != 今のメッセージの送信者的なこと
    var my_side = false; // 実際は上のチェンジの結果どっちさいどにいるか

    // コントローラー ( controller ) 内の処理
    $scope.myName = "";
    $scope.clickHandler = function() {
        ons.notification.alert({ message: "Hello " + $scope.myName });
    }


    // メッセージのフォームをcreatejsで生成する
    // これは始点を引数にしてそこから描画できるように書き換えたい．
    // 始点は配列で渡すかx,yで渡すか...
    // 複数渡す必要がないので取り急ぎx,yにする
    $scope.drawLeftMsgForm = function(x,y) {
        var free = new createjs.Shape();
          var frame = new createjs.Shape();
          frame.graphics.beginFill("White");
          frame.graphics.moveTo(x-6,y+5); //(45,302)座標から書き始める
          frame.graphics.lineTo(x+14,y-18); //(73,274)まで辺を書く
          frame.graphics.lineTo(x+18,y-13); // (77,282)
          frame.graphics.lineTo(x+23,y-18); // (83,275)
          frame.graphics.lineTo(x+24,y-32); // (86,255)
          frame.graphics.lineTo(x+212,y-50); // (315,220)
          frame.graphics.lineTo(x+195,y+9); // (295,305)
          frame.graphics.lineTo(x+19,y+12); // (78,330)
          frame.graphics.lineTo(x+20,y+2); // (82,310)
          frame.graphics.lineTo(x+12,y+6); // (70,315)
          frame.graphics.lineTo(x+8,y-1); // (64,295)
          stage.addChild(frame);


          // とりあえず始点からの相対距離にする
          // もしかしたら前の点からにしたほうが都合が良いかも
          free.graphics.beginFill("Black");
          free.graphics.moveTo(x,y); //(50,300)座標から書き始める
          free.graphics.lineTo(x+13,y-14); // (70,280)
          free.graphics.lineTo(x+17,y-9); // (78, 290)
          free.graphics.lineTo(x+25,y-14); // (90,280)
          free.graphics.lineTo(x+27,y-29); // (94,260)
          free.graphics.lineTo(x+200,y-45); // (300,230)
          free.graphics.lineTo(x+190,y+5); // (290,300)
          free.graphics.lineTo(x+22,y+8); // (84,320)
          free.graphics.lineTo(x+23,y-2); // (88,300)
          free.graphics.lineTo(x+14,y+1); // (70,305)
          free.graphics.lineTo(x+10,y-5); // (66,290)
          stage.addChild(free);
          stage.update();
    }

    $scope.drawRightMsgForm = function(x,y) {
        var free = new createjs.Shape();
        var frame = new createjs.Shape();
        frame.graphics.beginFill("Black");// x-6,x+212
        frame.graphics.moveTo(x+6   ,y+5 ); //(45,302)座標から書き始める
        frame.graphics.lineTo(x-14  ,y-18); //(73,274)まで辺を書く
        frame.graphics.lineTo(x-18  ,y-13); // (77,282)
        frame.graphics.lineTo(x-23  ,y-18); // (83,275)
        frame.graphics.lineTo(x-24  ,y-32); // (86,255)
        frame.graphics.lineTo(x-212 ,y-50); // (315,220)
        frame.graphics.lineTo(x-195 ,y+9  ); // (295,305)
        frame.graphics.lineTo(x-19  ,y+12); // (78,330)
        frame.graphics.lineTo(x-20  ,y+2  ); // (82,310)
        frame.graphics.lineTo(x-12  ,y+6  ); // (70,315)
        frame.graphics.lineTo(x-8   ,y-1  ); // (64,295)
        stage.addChild(frame);


        // とりあえず始点からの相対距離にする
        // もしかしたら前の点からにしたほうが都合が良いかも
        free.graphics.beginFill("White");
        free.graphics.moveTo(x,y); //(50,300)座標から書き始める
        free.graphics.lineTo(x-13 ,y-14); // (70,280)
        free.graphics.lineTo(x-17 ,y-9); // (78, 290)
        free.graphics.lineTo(x-25 ,y-13); // (90,280)
        free.graphics.lineTo(x-27 ,y-27); // (94,260)
        free.graphics.lineTo(x-200,y-42); // (300,230)
        free.graphics.lineTo(x-190,y+3); // (290,300)
        free.graphics.lineTo(x-22 ,y+6); // (84,320)
        free.graphics.lineTo(x-23 ,y-3); // (88,300)
        free.graphics.lineTo(x-14 ,y+1); // (70,305)
        free.graphics.lineTo(x-10 ,y-5); // (66,290)
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

    function drawBlackLine(a, b, c, d, free) {
        free.graphics.beginFill("Black");
        free.graphics.moveTo(a[0],a[1]); //(0,0)座標から書き始める
        free.graphics.lineTo(b[0],b[1]);
        free.graphics.lineTo(c[0],c[1]);
        free.graphics.lineTo(d[0],d[1]); //(70,100)まで辺を書く
        line_ctn.addChild(free);
    }

    $scope.drawLine = function(ff) {
        // 必要なパラメータを生成する
        // 縦の高さ．とりま80固定
        // 横の幅．とりまひとつだけ
        // 線の幅．最初だけ上底も下底も決める．
        // 自分の方に行くときは300を基準にする

        // 自分側と相手側を移す判定のテスト用
        // 実際は前の送信者と今の送信者を比較する．
        if(c%5==1 || c%5==3){
            change_f = true;
            my_side = !my_side
        }

        // 前の送信者との比較の結果，サイドが変わるようならこれに入る．
        if(change_f){
            // まずは黒線の太さを更新
            t_len = b_len;
            b_len = len_base[Math.floor(Math.random()*4)];

            // 座標を決めていく
            lt = lb
            rt = rb
            lb = [lt[0]+change_side, lt[1]+h] //今はwを-スタートにしてるので
            rb = [lb[0]+b_len, lb[1]]
            change_side = -change_side // 次サイドが変わるときのために反転

            // 黒線の描画
            drawBlackLine(lt,lb,rb,rt,free)

            if($scope.canvas_height < rb[1]){
                $scope.canvas_height = rb[1] + 50
                // $scope.$apply()
            }

            // メッセージエリアの描画
            var bmp = new createjs.Bitmap("/img/an_chat.png");
            bmp.scaleX = 1.3
            bmp.scaleY = 1.3
            console.log(my_side)
            if(my_side){
                bmp.x = 180
                var formx = 320
                $scope.drawRightMsgForm(formx,lb[1]+10);

            }else{
                bmp.x = lb[0]-25;
                var formx = lb[0]+40;
                $scope.drawLeftMsgForm(formx,lb[1]+10);
                bmp.y = lb[1]-25;
                msg_ctn.addChild(bmp);
            }
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
            $scope.drawLeftMsgForm(lb[0]+40,lb[1]+10);
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

        // 黒線の描画
        drawBlackLine(lt,lb,rb,rt,free)

        if($scope.canvas_height < rb[1]){
            $scope.canvas_height = rb[1] + 50
            // $scope.$apply()
        }
        console.log($scope.canvas_height);
        var bmp = new createjs.Bitmap("/img/an_chat.png");
        bmp.scaleX = 1.3
        bmp.scaleY = 1.3
        if(my_side){
            bmp.x = 180
            var formx = 320
            $scope.drawRightMsgForm(formx,lb[1]+10);
        }else{
            bmp.x = lb[0]-25;
            var formx = lb[0]+40
            $scope.drawLeftMsgForm(formx,lb[1]+10);
            bmp.y = lb[1]-25;
            msg_ctn.addChild(bmp);
        }
        stage.update();

    }

    $scope.sendMsg = function() {
        $scope.drawLine(ff);
        ff = false;
        c += 1
        // $scope.drawLeftMsgForm(50,300);
    }
    ons.ready(function() {
// 初期化 ( Init ) 用のコードをここに置きます。
    });
});