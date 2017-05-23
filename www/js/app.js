var module = angular.module('my-app', ['onsen']);
module.controller('AppController', function($scope) { });


module.factory('Icon',function(){
    return {path:'img/an.png'};
});

module.controller('PageController', function($scope, Icon) {
    // canvas要素を動的に変えるためのスコープ
    $scope.canvas_height = 500;
    $scope.canvas_width = screen.width
    
    // 使えるアイコン一覧
    $scope.icons = ["img/an.png","img/ryuji.png","img/yusuke.png","img/makoto.png","img/takemi.png","img/mishima.png"]
    $scope.icon = Icon

    // socket使うよ
    // var sock = io.connect("http://localhost:3000")
    var sock = io.connect("http://27.120.110.171:3000")

    //createjsの描画領域の定義
    var container; // drawLineで毎回初期化して使えば良さそう．
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
    var pre_my_side;
    // コントローラー ( controller ) 内の処理
    $scope.myName = "";

    // ======================================
    //           drawLeftMsgForm
    // ======================================
    $scope.selectIcon = function(icon_path) {
        $scope.icon.path = icon_path;
        menu.setMainPage('chat.html',{closeMenu: true})
    }
    
    // ======================================
    //           drawLeftMsgForm
    // ======================================
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
        container.addChild(frame);


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
        container.addChild(free);
        //stage.update();
    }

    // ======================================
    //           drawRightMsgForm
    // ======================================
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
        container.addChild(frame);


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
        container.addChild(free);
        //stage.update();
    }

    // ======================================
    //           drawIcon
    // ======================================
    $scope.drawIcon = function(x,y,icon,color) {
        var bmp = new createjs.Bitmap(icon);
        var free = new createjs.Shape();
        var frame1 = new createjs.Shape();
        var frame2 = new createjs.Shape();

        bmp.x = x+6
        bmp.y = y-22
        bmp.scaleX = 1.6
        bmp.scaleY = 1.6

        frame1.graphics.beginFill("Black");
        frame1.graphics.moveTo(x-4-12,y-5-1); //(0,0)座標から書き始める
        frame1.graphics.lineTo(x+12-3-3,y+46+3+6);
        frame1.graphics.lineTo(x+75+3+4,y+36+3);
        frame1.graphics.lineTo(x+67+3+1,y+6-3-1);

        frame2.graphics.beginFill("White");
        frame2.graphics.moveTo(x-4,y-5); //(0,0)座標から書き始める
        frame2.graphics.lineTo(x+12-3,y+46+3);
        frame2.graphics.lineTo(x+75+3,y+36+3);
        frame2.graphics.lineTo(x+67+3,y+6-3);

        free.graphics.beginFill(color);
        free.graphics.moveTo(x,y); //(0,0)座標から書き始める
        free.graphics.lineTo(x+12,y+46);
        free.graphics.lineTo(x+75,y+36);
        free.graphics.lineTo(x+67,y+6);
        container.addChild(frame1)
        container.addChild(frame2)
        container.addChild(free);
        container.addChild(bmp);
        // createjs.Ticker.on("tick", function () {
        //     // Stageの描画を更新します
        //     stage.update();
        // });
    }


    // ======================================
    //           drawBlackLine
    // ======================================
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


    // ======================================
    //                drawMsg
    // ======================================
    $scope.drawMsg = function(msg, x, y, rotate, color){
        console.log(msg)
        var t = new createjs.Text(msg, "14px rounded-mplus", color)
        t.x = x
        t.y = y
        t.rotation += rotate
        container.addChild(t)
    }

    // ======================================
    //           drawLine
    // ======================================
    // 必要なパーツをここで描画する．
    // 主に自分側・相手側のみで
    $scope.drawLine = function(ff, my_side,msg,icon) {
        // 必要なパラメータを生成する
        // 縦の高さ．とりま80固定
        // 横の幅．とりまひとつだけ
        // 線の幅．最初だけ上底も下底も決める．
        // 自分の方に行くときは300を基準にする
        
        // とりあえずcontainerを初期化してstageに追加する
        container = new createjs.Container();
        container.rotation = -5;
        stage.addChild(container);
        console.dir(container);

        // 自分側から相手側に，相手側から自分側に黒線が移るときはこの処理に入る．
        if(pre_my_side!=my_side){
            // まずは黒線の太さを更新
            t_len = b_len;
            b_len = len_base[Math.floor(Math.random()*4)];

            // 座標を決めていく
            lt = lb
            rt = rb
            // 相手サイドに行くときのhは大きくとっといたほうが良い．
            if(my_side){
                lb = [lt[0]+change_side, lt[1]+h-10] //今はwを-スタートにしてるので
            } else {
                lb = [lt[0]+change_side, lt[1]+h+15] //今はwを-スタートにしてるので
            }
            rb = [lb[0]+b_len, lb[1]]
            change_side = -change_side // 次サイドが変わるときのために反転

            // 黒線の描画
            drawBlackLine(lt,lb,rb,rt,free)

            if($scope.canvas_height < rb[1]){
                $scope.canvas_height = rb[1] + 50
            }

            // メッセージエリアの描画
            console.log(my_side)
            if(my_side){
                // bmp.x = 180
                var formx = 320
                $scope.drawRightMsgForm(formx,lb[1]+10);
                $scope.drawMsg(msg, formx-180, lb[1]-15, 1, "Black");
                container.x = formx
                container.y = lb[1]+10
                container.regX = formx
                container.regY = lb[1]+10
                container.rotation = -9;
            }else{
                // bmp.x = lb[0]-25;
                var formx = lb[0]+50;
                $scope.drawIcon(lb[0]-10,lb[1]-15, icon,"Pink")
                $scope.drawLeftMsgForm(formx,lb[1]+10);
                $scope.drawMsg(msg, formx+36, lb[1]-13, -4, "White");
                container.x = lb[0]+50
                container.y = lb[1]+10
                container.regX = lb[0]+50
                container.regY = lb[1]+10
            }
            change_f = false;
            pre_my_side = my_side;
        } else {
            t_len = b_len; // *
            b_len = len_base[Math.floor(Math.random()*4)]; // *

            // 座標を決めていく
            lt = lb //これ，グローバルにlb,rb作っとけばうまくできそう．
            rt = rb
            lb = [lt[0]+w, lt[1]+h] //今はwを-スタートにしてるので
            rb = [lb[0]+b_len, lb[1]]
            w = -w // サイドが変わらないときは毎回変えて良い

            // 黒線の描画
            drawBlackLine(lt,lb,rb,rt,free)

            if($scope.canvas_height < rb[1]){
                $scope.canvas_height = rb[1] + 50
            }
            console.log($scope.canvas_height);
            if(my_side){
                // bmp.x = 180
                var formx = 320
                $scope.drawRightMsgForm(formx,lb[1]+10);
                $scope.drawMsg(msg, formx-180, lb[1]-15, 1, "Black")
                container.x = formx
                container.y = lb[1]+10
                container.regX = formx
                container.regY = lb[1]+10
                container.rotation = -9;
            }else{
                // bmp.x = lb[0]-25;
                var formx = lb[0]+50
                $scope.drawIcon(lb[0]-10,lb[1]-15,icon,"Pink")
                $scope.drawLeftMsgForm(formx,lb[1]+10);
                $scope.drawMsg(msg, formx+36, lb[1]-13, -4, "White")
                container.x = lb[0]+50
                container.y = lb[1]+10
                container.regX = lb[0]+50
                container.regY = lb[1]+10
            }


            // メッセージの描画
            pre_my_side = my_side;
        }

        //それぞれはコンテナに描画して，ここでstageに入れるようにできれば，うまいことできそうな希ガス
        //そもそも最初に追加するからいらないかも
    }

    $scope.enterRoom = function() {
        //ここでも初期化
        container = new createjs.Container();
        stage.addChild(container);
        // 今は起動時に入れればいいのでこれだけ
        var room = {
            'room': "persona5",
            'user': "an",
            'icon': $scope.icon.path
        }
        sock.emit('join:room',room)
        $scope.drawIcon(lb[0]-10,lb[1]-15,"img/system.png","Red")
        $scope.drawLeftMsgForm(lb[0]+50,lb[1]+10);
        $scope.drawMsg("Welcome to P5SNS", lb[0]+83, lb[1]-13, -4, "White");
        container.x = lb[0]+50
        container.y = lb[1]+10
        container.regX = lb[0]+50
        container.regY = lb[1]+10
        container.rotation = -5

        createjs.Ticker.on("tick", function () {
            // Stageの描画を更新します
            stage.update();
          });
        pre_my_side = false;
    }

    $scope.sendMsg = function() {
        container = new createjs.Container();
        stage.addChild(container);

        // まずメッセージを送信して，その後drawLineにメッセージを投げる
        // その前に入力があるか確認
        if(!$scope.sended_msg){
            return
        }

        var msg = {
            'room': "persona5",
            'user': "an",
            'text': $scope.sended_msg,
            'icon': $scope.icon.path
        }
        //ほんとはこのあとにメッセージ保存したりする必要あり
        //いまは描画して放置だけど，後々開いたらDBからログ読み込んで再描画みたいな処理も必要そう．
        console.dir(msg);
        sock.emit('send:message',msg);
        $scope.sended_msg = ""

        $scope.drawLine(ff,true,msg.text,msg.icon);
        ff = false;
        c += 1
        // $scope.drawLeftMsgForm(50,300);
    }

    // サーバからのメッセージ待受
    sock.on('message', function(msg){
        // $scope.messages.push(msg); //送信時と同様
        console.log(msg);
        $scope.drawLine(ff,false,msg.text,msg.icon);
        $scope.$apply()
        ff = false;
        // $scope.$apply(); // 新たなメッセージを確認できるように画面の再描画
        // setLS(msg.room+"_messages",$scope.messages,1) //送信時と同様ローカルストレージに保存
        // goBottom("bottom");
        // console.log($scope.messages);
        // $ionicScrollDelegate.scrollBottom();
    });

    ons.ready(function() {
        // 初期化 ( Init ) 用のコードをここに置きます。
        $scope.enterRoom()
    });
});
