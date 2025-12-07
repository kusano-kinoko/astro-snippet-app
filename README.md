# Astro Snippet App

Astro 開発用のコンテナ環境を Docker Compose で立ち上げられるようにしています。`devcontainer.json` は使用せず、VS Code から **Attach to a Running Container** を利用して開発できます。

## 前提
- Docker / Docker Compose が利用できること
- pnpm はコンテナ内で corepack により利用できます

## 使い方

1. イメージをビルドし、コンテナをバックグラウンドで起動します。
   ```bash
   docker compose up -d --build
   ```

2. VS Code から Remote - Containers 拡張の「Attach to Running Container」を使い、`astro-snippet-app-app-1` コンテナに接続します。

3. コンテナ内シェルで依存関係をインストールします。
   ```bash
   pnpm install
   ```

4. Astro 開発サーバーを起動します（ホストの `localhost:4321` でアクセスできます）。
   ```bash
   pnpm dev --host
   ```

### ポート
Astro のデフォルトポート 4321 をコンテナからホストへフォワードしています。必要に応じて `docker-compose.yml` の `ports` 設定を変更してください。

### コンテナの役割
- イメージには Node.js 20 と Git が含まれています。
- 起動時はアプリを動かさず、`sleep infinity` で常駐します。
- リポジトリ全体を `/workspace` に bind mount しているため、ホスト側の変更が即座にコンテナに反映されます。

### クリーンアップ
開発が終わったら、次のコマンドでコンテナとネットワークを停止・削除できます。
```bash
docker compose down
```
