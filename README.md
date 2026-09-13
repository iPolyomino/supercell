# ちょっとちゃっと

![screenshot](./screenshot.png)

ちょっとだけチャットができるアプリケーションです。https://chat.polyomino.jp/ で
公開しています。

## 投稿とIPの管理

投稿は Firebase Callable Function `postChat` 経由で受け付けます。
`chat/{投稿ID}` に名前・本文・ID・サーバー日時を、`chatPrivate/{投稿ID}` に
接続元IPと記録時刻を一括保存します。ブラウザーからIPや日時は送信しません。
`database.rules.json` は `chat` の読み取りだけを許可し、全パスへのクライアントの
書き込みを禁止します。非公開データは管理者権限（Admin SDK / Firebase Console）で確認します。

- 名前は40文字以内（空文字は名無しさんとして表示）。
- コメントは1〜1000文字で、空白だけの投稿は禁止。
- IDは16桁の英数字。表示用であり、本人確認の根拠にはなりません。
- 同じIPからの投稿は10秒間隔。DBトランザクションで同時リクエストも制限します。
- 保存失敗時にも頻度制限の枠は消費します。10秒後に再試行できます。
- 同じネットワークの利用者は制限を共有します。IPの変更による回避は防げません。

IP取得は第1世代の `cloudfunctions.net` エンドポイントへの直接呼び出しを前提とし、
`X-Forwarded-For` の末尾（入口で追加される接続元）を使用します。
利用者が付けた先頭のIPは信用しません。エミュレーターではソケットの接続元を使用します。
独自プロキシやHosting経由に変更する場合は信頼する経路の見直しが必要です。
本番適用時は既知の接続元と偽装ヘッダー付きのリクエストで、実際の入口の挙動も確認してください。
[Cloud Functions のヘッダー仕様](https://docs.cloud.google.com/functions/docs/reference/headers)

IPと頻度制限データは自動削除しません。運用に合わせて保存期間を定め、管理者側で削除してください。

### 既存データの移行と適用

ルールは既存投稿のIPを隠しません。以下の順で移行してください。

1. DBをバックアップし、一時的に全クライアントの読み書きを禁止して投稿を停止する。
2. 管理者認証を設定し、対象のDB URLを `CHAT_DATABASE_URL` に指定する。
3. `node scripts/migrate-chat-ips.cjs` で対象件数を確認する（変更なし・IP値の出力なし）。
4. `node scripts/migrate-chat-ips.cjs --apply` で旧IPを `chatPrivate/{投稿ID}/legacyClientIp` に移す。
   旧IPはクライアント申告値のため、新しいサーバー取得IPとは区別する。
5. `chat` にIPが残っていないことを確認し、`npx firebase deploy --only functions,hosting,database` で適用する。

旧版クライアントからのDB直接投稿は拒否されます。ページの再読み込みが必要です。
移行スクリプトは再実行可能です。本番DBの移行・デプロイは自動実行しません。

Admin SDK用の認証が利用できない場合は `--firebase-cli` を付けると、
ログイン済みFirebase CLIの認証でREST API経由で実行できます。
`--apply --backup <ファイルパス>` で、変更直前のDB全体を所有者のみ読み書き可能な
ファイルへ保存できます。同名ファイルがある場合は上書きせず停止します。
バックアップにはIPが含まれるため、Git管理外のアクセス制限された場所に保管してください。

### 検証

JavaとNode.jsが必要です。

```sh
npm run build-functions
npm run typecheck-app
npx firebase emulators:exec --only database --project demo-supercell 'node scripts/test-database-rules.cjs'
```

テストはデモDBを初期化し、公開/非公開アクセス、直接書き込み禁止、入力検証、
IPの正規化、公開/非公開データの紐付け、同時投稿の制限を確認します。

## 画像

- http://bg-patterns.com/?p=1770
- http://flode-design.com/?p=1273
