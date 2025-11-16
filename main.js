// PMTilesの、MapLibre GL JS用のプロトコルをグローバルに追加
let protocol = new pmtiles.Protocol();
// addProtocolで、カスタムURLスキーマを使用するときに呼び出される関数を追加する
// pmtiles://~~ が使用されたときに、protocol.tileが呼び出される
maplibregl.addProtocol('pmtiles', protocol.tile);

const map = new maplibregl.Map({
  container: "map",
  center: [139.507442, 35.603379], // 中心座標
  zoom: 16, // ズームレベル
  style: {
    // スタイル仕様のバージョン番号。8を指定する
    version: 8,
    // データソース
    sources: {
      // 背景地図 OpenStreetMapのラスタタイル
      "background-osm-raster": {
        // ソースの種類。vector、raster、raster-dem、geojson、image、video のいずれか
        type: "raster",
        // タイルソースのURL
        tiles: ["https://tile.openstreetmap.jp/styles/osm-bright-ja/{z}/{x}/{y}.png"],
        // タイルの解像度。単位はピクセル、デフォルトは512
        tileSize: 256,
        // データの帰属
        attribution: "<a href='https://www.openstreetmap.org/copyright' target='_blank'>© OpenStreetMap contributors</a>",
      },

    
      "amx-a-pmtiles": {
        type: "vector",
        // タイルが利用可能な最小ズームレベル
        minzoom: 2,
        // タイルが利用可能な最大ズームレベル
        maxzoom: 16,
        // リソースへのURL
        url: "pmtiles://https://habs.rad.naro.go.jp/spatial_data/amx/a.pmtiles",
        attribution:
          "<a href='https://www.moj.go.jp/MINJI/minji05_00494.html' target='_blank'>登記所備付地図データ（法務省）</a>",
      },
    },


        layers: [
      // 登記所備付地図データ 間引きなし
      {
        id: "amx-a-fude",
        // 塗りつぶされたポリゴン
        type: "fill",
        source: "amx-a-pmtiles",
        // ベクトルタイルソースから使用するレイヤ
        "source-layer": "fude",
        paint: {
          // 塗りつぶし部分の色
          "fill-color": "rgba(254, 217, 192, 1)",
          // 塗りつぶしの輪郭の色
          "fill-outline-color": "rgba(255, 0, 0, 1)",
          // 塗りつぶしの不透明度 1に近づくほど不透明になる
          "fill-opacity": 0.4,
        },
      },
    ],

        layers: [
      // 登記所備付地図データ 代表点レイヤ
      {
        id: 'amx-a-daihyo',
        // ヒートマップ
        type: 'heatmap',
        source: 'amx-a-pmtiles',
        // ベクトルタイルソースから使用するレイヤ
        'source-layer': 'daihyo',
        paint: {
          // ヒートマップの密度に基づいて各ピクセルの色を定義
          'heatmap-color': [
            // 入力値と出力値のペア（"stop"）の間を補間することにより、連続的で滑らかな結果を生成する
            'interpolate',
            // 入力より小さいストップと大きいストップのペアを直線的に補間
            ['linear'],
            // ヒートマップレイヤーの密度推定値を取得
            ['heatmap-density'],
            0,
            'rgba(255, 255, 255, 0)',
            0.5,
            'rgba(255, 255, 0, 0.5)',
            // 1に近づくほど密度が高い
            1,
            'rgba(255, 0, 0, 0.5)',
          ],
          // ヒートマップ1点の半径（ピクセル単位）
          'heatmap-radius': [
            // 入力値と出力値のペア（"stop"）の間を補間することにより、連続的で滑らかな結果を生成する
            'interpolate',
            // 出力が増加する割合を制御する、1に近づくほど出力が増加する
            ['exponential', 10],
            // ズームレベルに応じて半径を調整する
            ['zoom'],
            2,
            5,
            14,
            50,
          ],
        },
      },
    ],

      // 地形データ
      "aws-terrain": {
        type: "raster-dem",
        // タイルが利用可能な最小ズームレベル
        minzoom: 1,
        // タイルが利用可能な最大ズームレベル
        maxzoom: 15,
        // このソースが使用するエンコーディング。terrarium（Terrarium形式のPNGタイル）、mapbox（Mapbox Terrain RGBタイル）、custom のいずれか
        encoding: "terrarium",
        tiles: ["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"],
        attribution:
          // see 'https://github.com/tilezen/joerd/blob/master/docs/attribution.md'
          "\
          ArcticDEM terrain data DEM(s) were created from DigitalGlobe, Inc., imagery and funded under National Science Foundation awards 1043681, 1559691, and 1542736; \
          Australia terrain data © Commonwealth of Australia (Geoscience Australia) 2017;\
          Austria terrain data © offene Daten Österreichs – Digitales Geländemodell (DGM) Österreich;\
          Canada terrain data contains information licensed under the Open Government Licence – Canada;\
          Europe terrain data produced using Copernicus data and information funded by the European Union - EU-DEM layers;\
          Global ETOPO1 terrain data U.S. National Oceanic and Atmospheric Administration\
          Mexico terrain data source: INEGI, Continental relief, 2016;\
          New Zealand terrain data Copyright 2011 Crown copyright (c) Land Information New Zealand and the New Zealand Government (All rights reserved);\
          Norway terrain data © Kartverket;\
          United Kingdom terrain data © Environment Agency copyright and/or database right 2015. All rights reserved;\
          United States 3DEP (formerly NED) and global GMTED2010 and SRTM terrain data courtesy of the U.S. Geological Survey.",
      },
    },
    // 表示するレイヤ
    layers: [
      // 背景地図としてOpenStreetMapのラスタタイルを追加
      {
        // 一意のレイヤID
        id: "background-osm-raster",
        // レイヤの種類。background、fill、line、symbol、raster、circle、fill-extrusion、heatmap、hillshade のいずれか
        type: "raster",
        // データソースの指定
        source: "background-osm-raster",
      },
      // 陰影起伏
      {
        id: "hills",
        type: "hillshade",
        source: "aws-terrain",
      },
    ],
    // 地形
    terrain: {
      // 地形データのソース
      source: "aws-terrain",
      // 標高の誇張度
      exaggeration: 1,
    },
  },
});
