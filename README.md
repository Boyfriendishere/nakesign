# NAKE DESIGN — 網站檔案說明

## 資料夾結構

```
nakesign/
├── index.html              ← 首頁
├── about.html              ← 關於我（之後製作）
├── contact.html            ← 聯絡我（之後製作）
├── og-image.jpg            ← 分享預覽圖（之後提供）
├── projects/
│   ├── nd001.html          ← U41
│   ├── nd002.html          ← 菜霸子 VEGEKING
│   └── ...
└── images/
    ├── nd001/
    │   ├── cover.jpg       ← 首頁封面圖（1:1 方形）
    │   ├── 001.jpg         ← 作品頁第1張
    │   ├── 002.jpg
    │   └── ...
    ├── nd002/
    │   ├── cover.jpg
    │   └── ...
    └── ...
```

## 圖片規則

- 封面圖：cover.jpg，1:1 正方形，建議最長邊 1200px，JPG 壓縮品質 80
- 內文圖：001.jpg、002.jpg 遞增，照 WordPress 文章裡的順序命名
- 攝影師作品圖（如果是另一個 section）：p001.jpg、p002.jpg 遞增
- 所有圖片都放在 /images/ND編號/ 資料夾內

## 新增作品流程

1. 在 images/ 建立新資料夾（例如 nd010/）
2. 把圖片放進去，依序命名 cover.jpg、001.jpg、002.jpg...
3. 複製 projects/nd001.html，改名為 nd010.html
4. 修改裡面的標題、文字、圖片路徑、Credits
5. 在 index.html 裡新增一個 .card 區塊

## GA4 設定

把 index.html 和每個 projects/ndXXX.html 裡的
G-XXXXXXXXXX 換成你的真實 GA4 測量 ID
