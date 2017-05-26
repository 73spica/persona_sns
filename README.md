# PERSONA5 SNS(CHAT) APP
_Creating now_
* アトラス制作のゲームソフト「ペルソナ5」が最高に面白かったので勢いで作成
* ペルソナ5内でキャラクター達がやり取りするのに使っているSNSアプリ(チャットアプリ)を模してみました
* cordova使ってる
* 取り急ぎwww配下のみ管理
* createJSとか使ってみたかった
* 自分のテンションを高める用アプリ

# Overview
* プロトタイプ3を経てそれっぽくなったバージョン
* チャット部分をnodejsのsocketioで実装
* 複数のキャラアイコンを選べるようにしてみた
* 画像とか適当に拾ったやつ使ってしまっているので完全に自己満足用です． 
* 実際のチャットじゃなくて，定型でもキャラと会話できるようなアプリを目指した方が端末内で完結できて良かったかもしれない．

![demo](https://github.com/73spica/persona_sns/blob/master/demo/persona_sns_proto04.gif)

# Limitation
* パーツが環境によってずれる可能性がある．メッセージフォームのパーツの描画はcreateJSで行っている．実際はメッセージ長に合わせてメッセージ表示枠を動的に変化させる必要があると考えたため．その描画領域の制御をピクセル指定で行っている上，取り急ぎ工夫なくコードを書いているので，ずれが生じる恐れがある．とはいえピクセル指定以外はできないので，環境によって最適なピクセルを計算するような仕組みが必要．
* ログは保存できない．CordovaはWebストレージ(ローカルストレージ)を使ってデータの保存が可能だが，単純にそういう実装はしてない．またサーバ側は一切ログを保存するような処理は書いていない(そもそもサーバ側はコードを上げていませんが...) 
