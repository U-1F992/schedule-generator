# Schedule generator

スケジュール予測を表示するHTML

与える形式は[sample.json](sample.json)を確認のこと。

```sh
npm run build; npm run serve
# http://localhost:8080/?s={ encodeURIComponent(JSON.stringify(JSON.parse(`${json}`))) }
```
