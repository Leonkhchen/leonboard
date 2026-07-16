# LeonBoard

個人儀表板(單頁):待辦事項(家庭/工作)、進度追蹤、已部署應用、我的最愛。

- 內容以密碼加密(AES-GCM,PBKDF2 導出金鑰),開頁需輸入密碼
- 資料存於瀏覽器 localStorage;「☁ 備份」會把**加密後**的 `data.json` commit 回本 repo
- `data.json` 為密文,公開亦無法讀取內容
