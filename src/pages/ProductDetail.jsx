import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getProductById } from '../firebase/products'
import { staticProducts } from '../data/products'
import { ShoppingCart, ArrowLeft, Package, Tag, Star } from 'lucide-react'
import './ProductDetail.css'

// Productos para la sección "Más productos"
const allProducts = [
  {
    id: 'gan-356-m-e',
    nombre: '3x3x3 Gan 356 M E',
    marca: 'GAN',
    precio: 34990,
    imagen: '/gan-356-m-e.jpg',
    category: '3x3',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'super-weilong-v2',
    nombre: '3x3x3 Super WeiLong V2 20-M Ball Core Maglev UV',
    marca: 'MoYu',
    precio: 94990,
    imagen: '/super-weilong-v2.png',
    category: '3x3',
    categoryBadge: 'PRO'
  },
  {
    id: 'gan-356-maglev',
    nombre: '3x3x3 Gan 356 MagLev',
    marca: 'GAN',
    precio: 43990,
    imagen: '/gan-356-maglev.jpg',
    category: '3x3',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'meilong-m-robot',
    nombre: '3x3x3 Meilong M + Robot',
    marca: 'MoYu',
    precio: 20990,
    imagen: '/meilong-m-robot.jpg',
    category: '3x3',
    categoryBadge: 'BARATO'
  },
  {
    id: 'meilong-m-v2-magic',
    nombre: '3x3x3 Meilong M V2 Magic Clothes',
    marca: 'MoYu',
    precio: 13990,
    imagen: '/meilong-m-v2-magic.jpg',
    category: '3x3',
    categoryBadge: 'BARATO'
  },
  {
    id: 'xt3-pioneer-qiyi',
    nombre: '3x3x3 XT3 Pioneer Qiyi',
    marca: 'QiYi',
    precio: 35990,
    imagen: '/xt3-pioneer-qiyi.jpg',
    category: '3x3',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'gan-v100-maglev-uv',
    nombre: '3x3x3 Gan v100 Maglev UV',
    marca: 'GAN',
    precio: 60990,
    imagen: '/gan-v100-maglev-uv.jpg',
    category: '3x3',
    categoryBadge: 'PRO'
  },
  {
    id: 'meilong-m-v2',
    nombre: '3x3x3 Meilong M V2',
    marca: 'MoYu',
    precio: 12990,
    imagen: '/meilong-m-v2.jpg',
    category: '3x3',
    categoryBadge: 'BARATO'
  },
  {
    id: 'xt3-flagship-qiyi',
    nombre: '3x3x3 XT3 Flagship QiyiV1',
    marca: 'QiYi',
    precio: 25990,
    imagen: '/xt3-flagship-qiyi.jpg',
    category: '3x3',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'void-m',
    nombre: '3x3x3 Void M',
    marca: 'QiYi',
    precio: 12990,
    imagen: '/void-m.png',
    category: '3x3',
    categoryBadge: 'BARATO'
  },
  {
    id: 'gan-16-maglev-max-uv',
    nombre: '3x3x3 Gan 16 Maglev Max UV',
    marca: 'GAN',
    precio: 109990,
    imagen: '/gan-16-maglev-max-uv.jpg',
    category: '3x3',
    categoryBadge: 'PRO'
  },
  {
    id: 'super-rs3m-2022',
    nombre: '3x3x3 Super RS3M 2022 Estándar',
    marca: 'MoYu',
    precio: 15990,
    imagen: '/super-rs3m-2022.jpg',
    category: '3x3',
    categoryBadge: 'BARATO'
  },
  {
    id: 'rubiks-phantom',
    nombre: '3x3x3 Rubiks Phantom',
    marca: 'Rubik\'s',
    precio: 19990,
    imagen: '/rubiks-phantom.jpg',
    category: '3x3',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'gan-356-m',
    nombre: '3x3x3 Gan 356 MGan',
    marca: 'GAN',
    precio: 40990,
    imagen: '/gan-356-m.jpg',
    category: '3x3',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'moyu-meilong',
    nombre: '3x3x3 Moyu Meilong',
    marca: 'MoYu',
    precio: 4990,
    imagen: '/moyu-meilong.jpg',
    category: '3x3',
    categoryBadge: 'BARATO'
  },
  {
    id: 'gan-15-maglev-uv',
    nombre: '3x3x3 Gan 15 Maglev UV',
    marca: 'GAN',
    precio: 91990,
    imagen: '/gan-15-maglev-uv.jpg',
    category: '3x3',
    categoryBadge: 'PRO'
  },
  {
    id: 'qiyi-m-pro-v2-pioneer-uv',
    nombre: '3x3x3 QiYi M Pro V2 Pioneer UV Qiyi',
    marca: 'QiYi',
    precio: 19990,
    imagen: '/qiyi-m-pro-v2-pioneer-uv.jpg',
    category: '3x3',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'gear-qiyi',
    nombre: '3x3x3 Gear Qiyi',
    marca: 'QiYi',
    precio: 9990,
    imagen: '/gear-qiyi.png',
    category: '3x3',
    categoryBadge: 'BARATO'
  },
  {
    id: 'meilong-m',
    nombre: '3x3x3 Meilong M',
    marca: 'MoYu',
    precio: 13990,
    imagen: '/meilong-m.jpg',
    category: '3x3',
    categoryBadge: 'BARATO'
  },
  {
    id: 'rs3m-v5-ball-core-robot',
    nombre: '3x3x3 RS3M V5 Ball Core Robot Edition',
    marca: 'MoYu',
    precio: 30990,
    imagen: '/super-rs3m-2022.jpg',
    category: '3x3',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'qiyi-m-pro-v2-flagship',
    nombre: '3x3x3 QiYi M Pro V2 Flagship',
    marca: 'QiYi',
    precio: 14990,
    imagen: '/qiyi-m-pro-v2-flagship.jpg',
    category: '3x3',
    categoryBadge: 'BARATO'
  },
  {
    id: 'gan-356-m-lite',
    nombre: '3x3x3 Gan 356 M Lite',
    marca: 'GAN',
    precio: 35990,
    imagen: '/gan-356-m-lite.jpg',
    category: '3x3',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'warrior-m-qiyi',
    nombre: '3x3x3 Warrior MQiyi',
    marca: 'QiYi',
    precio: 7990,
    imagen: '/warrior-m-qiyi.jpg',
    category: '3x3',
    categoryBadge: 'BARATO'
  },
  {
    id: 'lego-building-blocks-fanxin',
    nombre: '3x3x3 Lego Building BlocksFanxin',
    marca: 'Fanxin',
    precio: 9990,
    imagen: '/lego-building-blocks-fanxin.jpg',
    category: '3x3',
    categoryBadge: 'BARATO'
  },
  {
    id: 'fisher-qiyi',
    nombre: '3x3x3 Fisher Qiyi',
    marca: 'QiYi',
    precio: 8990,
    imagen: '/fisher-qiyi.jpg',
    category: '3x3',
    categoryBadge: 'BARATO'
  },
  {
    id: 'gan-12-m-maglev-uv',
    nombre: '3x3x3 Gan 12 M Maglev UV',
    marca: 'GAN',
    precio: 93990,
    imagen: '/gan-12-m-maglev-uv.jpg',
    category: '3x3',
    categoryBadge: 'PRO'
  },
  {
    id: 'tornado-v4-flagship',
    nombre: '3x3x3 Tornado V4 Flagship',
    marca: 'X-Man',
    precio: 41990,
    imagen: '/tornado-v4-flagship.jpg',
    category: '3x3',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'gan-13-maglev-fx',
    nombre: '3x3x3 Gan 13 Maglev Fx',
    marca: 'GAN',
    precio: 77990,
    imagen: '/gan-13-maglev-fx.jpg',
    category: '3x3',
    categoryBadge: 'PRO'
  },
  {
    id: 'tornado-v4-pioneer-uv',
    nombre: '3x3x3 Tornado V4 Pioneer UV Qiyi',
    marca: 'X-Man',
    precio: 53990,
    imagen: '/tornado-v4-pioneer-uv.jpg',
    category: '3x3',
    categoryBadge: 'PRO'
  },
  {
    id: 'qiyi-3x3x2',
    nombre: '3x3x2 Qiyi',
    marca: 'QiYi',
    precio: 8990,
    imagen: '/qiyi-3x3x2.jpg',
    category: '3x3',
    categoryBadge: 'BARATO'
  },
  {
    id: 'llavero-gan-328',
    nombre: '3x3x3 Llavero gan 328 Negro',
    marca: 'GAN',
    precio: 13990,
    imagen: '/llavero-gan-328.png',
    category: 'accesorios',
    categoryBadge: 'BARATO'
  },
  {
    id: 'gan-swift-block-m',
    nombre: '3x3x3 Gan Swift Block M',
    marca: 'GAN',
    precio: 16990,
    imagen: '/gan-swift-block-m.jpg',
    category: '3x3',
    categoryBadge: 'BARATO'
  },
  {
    id: 'qiyi-3x3x1',
    nombre: '3x3x1 Qiyi',
    marca: 'QiYi',
    precio: 5990,
    imagen: '/qiyi-3x3x1.jpg',
    category: '3x3',
    categoryBadge: 'BARATO'
  },
  {
    id: 'warrior-s',
    nombre: '3x3x3 Warrior S',
    marca: 'QiYi',
    precio: 4590,
    imagen: '/warrior-m-qiyi.jpg',
    category: '3x3',
    categoryBadge: 'BARATO'
  },
  {
    id: 'gan-356-i-carry-2',
    nombre: '3x3x3 Gan 356 i Carry 2',
    marca: 'GAN',
    precio: 46990,
    imagen: '/gan-356-i-carry-2.jpg',
    category: '3x3',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'tornado-v3-flagship',
    nombre: '3x3x3 Tornado V3 Flagship',
    marca: 'X-Man',
    precio: 42990,
    imagen: '/tornado-v3-flagship.jpg',
    category: '3x3',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'llavero-gan-330',
    nombre: '3x3x3 Llavero Gan 330',
    marca: 'GAN',
    precio: 14990,
    imagen: '/llavero-gan-330.jpg',
    category: 'accesorios',
    categoryBadge: 'BARATO'
  },
  {
    id: 'wrm-v9-ball-core-magic-cloth-uv',
    nombre: '3x3x3 WRM V9 Ball Core Magic Cloth UV',
    marca: 'MoYu',
    precio: 49990,
    imagen: '/wrm-v9-ball-core-magic-cloth-uv.jpg',
    category: '3x3',
    categoryBadge: 'PRO'
  },
  {
    id: 'gan-i3',
    nombre: '3x3x3 Gan I3',
    marca: 'GAN',
    precio: 74990,
    imagen: '/gan-i3.jpg',
    category: '3x3',
    categoryBadge: 'PRO'
  },
  {
    id: 'gan-14-maglev-pro-frosted',
    nombre: '3x3x3 Gan 14 Maglev Pro Frosted',
    marca: 'GAN',
    precio: 103990,
    imagen: '/gan-14-maglev-pro-frosted.jpg',
    category: '3x3',
    categoryBadge: 'PRO'
  },
  {
    id: 'llavero-gan-330-aniversario',
    nombre: '3x3x3 Llavero Gan 330 Aniversario',
    marca: 'GAN',
    precio: 15990,
    imagen: '/llavero-gan-330-aniversario.jpg',
    category: 'accesorios',
    categoryBadge: 'BARATO'
  },
  {
    id: 'rs3m-v5-ajuste-dual',
    nombre: '3x3x3 RS3M V5 Ajuste Dual',
    marca: 'MoYu',
    precio: 13990,
    imagen: '/rs3m-v5-ajuste-dual.jpg',
    category: '3x3',
    categoryBadge: 'BARATO'
  },
  {
    id: 'gan-rs-2',
    nombre: '3x3x3 Gan RS 2',
    marca: 'GAN',
    precio: 25990,
    imagen: '/gan-rs-2.png',
    category: '3x3',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'mgc-beta-ball-core-uv',
    nombre: '3x3x3 MGC Beta Ball Core UV',
    marca: 'YJ',
    precio: 25990,
    imagen: '/mgc-beta-ball-core-uv.png',
    category: '3x3',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'sail-w',
    nombre: '3x3x3 Sail W',
    marca: 'QiYi',
    precio: 3990,
    imagen: '/sail-w.jpg',
    category: '3x3',
    categoryBadge: 'BARATO'
  },
  {
    id: 'mirror-gan-uv',
    nombre: 'Mirror Gan Versión UV',
    marca: 'GAN',
    precio: 35990,
    imagen: '/mirror-gan-uv.jpg',
    category: '3x3',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'mirror-gan-uv-rojo',
    nombre: 'Mirror Gan UV Rojo',
    marca: 'GAN',
    precio: 35990,
    imagen: '/mirror-gan-uv-rojo.jpg',
    category: '3x3',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'mirror-magnetic-tiled-azul',
    nombre: 'Mirror Magnético Tiled Azul',
    marca: 'Qiyi',
    precio: 12990,
    imagen: '/mirror-magnetic-tiled-azul.jpg',
    category: '3x3',
    categoryBadge: 'BÁSICO'
  },
  {
    id: 'mirror-qiyi-azul',
    nombre: 'Mirror Qiyi Azul',
    marca: 'Qiyi',
    precio: 9990,
    imagen: '/mirror-qiyi-azul.jpg',
    category: '3x3',
    categoryBadge: 'BÁSICO'
  },
  {
    id: 'mirror-icy-amber',
    nombre: 'Mirror Icy Amber',
    marca: 'Qiyi',
    precio: 9990,
    imagen: '/mirror-icy-amber.jpg',
    category: '3x3',
    categoryBadge: 'BÁSICO'
  },
  {
    id: 'mirror-qiyi',
    nombre: 'Mirror Qiyi',
    marca: 'Qiyi',
    precio: 7990,
    imagen: '/mirror-qiyi.jpg',
    category: '3x3',
    categoryBadge: 'BÁSICO'
  },
  {
    id: 'gear-shift-2x2',
    nombre: 'Gear Shift 2x2',
    marca: 'QiYi',
    precio: 7990,
    imagen: '/gear-shift-2x2.jpg',
    category: '2x2',
    categoryBadge: 'BÁSICO'
  },
  {
    id: 'mgc-2x2-yj',
    nombre: '2x2x2 MGC YJ',
    marca: 'YJ',
    precio: 13990,
    imagen: '/mgc-2x2-yj.jpg',
    category: '2x2',
    categoryBadge: 'BÁSICO'
  },
  {
    id: 'qiyi-m-pro-2x2-ball-core',
    nombre: '2x2x2 Qiyi M Pro Ball Core',
    marca: 'QiYi',
    precio: 12990,
    imagen: '/qiyi-m-pro-2x2-ball-core.jpg',
    category: '2x2',
    categoryBadge: 'BÁSICO'
  },
  {
    id: 'qiyi-2x2',
    nombre: '2x2x2 Qiyi M Pro',
    marca: 'QiYi',
    precio: 9990,
    imagen: '/qiyi-m-pro-2x2.jpg',
    category: '2x2',
    categoryBadge: 'BÁSICO'
  },
  {
    id: 'warrior-m-2x2-qiyi',
    nombre: '2x2x2 Warrior M Qiyi',
    marca: 'QiYi',
    precio: 6990,
    imagen: '/warrior-m-2x2-qiyi.jpg',
    category: '2x2',
    categoryBadge: 'BÁSICO'
  },
  {
    id: 'pyramorphix-2x2-qiyi',
    nombre: '2x2x2 Pyraminx Qiyi',
    marca: 'QiYi',
    precio: 7990,
    imagen: '/pyramorphix-2x2-qiyi.jpg',
    category: 'pyraminx',
    categoryBadge: 'BÁSICO'
  },
  {
    id: 'meilong-m-2x2-robot',
    nombre: '2x2x2 Meilong M + Robot',
    marca: 'MoYu',
    precio: 13990,
    imagen: '/meilong-m-2x2-robot.jpg',
    category: '2x2',
    categoryBadge: 'BÁSICO'
  },
  {
    id: 'warrior-m-2x2-uv-qiyi',
    nombre: '2x2x2 Warrior M UV Qiyi',
    marca: 'QiYi',
    precio: 8990,
    imagen: '/warrior-m-2x2-uv-qiyi.jpg',
    category: '2x2',
    categoryBadge: 'BÁSICO'
  },
  {
    id: 'meilong-2x2',
    nombre: '2x2x2 Meilong',
    marca: 'MoYu',
    precio: 3490,
    imagen: '/meilong-2x2.jpg',
    category: '2x2',
    categoryBadge: 'BÁSICO'
  },
  {
    id: 'mirror-2x2-qiyi',
    nombre: '2x2x2 Mirror Qiyi',
    marca: 'QiYi',
    precio: 8490,
    imagen: '/mirror-2x2-qiyi.jpg',
    category: '2x2',
    categoryBadge: 'BÁSICO'
  },
  {
    id: 'qidi-s-2x2-stickerless',
    nombre: '2x2x2 Qidi S Stickerless',
    marca: 'QiYi',
    precio: 2990,
    imagen: '/qidi-s-2x2-stickerless.jpg',
    category: '2x2',
    categoryBadge: 'BÁSICO'
  },
  {
    id: 'gan-251-m-air',
    nombre: '2x2x2 Gan 251 M Air',
    marca: 'GAN',
    precio: 29990,
    imagen: '/gan-251-m-air.jpg',
    category: '2x2',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'gan-251-m-pro',
    nombre: '2x2x2 Gan 251 M Pro',
    marca: 'GAN',
    precio: 34990,
    imagen: '/gan-251-m-pro.jpg',
    category: '2x2',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'meilong-2x2x3-negro',
    nombre: '2x2x3 Moyu Meilong Negro',
    marca: 'MoYu',
    precio: 4990,
    imagen: '/meilong-2x2x3-negro.jpg',
    category: '2x2',
    categoryBadge: 'BÁSICO'
  },
  {
    id: 'meilong-2x2-robot',
    nombre: '2x2x2 Meilong + Robot',
    marca: 'MoYu',
    precio: 7990,
    imagen: '/meilong-2x2-robot.jpg',
    category: '2x2',
    categoryBadge: 'BÁSICO'
  },
  {
    id: 'kilominx-2x2-qiyi',
    nombre: '2x2x2 Kilominx Qiyi',
    marca: 'QiYi',
    precio: 8990,
    imagen: '/kilominx-2x2-qiyi.png',
    category: '2x2',
    categoryBadge: 'BÁSICO'
  },
  {
    id: '2x2-ms-qiyi-magnetico',
    nombre: '2x2x2 MS Qiyi Magnético',
    marca: 'QiYi',
    precio: 8990,
    imagen: '/2x2-ms-qiyi-magnetico.jpg',
    category: '2x2',
    categoryBadge: 'BÁSICO'
  },
  {
    id: 'qidi-2x2',
    nombre: '2x2x2 QiDi',
    marca: 'QiYi',
    precio: 2990,
    imagen: '/qidi-2x2.jpg',
    category: '2x2',
    categoryBadge: 'BÁSICO'
  },
  {
    id: 'gan-251-v2',
    nombre: '2x2x2 Gan 251 V2',
    marca: 'GAN',
    precio: 19990,
    imagen: '/gan-251-v2.jpg',
    category: '2x2',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'gear-shift-qiyi-2x2',
    nombre: '2x2x2 Gear Shift Qiyi',
    marca: 'QiYi',
    precio: 7990,
    imagen: '/gear-shift-qiyi-2x2.jpg',
    category: '2x2',
    categoryBadge: 'BÁSICO'
  },
  {
    id: '2x2x1-z-cube',
    nombre: '2x2x1 Z-cube',
    marca: 'Z-Cube',
    precio: 2990,
    imagen: '/2x2x1-z-cube.jpg',
    category: '2x2',
    categoryBadge: 'BÁSICO'
  },
  {
    id: 'set-5-cubos-negros',
    nombre: 'Set 5 Cubos Negros',
    marca: 'Varios',
    precio: 30990,
    imagen: '/set-5-cubos-negros.jpg',
    category: 'pack',
    categoryBadge: 'BÁSICO'
  },
  {
    id: 'set-4-cubos-qiyi-regulares',
    nombre: 'Set 4 Cubos Qiyi Regulares',
    marca: 'QiYi',
    precio: 17990,
    imagen: '/set-4-cubos-qiyi-regulares.jpg',
    category: 'pack',
    categoryBadge: 'BÁSICO'
  },
  {
    id: 'set-2-cubos-meilong',
    nombre: 'Set 2 Cubos Meilong',
    marca: 'MoYu',
    precio: 6490,
    imagen: '/set-2-cubos-meilong.jpg',
    category: 'pack',
    categoryBadge: 'BÁSICO'
  },
  {
    id: 'pyraminx-meilong',
    nombre: 'Pyraminx Meilong',
    marca: 'Moyu',
    precio: 10990,
    imagen: '/pyraminx-meilong.jpg',
    category: 'pyraminx',
    categoryBadge: 'BÁSICO'
  },
  {
    id: 'aosu-triple-track-magnetic',
    nombre: '4x4x4 AoSu Triple Track Magnetic',
    marca: 'Moyu',
    precio: 64990,
    imagen: '/aosu-triple-track-magnetic.jpg',
    category: '4x4',
    categoryBadge: 'PRO'
  },
  {
    id: 'aosu-wr-m',
    nombre: '4x4x4 Aosu WR M',
    marca: 'Moyu',
    precio: 54990,
    imagen: '/aosu-wr-m.jpg',
    category: '4x4',
    categoryBadge: 'PRO'
  },
  {
    id: 'meilong-m-robot-4x4',
    nombre: '4x4x4 Meilong M + Robot',
    marca: 'Moyu',
    precio: 19990,
    imagen: '/meilong-m-robot-4x4.jpg',
    category: '4x4',
    categoryBadge: 'BARATO'
  },
  {
    id: 'mastermorphix-megamorphix',
    nombre: '4x4x4 Mastermorphix Megamorphix',
    marca: 'Qiyi',
    precio: 21990,
    imagen: '/mastermorphix-megamorphix.jpg',
    category: '4x4',
    categoryBadge: 'BARATO'
  },
  {
    id: 'mirror-sengso-plata',
    nombre: '4x4x4 Mirror Sengso Plata',
    marca: 'Sengso',
    precio: 23990,
    imagen: '/mirror-sengso-plata.jpg',
    category: '4x4',
    categoryBadge: 'BARATO'
  },
  {
    id: 'qiyi-m-pro-4x4',
    nombre: '4x4x4 Qiyi M Pro',
    marca: 'Qiyi',
    precio: 19990,
    imagen: '/qiyi-m-pro-4x4.jpg',
    category: '4x4',
    categoryBadge: 'BARATO'
  },
  {
    id: 'aosu-double-track-v7',
    nombre: '4x4x4 Moyu AoSu double track V7',
    marca: 'Moyu',
    precio: 53990,
    imagen: '/aosu-double-track-v7.jpg',
    category: '4x4',
    categoryBadge: 'PRO'
  },
  {
    id: 'gan-460-v2-sp-frosted',
    nombre: '4x4x4 Gan 460 V2 SP Frosted',
    marca: 'Gan',
    precio: 64990,
    imagen: '/gan-460-v2-sp-frosted.jpg',
    category: '4x4',
    categoryBadge: 'PRO'
  },
  {
    id: 'aosu-single-track-v7',
    nombre: '4x4x4 Moyu AoSu single track V7',
    marca: 'Moyu',
    precio: 23990,
    imagen: '/aosu-single-track-v7.jpg',
    category: '4x4',
    categoryBadge: 'BARATO'
  },
  {
    id: 'warrior-m-4x4',
    nombre: '4x4x4 Warrior M',
    marca: 'Qiyi',
    precio: 14990,
    imagen: '/warrior-m-4x4.jpg',
    category: '4x4',
    categoryBadge: 'BARATO'
  },
  {
    id: 'moyu-meilong-4x4',
    nombre: '4x4x4 Moyu Meilong',
    marca: 'Moyu',
    precio: 9990,
    imagen: '/moyu-meilong-4x4.jpg',
    category: '4x4',
    categoryBadge: 'BARATO'
  },
  {
    id: 'warrior-m-uv-4x4',
    nombre: '4x4x4 Warrior M UV',
    marca: 'Qiyi',
    precio: 17990,
    imagen: '/warrior-m-uv-4x4.jpg',
    category: '4x4',
    categoryBadge: 'BARATO'
  },
  {
    id: 'meilong-m-4x4',
    nombre: '4x4x4 Meilong M',
    marca: 'Moyu',
    precio: 19990,
    imagen: '/meilong-m-4x4.jpg',
    category: '4x4',
    categoryBadge: 'BARATO'
  },
  {
    id: 'meilong-robot-4x4',
    nombre: '4x4x4 Meilong + Robot',
    marca: 'Moyu',
    precio: 14990,
    imagen: '/meilong-robot-4x4.jpg',
    category: '4x4',
    categoryBadge: 'BARATO'
  },
  {
    id: 'master-kilominx',
    nombre: '4x4x4 Master Kilominx',
    marca: 'ShengShou',
    precio: 32990,
    imagen: '/master-kilominx-4x4.jpg',
    category: '4x4',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'ms-qiyi-magnetico-4x4',
    nombre: '4x4x4 MS Qiyi Magnético',
    marca: 'Qiyi',
    precio: 19990,
    imagen: '/ms-qiyi-magnetico-4x4.png',
    category: '4x4',
    categoryBadge: 'BARATO'
  },
  {
    id: 'qiyuan-4x4',
    nombre: '4x4x4 Qiyuan',
    marca: 'Qiyi',
    precio: 7990,
    imagen: '/qiyuan-4x4.jpg',
    category: '4x4',
    categoryBadge: 'BARATO'
  },
  {
    id: 'master-pyraminx-qiyi-4x4',
    nombre: '4x4x4 Master Pyraminx Qiyi',
    marca: 'Qiyi',
    precio: 22990,
    imagen: '/master-pyraminx-qiyi-4x4.jpg',
    category: '4x4',
    categoryBadge: 'BARATO'
  },
  {
    id: 'x-man-design-hong-5x5',
    nombre: '5x5x5 X-Man Design Hong',
    marca: 'Qiyi',
    precio: 54990,
    imagen: '/x-man-design-hong-5x5.jpg',
    category: '5x5',
    categoryBadge: 'PRO'
  },
  {
    id: 'aochuang-v6-triple-track-uv-5x5',
    nombre: '5x5x5 Aochuang V6 Triple Track UV',
    marca: 'Moyu',
    precio: 70990,
    imagen: '/aochuang-v6-triple-track-uv-5x5.jpg',
    category: '5x5',
    categoryBadge: 'PRO'
  },
  {
    id: 'ms-qiyi-magnetico-5x5',
    nombre: '5x5x5 MS Qiyi Magnético',
    marca: 'Qiyi',
    precio: 23990,
    imagen: '/ms-qiyi-magnetico-5x5.jpg',
    category: '5x5',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'mastermorphix-sengso-5x5',
    nombre: '5x5x5 Mastermorphix SengSo',
    marca: 'ShengShou',
    precio: 24990,
    imagen: '/mastermorphix-sengso-5x5.jpg',
    category: '5x5',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'mirror-plata-magnetico-ds-5x5',
    nombre: '5x5x5 Mirror Plata Magnético DS',
    marca: 'Dian Sheng',
    precio: 52990,
    imagen: '/meilong-robot-5x5.jpg',
    category: '5x5',
    categoryBadge: 'PRO'
  },
  {
    id: 'mgc-magnetico-5x5',
    nombre: '5x5x5 MGC Magnético',
    marca: 'YJ',
    precio: 32990,
    imagen: '/mgc-magnetico-5x5.jpg',
    category: '5x5',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'meilong-m-robot-5x5',
    nombre: '5x5x5 Meilong M + Robot',
    marca: 'Moyu',
    precio: 23990,
    imagen: '/meilong-m-robot-5x5.jpg',
    category: '5x5',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'moyu-meilong-5x5',
    nombre: '5x5x5 Moyu Meilong',
    marca: 'Moyu',
    precio: 9990,
    imagen: '/moyu-meilong-5x5.jpg',
    category: '5x5',
    categoryBadge: 'BARATO'
  },
  {
    id: 'qizheng-qiyi-5x5',
    nombre: '5x5x5 Qizheng Qiyi',
    marca: 'Qiyi',
    precio: 12990,
    imagen: '/qizheng-qiyi-5x5.jpg',
    category: '5x5',
    categoryBadge: 'BARATO'
  },
  {
    id: 'meilong-robot-5x5',
    nombre: '5x5x5 Meilong + Robot',
    marca: 'Moyu',
    precio: 14990,
    imagen: '/meilong-robot-5x5.png',
    category: '5x5',
    categoryBadge: 'BARATO'
  },
  {
    id: 'aoshi-wr-m-6x6',
    nombre: '6x6x6 Moyu Aoshi WR M',
    marca: 'Moyu',
    precio: 49990,
    imagen: '/aoshi-wr-m-6x6.jpg',
    category: '6x6',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'elite-kilominx-6x6',
    nombre: '6x6x6 Elite Kilominx Yuxin',
    marca: 'Yuxin',
    precio: 50990,
    imagen: '/elite-kilominx-6x6-yuxin.jpeg',
    category: '6x6',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'aoshi-v4-dual-6x6',
    nombre: '6x6x6 Aoshi V4 Dual Track',
    marca: 'Moyu',
    precio: 70990,
    imagen: '/warrior-m-uv-6x6.jpg',
    category: '6x6',
    categoryBadge: 'PRO'
  },
  {
    id: 'aoshi-v4-triple-6x6',
    nombre: '6x6x6 Aoshi V4 Triple Track',
    marca: 'Moyu',
    precio: 80990,
    imagen: '/aoshi-v4-triple-6x6.jpg',
    category: '6x6',
    categoryBadge: 'PRO'
  },
  {
    id: 'aoshi-v4-single-6x6',
    nombre: '6x6x6 Aoshi V4 Single Track',
    marca: 'Moyu',
    precio: 54990,
    imagen: '/aoshi-v4-single-6x6.jpg',
    category: '6x6',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'mastermorphix-6x6',
    nombre: '6x6x6 Mastermorphix SengSo',
    marca: 'ShengShou',
    precio: 35990,
    imagen: '/mastermorphix-6x6.jpg',
    category: '6x6',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'warrior-m-uv-6x6',
    nombre: '6x6x6 Warrior M UV',
    marca: 'Qiyi',
    precio: 23990,
    imagen: '/warrior-m-uv-6x6.jpg',
    category: '6x6',
    categoryBadge: 'BARATO'
  },
  {
    id: 'meilong-m-6x6',
    nombre: '6x6x6 Moyu Meilong M',
    marca: 'Moyu',
    precio: 24990,
    imagen: '/meilong-m-6x6.png',
    category: '6x6',
    categoryBadge: 'BARATO'
  },
  {
    id: 'mgc-6x6',
    nombre: '6x6x6 MGC M',
    marca: 'MGC',
    precio: 34990,
    imagen: '/mgc-6x6.jpg',
    category: '6x6',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'qifan-qiyi-6x6',
    nombre: '6x6x6 Qifan Qiyi',
    marca: 'Qiyi',
    precio: 22990,
    imagen: '/qifan-qiyi-6x6.jpg',
    category: '6x6',
    categoryBadge: 'BARATO'
  },
  {
    id: 'qixing-s-7x7',
    nombre: '7x7x7 Qiyi Qixing S',
    marca: 'Qiyi',
    precio: 21990,
    imagen: '/qixing-s-7x7.jpg',
    category: '7x7',
    categoryBadge: 'BARATO'
  },
  {
    id: 'mastermorphix-7x7',
    nombre: '7x7x7 Mastermorphix ShengShou',
    marca: 'ShengShou',
    precio: 39990,
    imagen: '/mastermorphix-7x7.jpg',
    category: '7x7',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'aofu-v5-single-7x7',
    nombre: '7x7x7 Aofu v5 Single Track',
    marca: 'Moyu',
    precio: 53990,
    imagen: '/aofu-v5-single-7x7.jpg',
    category: '7x7',
    categoryBadge: 'PRO'
  },
  {
    id: 'aofu-v5-dual-7x7',
    nombre: '7x7x7 Aofu v5 DualTrack',
    marca: 'Moyu',
    precio: 65990,
    imagen: '/aofu-v5-dual-7x7.jpg',
    category: '7x7',
    categoryBadge: 'PRO'
  },
  {
    id: 'aofu-v5-triple-7x7',
    nombre: '7x7x7 Aofu v5 TripleTrack',
    marca: 'Moyu',
    precio: 82990,
    imagen: '/aofu-v5-triple-7x7.jpg',
    category: '7x7',
    categoryBadge: 'PRO'
  },
  {
    id: 'warrior-m-uv-7x7',
    nombre: '7x7x7 Warrior M UV',
    marca: 'Qiyi',
    precio: 24990,
    imagen: '/warrior-m-uv-7x7.jpg',
    category: '7x7',
    categoryBadge: 'BARATO'
  },
  {
    id: 'mgc-7x7',
    nombre: '7x7x7 MGC YJ',
    marca: 'YJ',
    precio: 46990,
    imagen: '/mgc-7x7.jpg',
    category: '7x7',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'teraminx-7x7',
    nombre: 'Teraminx ShengShou',
    marca: 'ShengShou',
    precio: 53990,
    imagen: '/teraminx-7x7.jpg',
    category: '7x7',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'meilong-v3-8x8',
    nombre: '8x8x8 Moyu Meilong V3 M Ball Core',
    marca: 'Moyu',
    precio: 73990,
    imagen: '/meilong-v3-8x8.jpg',
    category: '8x8',
    categoryBadge: 'PRO'
  },
  {
    id: 'mastermorphix-8x8',
    nombre: '8x8x8 Mastermorphix ShengShou',
    marca: 'ShengShou',
    precio: 44990,
    imagen: '/mastermorphix-8x8.jpg',
    category: '8x8',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'qiyi-8x8',
    nombre: '8x8x8 Qiyi',
    marca: 'Qiyi',
    precio: 43990,
    imagen: '/qiyi-8x8.jpg',
    category: '8x8',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'meilong-v3-9x9',
    nombre: '9x9x9 Moyu Meilong v3',
    marca: 'Moyu',
    precio: 44990,
    imagen: '/meilong-v3-9x9.jpg',
    category: '9x9',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'qiyi-9x9',
    nombre: '9x9x9 Qiyi',
    marca: 'Qiyi',
    precio: 43990,
    imagen: '/qiyi-9x9.jpg',
    category: '9x9',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'meilong-12x12',
    nombre: '12x12x12 Moyu Meilong',
    marca: 'Moyu',
    precio: 129990,
    imagen: '/meilong-12x12.jpg',
    category: '12x12',
    categoryBadge: 'PRO'
  },
  {
    id: 'meilong-13x13',
    nombre: '13x13x13 Moyu Meilong',
    marca: 'Moyu',
    precio: 189990,
    imagen: '/meilong-13x13.jpg',
    category: '13x13',
    categoryBadge: 'PRO'
  },
  {
    id: 'pyraminx-gan-enhanced',
    nombre: 'Pyraminx Gan Enhanced',
    marca: 'Gan',
    precio: 43990,
    imagen: '/pyraminx-gan-enhanced.jpg',
    category: 'pyraminx',
    categoryBadge: 'PRO'
  },
  {
    id: 'pyraminx-gan-estandar',
    nombre: 'Pyraminx Gan Estándar',
    marca: 'Gan',
    precio: 28990,
    imagen: '/pyraminx-gan-estandar.png',
    category: 'pyraminx',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'pyraminx-duo-lite',
    nombre: 'Qiyi Pyraminx Dúo Lite',
    marca: 'Qiyi',
    precio: 9990,
    imagen: '/pyraminx-duo-lite.jpg',
    category: 'pyraminx',
    categoryBadge: 'BÁSICO'
  },
  {
    id: 'pyraminx-weilong-maglev',
    nombre: 'Pyraminx Weilong Moyu Maglev',
    marca: 'Moyu',
    precio: 23990,
    imagen: '/pyraminx-weilong-maglev.jpg',
    category: 'pyraminx',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'pyraminx-meilong-m',
    nombre: 'Pyraminx Meilong M',
    marca: 'Moyu',
    precio: 10990,
    imagen: '/pyraminx-meilong-m.png',
    category: 'pyraminx',
    categoryBadge: 'BÁSICO'
  },
  {
    id: 'pyraminx-coin',
    nombre: 'Coin Tetahedron Pyraminx',
    marca: 'Qiyi',
    precio: 10990,
    imagen: '/pyraminx-coin.jpg',
    category: 'pyraminx',
    categoryBadge: 'BÁSICO'
  },
  {
    id: 'pyraminx-qiming-plus',
    nombre: 'Pyraminx Qiming Plus 27,5',
    marca: 'Qiyi',
    precio: 36990,
    imagen: '/pyraminx-qiming-plus.jpg',
    category: 'pyraminx',
    categoryBadge: 'PRO'
  },
  {
    id: 'pyraminx-mirror',
    nombre: 'Mirror Pyraminx',
    marca: 'ShengShou',
    precio: 9990,
    imagen: '/pyraminx-mirror.jpg',
    category: 'pyraminx',
    categoryBadge: 'BÁSICO'
  },
  {
    id: 'pyraminx-warrior-m',
    nombre: 'Pyraminx Warrior M',
    marca: 'Qiyi',
    precio: 10990,
    imagen: '/pyraminx-warrior-m.jpg',
    category: 'pyraminx',
    categoryBadge: 'BÁSICO'
  },
  {
    id: 'pyraminx-gear',
    nombre: 'Pyraminx Gear Qiyi',
    marca: 'Qiyi',
    precio: 13990,
    imagen: '/pyraminx-gear.jpg',
    category: 'pyraminx',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'pyraminx-rs3m',
    nombre: 'Pyraminx Rs3m Moyu Magnético',
    marca: 'Moyu',
    precio: 14990,
    imagen: '/pyraminx-rs3m.jpg',
    category: 'pyraminx',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'pyraminx-ms-qiyi',
    nombre: 'Pyraminx MS Qiyi Magnético',
    marca: 'Qiyi',
    precio: 14990,
    imagen: '/pyraminx-ms-qiyi.png',
    category: 'pyraminx',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'pyraminx-qiming',
    nombre: 'Pyraminx Qiming',
    marca: 'Qiyi',
    precio: 9990,
    imagen: '/pyraminx-qiming.jpg',
    category: 'pyraminx',
    categoryBadge: 'BÁSICO'
  },
  {
    id: 'skewb-rs-magnetico',
    nombre: 'Skewb RS Magnético',
    marca: 'Moyu',
    precio: 15990,
    imagen: '/skewb-rs-magnetico.jpg',
    category: 'skewb',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'skewb-gan-enhanced',
    nombre: 'Skewb Gan Enhanced',
    marca: 'GAN',
    precio: 46990,
    imagen: '/skewb-gan-enhanced.jpg',
    category: 'skewb',
    categoryBadge: 'PRO'
  },
  {
    id: 'skewb-meilong-mixup-iii',
    nombre: 'Skewb Meilong Mixup III',
    marca: 'Moyu',
    precio: 11990,
    imagen: '/skewb-meilong-mixup-iii.jpg',
    category: 'skewb',
    categoryBadge: 'BARATO'
  },
  {
    id: 'skewb-meilong-mixup-ii',
    nombre: 'Skewb Meilong Mixup II',
    marca: 'Moyu',
    precio: 11990,
    imagen: '/skewb-meilong-mixup-ii.jpg',
    category: 'skewb',
    categoryBadge: 'BARATO'
  },
  {
    id: 'skewb-rs-maglev',
    nombre: 'Skewb RS M Maglev',
    marca: 'Moyu',
    precio: 19990,
    imagen: '/skewb-rs-maglev.jpg',
    category: 'skewb',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'twisty-skewb',
    nombre: 'Twisty Skewb',
    marca: 'Qiyi',
    precio: 14990,
    imagen: '/twisty-skewb.png',
    category: 'skewb',
    categoryBadge: 'BARATO'
  },
  {
    id: 'maple-leaves-skewb',
    nombre: 'Maple Leaves Skewb',
    marca: 'MFJS',
    precio: 10990,
    imagen: '/maple-leaves-skewb.jpg',
    category: 'skewb',
    categoryBadge: 'BARATO'
  },
  {
    id: 'skewb-qicheng',
    nombre: 'Skewb QiCheng Qiyi',
    marca: 'Qiyi',
    precio: 9990,
    imagen: '/skewb-qicheng.jpg',
    category: 'skewb',
    categoryBadge: 'BARATO'
  },
  {
    id: 'skewb-meilong',
    nombre: 'Skewb Meilong',
    marca: 'Moyu',
    precio: 8990,
    imagen: '/skewb-meilong.png',
    category: 'skewb',
    categoryBadge: 'BARATO'
  },
  {
    id: 'megaminx-gan-maglev',
    nombre: 'Megaminx Gan Maglev',
    marca: 'GAN',
    precio: 74990,
    imagen: '/megaminx-gan-maglev.jpg',
    category: 'megaminx',
    categoryBadge: 'PRO'
  },
  {
    id: 'megaminx-qiheng-magnetico',
    nombre: 'Megaminx Qiheng Magnético',
    marca: 'Qiyi',
    precio: 17990,
    imagen: '/megaminx-qiheng-magnetico.jpg',
    category: 'megaminx',
    categoryBadge: 'BARATO'
  },
  {
    id: 'megaminx-qiheng',
    nombre: 'Megaminx Qiheng',
    marca: 'Qiyi',
    precio: 9990,
    imagen: '/megaminx-qiheng.jpeg',
    category: 'megaminx',
    categoryBadge: 'BARATO'
  },
  {
    id: 'megaminx-meilong-cobra',
    nombre: 'Megaminx Moyu Meilong Cobra',
    marca: 'Moyu',
    precio: 14990,
    imagen: '/megaminx-meilong-cobra.jpg',
    category: 'megaminx',
    categoryBadge: 'BARATO'
  },
  {
    id: 'galaxy-gigaminx-m',
    nombre: 'Galaxy Gigaminx M',
    marca: 'Dian Sheng',
    precio: 69990,
    imagen: '/galaxy-gigaminx-m.jpg',
    category: 'megaminx',
    categoryBadge: 'PRO'
  },
  {
    id: 'kilominx-2x2-qiyi',
    nombre: '2x2x2 Kilominx Qiyi',
    marca: 'Qiyi',
    precio: 11990,
    imagen: '/kilominx-2x2-qiyi.png',
    category: 'megaminx',
    categoryBadge: 'BARATO'
  },
  {
    id: 'square-1-mgc-magnetico',
    nombre: 'Square-1 MGC YJ Magnético',
    marca: 'YJ',
    precio: 27990,
    imagen: '/square-1-mgc-magnetico.jpg',
    category: 'square-1',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'square-1-mgc-v2-uv',
    nombre: 'Square-1 MGC V2 UV',
    marca: 'MGC',
    precio: 34990,
    imagen: '/square-1-mgc-v2-uv.jpg',
    category: 'square-1',
    categoryBadge: 'PRO'
  },
  {
    id: 'square-1-qiyi-qifa',
    nombre: 'Square-1 Qiyi Qifa',
    marca: 'Qiyi',
    precio: 11990,
    imagen: '/square-1-qiyi-qifa.jpg',
    category: 'square-1',
    categoryBadge: 'BARATO'
  },
  {
    id: 'square-1-meilong',
    nombre: 'Square-1 Meilong',
    marca: 'Moyu',
    precio: 9990,
    imagen: '/square-1-meilong.jpg',
    category: 'square-1',
    categoryBadge: 'BARATO'
  },
  {
    id: 'lubricante-lubicle-speedy',
    nombre: 'Lubricante Lubicle Speedy 3ml.',
    marca: 'Cubicle Labs',
    precio: 5990,
    imagen: '/lubricante-lubicle-speedy.png',
    category: 'accesorios',
    categoryBadge: 'BARATO'
  },
  {
    id: 'lubricante-cubicle-silk',
    nombre: 'Lubricante Cubicle Labs Silk 3ml.',
    marca: 'Cubicle Labs',
    precio: 6990,
    imagen: '/lubricante-cubicle-silk.png',
    category: 'accesorios',
    categoryBadge: 'BARATO'
  },
  {
    id: 'lubricante-dnm-37',
    nombre: 'DNM-37 Lubricante Lube',
    marca: 'Cubicle Labs',
    precio: 14990,
    imagen: '/lubricante-dnm-37.png',
    category: 'accesorios',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'lubricante-m-lube-qiyi',
    nombre: 'M-Lube lubricante Qiyi',
    marca: 'Qiyi',
    precio: 3990,
    imagen: '/lubricante-m-lube-qiyi.jpg',
    category: 'accesorios',
    categoryBadge: 'BARATO'
  },
  {
    id: 'lubricante-dayan-lube-verde',
    nombre: 'Dayan Lube Verde',
    marca: 'Dayan',
    precio: 2990,
    imagen: '/lubricante-dayan-lube-verde.jpg',
    category: 'accesorios',
    categoryBadge: 'BARATO'
  },
  {
    id: 'lubricante-moyu-lube-v1',
    nombre: 'Moyu Lube V1 5ml',
    marca: 'Moyu',
    precio: 4500,
    imagen: '/lubricante-moyu-lube-v1.jpg',
    category: 'accesorios',
    categoryBadge: 'BARATO'
  },
  {
    id: 'lubricante-gan-lube-maintenance',
    nombre: 'Gan Lube N°1: Maintenance',
    marca: 'Gan',
    precio: 5990,
    imagen: '/lubricante-gan-lube-maintenance.jpg',
    category: 'accesorios',
    categoryBadge: 'BARATO'
  },
  {
    id: 'lubricante-gan-lube-mastery',
    nombre: 'Gan Lube N°3: Mastery',
    marca: 'Gan',
    precio: 5990,
    imagen: '/lubricante-gan-lube-mastery.jpg',
    category: 'accesorios',
    categoryBadge: 'BARATO'
  },
  {
    id: 'lubricante-moyu-lube-v2',
    nombre: 'Moyu Lube V2 5ml',
    marca: 'Moyu',
    precio: 3990,
    imagen: '/lubricante-moyu-lube-v2.jpg',
    category: 'accesorios',
    categoryBadge: 'BARATO'
  },
  {
    id: 'display-pro-qiyi',
    nombre: 'Display Pro',
    marca: 'Qiyi',
    precio: 74990,
    imagen: '/display-pro-qiyi.jpg',
    category: 'accesorios',
    categoryBadge: 'PRO'
  },
  {
    id: 'bolso-qiyi',
    nombre: 'Bolso Qiyi',
    marca: 'Qiyi',
    precio: 19990,
    imagen: '/bolso-qiyi.jpg',
    category: 'accesorios',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'clock-qiyi',
    nombre: 'Clock Qiyi',
    marca: 'Qiyi',
    precio: 39990,
    imagen: '/clock-qiyi.jpg',
    category: 'accesorios',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'mat-moyu-chico',
    nombre: 'Mat Moyu Chico',
    marca: 'Moyu',
    precio: 4990,
    imagen: '/mat-moyu-chico.jpg',
    category: 'accesorios',
    categoryBadge: 'BARATO'
  },
  {
    id: 'timer-qiyi-v2-smart',
    nombre: 'Timer Qiyi V2 Smart',
    marca: 'Qiyi',
    precio: 25990,
    imagen: '/timer-qiyi-v2-smart.jpg',
    category: 'accesorios',
    categoryBadge: 'MEDIO'
  },
  {
    id: 'timer-qiyi',
    nombre: 'Timer Qiyi',
    marca: 'Qiyi',
    precio: 21990,
    imagen: '/timer-qiyi.jpg',
    category: 'accesorios',
    categoryBadge: 'MEDIO'
  }
]

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        // Primero intentar cargar desde productos estáticos
        if (staticProducts[id]) {
          setProduct(staticProducts[id])
          setLoading(false)
          return
        }
        
        // Si no está en productos estáticos, intentar desde Firebase
        const data = await getProductById(id)
        setProduct(data)
      } catch (error) {
        console.error('Error cargando producto:', error)
        // Si falla Firebase, intentar con productos estáticos
        if (staticProducts[id]) {
          setProduct(staticProducts[id])
        }
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  const addToCart = () => {
    if (!product) return

    const productName = product.nombre || product.name || 'Producto'
    const productImage = product.imagen || product.image || ''
    const productPrice = product.precio || product.price || 0

    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find(item => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({
        id: product.id,
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: quantity
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    
    // Disparar evento para actualizar el contador del carrito
    window.dispatchEvent(new Event('cartUpdated'))
    
    alert('Producto agregado al carrito')
  }

  // Obtener productos relacionados (excluyendo el actual)
  const relatedProducts = allProducts.filter(p => p.id !== product?.id).slice(0, 4)

  if (loading) {
    return <div className="loading">Cargando producto...</div>
  }

  if (!product) {
    return <div className="error">Producto no encontrado</div>
  }

  return (
    <div className="product-detail">
      <button onClick={() => navigate(-1)} className="back-btn">
        <ArrowLeft size={18} />
        Volver
      </button>

      <div className="product-detail-content">
        <div 
          className="product-detail-image"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = ((e.clientX - rect.left) / rect.width) * 100
            const y = ((e.clientY - rect.top) / rect.height) * 100
            setMousePosition({ x, y })
          }}
        >
          {product.imagen || product.image ? (
            <img 
              src={product.imagen || product.image} 
              alt={product.nombre || product.name}
              style={{
                transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
              }}
            />
          ) : (
            <div className="product-placeholder-large">🧩</div>
          )}
        </div>

        <div className="product-detail-info">
          <div className="product-header-info">
            {(product.marca || product.brand) && (
              <span className="product-category-badge-detail marca-badge">
                {product.marca || product.brand}
              </span>
            )}
            <h1>{product.nombre || product.name}</h1>
            {(product.marca || product.brand) && (
              <div className="product-meta">
                <Package size={18} />
                <span>Marca: {product.marca || product.brand}</span>
              </div>
            )}
            {(product.tipo || product.type) && (
              <div className="product-meta">
                <Tag size={18} />
                <span>Tipo: {product.tipo || product.type}</span>
              </div>
            )}
          </div>

          <div className="product-price-section">
            <p className="product-price-large">{formatPrice(product.precio || product.price)}</p>
            {product.stock !== undefined && (
              <span className="product-stock">
                {product.stock > 0 ? `✓ En stock (${product.stock} disponibles)` : '✗ Agotado'}
              </span>
            )}
          </div>
          
          <div className="product-description">
            <h3>Descripción</h3>
            <p>{product.description || product.descripcion || 'Sin descripción disponible'}</p>
          </div>

          <div className="product-actions">
            <div className="quantity-selector">
              <label>Cantidad:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="quantity-btn"
                >
                  −
                </button>
                <span className="quantity-value">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
            </div>

            <button className="add-to-cart-btn" onClick={addToCart}>
              <ShoppingCart size={20} />
              Agregar al Carrito
            </button>
          </div>
        </div>
      </div>

      {/* Sección de Más Productos */}
      {relatedProducts.length > 0 && (
        <div className="related-products-section">
          <h2 className="related-products-title">
            <Star size={24} />
            Más Productos
          </h2>
          <div className="related-products-grid">
            {relatedProducts.map((relatedProduct) => (
              <Link 
                key={relatedProduct.id} 
                to={`/product/${relatedProduct.id}`}
                className="related-product-card"
              >
                <div className="related-product-image">
                  <img 
                    src={relatedProduct.imagen} 
                    alt={relatedProduct.nombre}
                  />
                </div>
                <div className="related-product-info">
                  <h3>{relatedProduct.nombre}</h3>
                  <p className="related-product-price">
                    {formatPrice(relatedProduct.precio)}
                  </p>
                  {relatedProduct.marca && (
                    <span className="related-product-badge marca-badge">
                      {relatedProduct.marca}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail
