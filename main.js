// - global -------------------------------------------------------------------
var screenCanvas, info;
var run = true;
var fps = 1000 / 28;
var mouse = new Point();
var ctx;
var fire = false;
var counter = 0;
var score = 0;
var message = '';
var radian = new Array();
var img = new Image();

// - const --------------------------------------------------------------------
var CHARA_COLOR = 'rgba(96,21,147,1)';
var CHARA_SHOT_COLOR = 'rgba(0,189,92,1)';
var CHARA_SHOT_MAX_COUNT = 10;
var ENEMY_COLOR = 'rgba(220,92,29,1)';
var ENEMY_MAX_COUNT = 100;
var ENEMY_SHOT_COLOR = 'rgba(255,0,145,1)';
var ENEMY_SHOT_MAX_COUNT = 100;
var BOSS_COLOR = 'rgba(255,0,0,1)';
var BOSS_BIT_COLOR = 'rgba(224,192,59,1)';
var BOSS_BIT_COUNT = 6;

// - main ---------------------------------------------------------------------
window.onload = function () {
    
    // 汎用変数
    var i, j, k, l;
    var p = new Point();
    var q = new Point();
	  var enemySize = 0;

    // スクリーンの初期化
    screenCanvas = document.getElementById('screen');
    screenCanvas.width = 400;
    screenCanvas.height = 400; //256

    // 自機の初期位置を修正
    mouse.x = screenCanvas.width / 2;
    mouse.y = screenCanvas.height - 20;

    // 2dコンテキスト
    ctx = screenCanvas.getContext('2d');

    // イベントの登録
    screenCanvas.addEventListener('mousemove', mouseMove, true);
    screenCanvas.addEventListener('mousedown', mouseDown, true);
    window.addEventListener('keydown', keyDown, true);

    // その他のエレメント関連
    info = document.getElementById('info');

    for (i = 0; i < 360; i++) {
      radian[i] = i * Math.PI / 180;
    }

    // 自機初期化
    var chara = new Character();
    chara.init(10);

    // 自機ショット初期化
    var charaShot = new Array(CHARA_SHOT_MAX_COUNT);
    for(i = 0; i < CHARA_SHOT_MAX_COUNT; i++){
        charaShot[i] = new CharacterShot();
    }

    // エネミー初期化
    var enemy = new Array(ENEMY_MAX_COUNT);
    for(i = 0; i < ENEMY_MAX_COUNT; i++){
        enemy[i] = new Enemy();
    }

    // エネミーショット初期化
    var enemyShot = new Array(ENEMY_SHOT_MAX_COUNT);
    for(i = 0; i < ENEMY_SHOT_MAX_COUNT; i++){
        enemyShot[i] = new EnemyShot();
    }

    // ボス初期化
    var boss = new Boss();

    // ボスのビットを初期化
    var bit = new Array(BOSS_BIT_COUNT);
    for (i = 0; i < BOSS_BIT_COUNT; i++) {
      bit[i] = new Bit();
    }

    // レンダリング処理を呼び出す
    (function(){
        // カウンタをインクリメント
        counter++;

        // HTMLを更新
        info.innerHTML = mouse.x + ' : ' + mouse.y;

        // screenクリア
        ctx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);

        // 自機 ---------------------------------------------------------------
        // パスの設定を開始
        ctx.beginPath();

        // 自機の位置を設定
        chara.position.x = mouse.x;
        chara.position.y = mouse.y;

        // 自機を描くパスを設定
        ctx.arc(
            chara.position.x,
            chara.position.y,
            chara.size,
            0, Math.PI * 2, false
        );

        // 自機の色を設定する
        ctx.fillStyle = CHARA_COLOR;

        // 自機を描く
        ctx.fill();

        // fireフラグの値により分岐
        if(fire){
            // すべての自機ショットを調査する
            for(i = 0; i < CHARA_SHOT_MAX_COUNT; i++){
                // 自機ショットが既に発射されているかチェック
                if(!charaShot[i].alive){
                    // 自機ショットを新規にセット
                    charaShot[i].set(chara.position, 3, 6);

                    // ループを抜ける
                    break;
                }
            }
            // フラグを降ろしておく
            fire = false;
        }

        // 自機ショット -------------------------------------------------------
        // パスの設定を開始
        ctx.beginPath();

        // すべての自機ショットを調査する
        for(i = 0; i < CHARA_SHOT_MAX_COUNT; i++){
            // 自機ショットが既に発射されているかチェック
            if(charaShot[i].alive){
                // 自機ショットを動かす
                charaShot[i].move();

                // 自機ショットを描くパスを設定
                ctx.arc(
                    charaShot[i].position.x,
                    charaShot[i].position.y,
                    charaShot[i].size,
                    0, Math.PI * 2, false
                );

                // パスをいったん閉じる
                ctx.closePath();
            }
        }

        // 自機ショットの色を設定する
        ctx.fillStyle = CHARA_SHOT_COLOR;

        // 自機ショットを描く
        ctx.fill();

        if(counter < 1400){
			switch(true){
				
				case counter < 600:
					if(counter % 100 === 0){
						
						for(i = 0; i < ENEMY_MAX_COUNT; i++){
							
							if(!enemy[i].alive){
								
								j = (counter % 200) / 100;
								
								
								enemySize = 15;
								p.x = -enemySize + (screenCanvas.width + enemySize * 2) * j
								p.y = screenCanvas.height / 2;
								
								
								enemy[i].set(p, enemySize, j);
								
								
								break;
							}
						}
					}
					break;
				
				case counter < 1300:
					if(counter % 50 === 0){
						if(counter % 200 < 100){
							
							for(i = 0; i < ENEMY_MAX_COUNT; i++){
								
								if(!enemy[i].alive){
									
									enemySize = 15;
									if(counter % 400 < 200){
										j = 2;
										p.x = screenCanvas.width / 3;
										p.y = -enemySize;
									}else{
										j = 3;
										p.x = screenCanvas.width - screenCanvas.width / 3;
										p.y = -enemySize;
									}
									
									
									enemy[i].set(p, enemySize, j);
									
									
									break;
								}
							}
						}
					}
					break;
			}
		}else if(counter === 1400){
			
			p.x = screenCanvas.width / 2;
			p.y = -80;
			boss.set(p, 50, 30);
			
			
			for(i = 0; i < BOSS_BIT_COUNT; i++){
				j = 360 / BOSS_BIT_COUNT;
				bit[i].set(boss, 15, 5, i * j);
			}
		}

        // カウンターの値によってシーン分岐
        switch (true) {
          // カウンターが70より小さい
          case counter < 70:
            message = 'READY...';
            break;

          // カウンターが100より小さい
          case counter < 100:
            message = 'GO!!';
            break;

          // カウンターが100以上
          default:
            message = '';

        // 以下処理が続く

        // エネミー -----------------------------------------------------------
        // パスの設定を開始
        ctx.beginPath();

        // すべてのエネミーを調査する
        for(i = 0; i < ENEMY_MAX_COUNT; i++){
            // エネミーの生存フラグをチェック
            if(enemy[i].alive){
                // エネミーを動かす
                enemy[i].move();

                // エネミーを描くパスを設定
                ctx.arc(
                    enemy[i].position.x,
                    enemy[i].position.y,
                    enemy[i].size,
                    0, Math.PI * 2, false
                );

                // ショットを打つかどうかパラメータの値からチェック
                if(enemy[i].param % 15 === 0){
                    // エネミーショットを調査する
                    for(j = 0; j < ENEMY_SHOT_MAX_COUNT; j++){
                        if(!enemyShot[j].alive){
                            // エネミーショットを新規にセットする
                            p = enemy[i].position.distance(chara.position);
                            p.normalize();
                            enemyShot[j].set(enemy[i].position, p, 5, 5);

                            // 1個出現させたのでループを抜ける
                            break;
                        }
                    }
                }

                // パスをいったん閉じる
                ctx.closePath();
            }
        }

        // エネミーの色を設定する
        ctx.fillStyle = ENEMY_COLOR;

        // エネミーを描く
        ctx.fill();

        // エネミーショット ---------------------------------------------------
        // パスの設定を開始
        ctx.beginPath();

        // すべてのエネミーショットを調査する
        for(i = 0; i < ENEMY_SHOT_MAX_COUNT; i++){
            // エネミーショットが既に発射されているかチェック
            if(enemyShot[i].alive){
                // エネミーショットを動かす
                enemyShot[i].move();

                // エネミーショットを描くパスを設定
                ctx.arc(
                    enemyShot[i].position.x,
                    enemyShot[i].position.y,
                    enemyShot[i].size,
                    0, Math.PI * 2, false
                );

                // パスをいったん閉じる
                ctx.closePath();
            }
        }

        // エネミーショットの色を設定する
        ctx.fillStyle = ENEMY_SHOT_COLOR;

        // エネミーショットを描く
        ctx.fill();

        // ボス -------------------------------------------------------
        // パスの設定を開始
        ctx.beginPath();

        // ボスの出現フラグをチェック
        if (boss.alive) {
          // ボスを動かす
          boss.move();

          // ボスを描くパスを設定
          ctx.arc(
            boss.position.x,
            boss.position.y,
            boss.size,
            0, Math.PI * 2, false
          );

          if(boss.param > 100){
						i = boss.param % 150;
						if(i >= 120){
							if(i % 10 === 0){
								p = boss.position.distance(chara.position);
								p.normalize();
								k = 0;
								for(j = 0; j < ENEMY_SHOT_MAX_COUNT; j++){
									if(!enemyShot[j].alive){
										q.x = p.x;
										q.y = p.y;
										l = (360 + (k - 2) * 20) % 360;
										q.rotate(radian[l]);
										enemyShot[j].set(boss.position, q, 7, 3);
										k++;
										if(k > 4){break;}
									}
								}
							}
						}
					}

          // パスをいったん閉じる
          ctx.closePath();
        }

        // ボスの色を設定する
        ctx.fillStyle = BOSS_COLOR;

        // ボスを描く
        ctx.fill();

        // ビット -------------------------------------------
        // パスの設定を開始
        ctx.beginPath();

        // すべてのビットを調査する
        for (i = 0; i < BOSS_BIT_COUNT; i++) {
          // ビットの出現フラグをチェック
          if (bit[i].alive) {
            // ビットを動かす
            bit[i].move();

            // ビットを描くパスを設定
            ctx.arc(
              bit[i].position.x,
              bit[i].position.y,
              bit[i].size,
              0, Math.PI * 2, false
            );

            // ショットを打つかどうかパラメータの値からチェック
            if (bit[i].param % 25 === 0) {
              // エネミーショットを調査する
              for (j = 0; j < ENEMY_SHOT_MAX_COUNT; j++) {
                if (!enemyShot[j].alive) {
                  // エネミーショットを新規にセットする
                  p = bit[i].position.distance(chara.position);
                  p.normalize();
                  enemyShot[j].set(bit[i].position, p, 4, 1.5);

                  // 1個出現させたのでループを抜ける
                  break;
                }
              }
            }

            // パスをいったん閉じる
            ctx.closePath();
          }
        }

        // ビットの色を設定する
        ctx.fillStyle = BOSS_BIT_COLOR;

        // ビットを描く
        ctx.fill();

        // 衝突判定 -----------------------------------------------------------
        // すべての自機ショットを調査する
        for(i = 0; i < CHARA_SHOT_MAX_COUNT; i++){
            // 自機ショットの生存フラグをチェック
            if(charaShot[i].alive){
                // 自機ショットとエネミーとの衝突判定
                for(j = 0; j < ENEMY_MAX_COUNT; j++){
                    // エネミーの生存フラグをチェック
                    if(enemy[j].alive){
                        // エネミーと自機ショットとの距離を計測
                p = enemy[j].position.distance(charaShot[i].position);
                if (p.length() < enemy[j].size) {
                  // 衝突していたら生存フラグを降ろす
                  enemy[j].alive = false;
                  charaShot[i].alive = false;

                  // スコアを更新するためにインクリメント
                  score++;

                  // 衝突があったのでループを抜ける
                  break;
                    }
                  }
                }
                  // 自機ショットとボスビットとの衝突判定
                  for (j = 0; j < BOSS_BIT_COUNT; j++) {
                    // ビットの生存フラグをチェック
                    if (bit[j].alive) {
                      // ビットと自機ショットとの距離を計測
                      p = bit[j].position.distance(charaShot[i].position);
                      if (p.length() < bit[j].size) {
                        // 衝突していたら耐久値をデクリメントする
                        bit[j].life--;

                        // 自機ショットの生存フラグを降ろす
                        charaShot[i].alive = false;

                        // 耐久値がマイナスになったら生存フラグを降ろす
                        if (bit[j].life < 0) {
                          bit[j].alive = false;
                          score += 3;
                        }

                        // 衝突があったのでループを抜ける
                        break;
                      }
                    }
                  }
                  // ボスの生存フラグをチェック
                  if (boss.alive) {
              // 自機ショットとボスとの衝突判定
              p = boss.position.distance(charaShot[i].position);
              if (p.length() < boss.size) {
                // 衝突していたら耐久値をデクリメントする
                boss.life--;

                // 自機ショットの生存フラグを降ろす
                charaShot[i].alive = false;

                // 耐久値がマイナスになったらクリア
                if (boss.life < 0) {
                  score += 10;
                  run = false;
                  message = 'CLEAR !!';
                }
              }
            }
          }
        }
        // 自機とエネミーショットとの衝突判定
        for (i = 0; i < ENEMY_SHOT_MAX_COUNT; i++) {
          // エネミーショットの生存フラグをチェック
          if (enemyShot[i].alive) {
            // 自機とエネミーショットとの距離を計測
            p = chara.position.distance(enemyShot[i].position);
            if (p.length() < chara.size) {
              // 衝突していたら生存フラグを降ろす
              chara.alive = false;

              // 衝突があったのでパラメータを変更してループを抜ける
              run = false;
              message = 'GAME OVER !!';
              break;
            }
          }
        }
        break;
    }
        // HTMLを更新
        info.innerHTML = 'SCORE: ' + (score * 100) + ' ' + message;

        // フラグにより再帰呼び出し
        if(run){setTimeout(arguments.callee, fps);}
    })();
};


// - event --------------------------------------------------------------------
function mouseMove(event){
    // マウスカーソル座標の更新
    mouse.x = event.clientX - screenCanvas.offsetLeft;
    mouse.y = event.clientY - screenCanvas.offsetTop;
}

function mouseDown(event){
    // フラグを立てる
    fire = true;
}

function keyDown(event){
    // キーコードを取得
    var ck = event.keyCode;

    // Escキーが押されていたらフラグを降ろす
    if(ck === 27){run = false;}
}