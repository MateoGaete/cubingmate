import { useState, useMemo, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, MessageCircle, Search, X, ChevronLeft, ChevronRight, Users, Star } from 'lucide-react'
import ProductList from '../components/ProductList'
import { getTotalCustomers } from '../firebase/orders'
import './Home.css'

// Array de productos con sus categorías (fuera del componente para mejor rendimiento)
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

function Home() {
  // Cargar categoría desde localStorage al inicializar
  const [selectedCategory, setSelectedCategory] = useState(() => {
    try {
      const savedCategory = localStorage.getItem('selectedCategory')
      if (savedCategory && savedCategory !== 'null' && savedCategory !== 'undefined') {
        return savedCategory
      }
      return null
    } catch (e) {
      return null
    }
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCustomers, setTotalCustomers] = useState(0)
  const productsPerPage = 20

  // Cargar el número total de clientes
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const count = await getTotalCustomers()
        setTotalCustomers(count)
      } catch (error) {
        console.error('Error obteniendo total de clientes:', error)
      }
    }
    fetchCustomers()
  }, [])

  const categories = [
    { id: null, name: 'Todos' },
    { id: '3x3', name: '3x3' },
    { id: '2x2', name: '2x2' },
    { id: '4x4', name: '4x4' },
    { id: '5x5', name: '5x5' },
    { id: '6x6', name: '6x6' },
    { id: '7x7', name: '7x7' },
    { id: 'pyraminx', name: 'Pyraminx' },
    { id: 'pack', name: 'Packs' },
    { id: 'accesorios', name: 'Accesorios' }
  ]

  // Guardar categoría en localStorage cuando cambia
  useEffect(() => {
    if (selectedCategory !== null) {
      localStorage.setItem('selectedCategory', selectedCategory)
    } else {
      localStorage.removeItem('selectedCategory')
    }
  }, [selectedCategory])

  // Filtrar productos según la categoría seleccionada y el término de búsqueda
  const filteredProducts = useMemo(() => {
    let filtered = allProducts

    // Filtrar por categoría
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Filtrar por búsqueda
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(product => 
        product.nombre?.toLowerCase().includes(searchLower) ||
        product.category?.toLowerCase().includes(searchLower) ||
        product.marca?.toLowerCase().includes(searchLower)
      )
    }

    return filtered
  }, [selectedCategory, searchTerm])

  // Resetear a página 1 cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, searchTerm])

  // Scroll al inicio cuando el usuario cambia de categoría (al salir de "Todos" desaparece "Más Recomendados")
  const isFirstCategoryLoad = useRef(true)
  useEffect(() => {
    if (isFirstCategoryLoad.current) {
      isFirstCategoryLoad.current = false
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [selectedCategory])

  // Calcular productos paginados
  // Paginar automáticamente si hay más de 20 productos, dividiendo en grupos de 20
  const shouldPaginate = filteredProducts.length > 20
  const totalPages = shouldPaginate ? Math.ceil(filteredProducts.length / productsPerPage) : 1
  const startIndex = shouldPaginate ? (currentPage - 1) * productsPerPage : 0
  const endIndex = shouldPaginate ? startIndex + productsPerPage : filteredProducts.length
  const paginatedProducts = shouldPaginate 
    ? filteredProducts.slice(startIndex, endIndex)
    : filteredProducts

  // Generar números de página a mostrar
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Mostrar páginas con elipsis
      if (currentPage <= 3) {
        // Al inicio
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // Al final
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // En el medio
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="home">
      <div className="hero">
        <h1>Bienvenido a CubingMate</h1>
        <p className="hero-subtitle">Somos una de las primeras tiendas en Chile que se dedica full a los cubos de Rubik</p>
        <p>Tu tienda favorita de cubos de Rubik y speedcubing, aqui encontraras de todos</p>
      </div>

      {/* Bloque separado de clientes */}
      <div className="customers-section">
        <div className="customers-badge">
          <div className="customers-badge-content">
            <div className="customers-icon-wrapper">
              <Users size={32} className="customers-icon" />
            </div>
            <div className="customers-text">
              <span className="customers-number">Más de 500</span>
              <span className="customers-message">personas han comprado en CubingMate</span>
            </div>
            <div className="customers-stars">
              <Star size={24} fill="#FFD700" stroke="#FFD700" className="star-icon" />
              <Star size={24} fill="#FFD700" stroke="#FFD700" className="star-icon" />
              <Star size={24} fill="#FFD700" stroke="#FFD700" className="star-icon" />
              <Star size={24} fill="#FFD700" stroke="#FFD700" className="star-icon" />
              <Star size={24} fill="#FFD700" stroke="#FFD700" className="star-icon" />
            </div>
          </div>
          <p className="customers-submessage">¡Y ha sido genial! 🎉</p>
        </div>
      </div>

      <div className="search-section">
        <div className="search-container">
          <Search className="search-icon" size={24} />
          <input
            type="text"
            placeholder="Buscar cubos..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="search-clear"
              onClick={() => setSearchTerm('')}
              aria-label="Limpiar búsqueda"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="categories">
        <h2>Categorías</h2>
        <div className="category-buttons">
          {categories.map((category) => (
            <button
              key={category.id || 'all'}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sección de Productos Recomendados - Solo se muestra cuando está en "Todos" y no hay búsqueda */}
      {!selectedCategory && !searchTerm && (
        <div className="products-section">
          <h2>Más Recomendados</h2>
          <div className="products-grid">
            {allProducts
              .filter(product => 
                product.id === 'rs3m-v5-ajuste-dual' ||
                product.id === 'gan-356-m-lite' ||
                product.id === 'aosu-triple-track-magnetic' ||
                product.id === 'x-man-design-hong-5x5' ||
                product.id === 'aoshi-wr-m-6x6' ||
                product.id === 'qixing-s-7x7' ||
                product.id === 'pyraminx-gan-enhanced' ||
                product.id === 'pyraminx-qiming'
              )
              .map((product) => {
                const formatPrice = (price) => {
                  return new Intl.NumberFormat('es-CL', {
                    style: 'currency',
                    currency: 'CLP',
                    minimumFractionDigits: 0
                  }).format(price)
                }

                return (
                  <Link key={product.id} to={`/product/${product.id}`} className="product-item-link">
                    <div className="product-item">
                      <div className="product-image-container">
                        <img src={product.imagen} alt={product.nombre} className="product-img" />
                      </div>
                      <div className="product-details">
                        <h3 className="product-title">{product.nombre}</h3>
                        <p className="product-price">{formatPrice(product.precio)}</p>
                        {product.marca && (
                          <span className="product-category-badge marca-badge">
                            {product.marca}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
          </div>
        </div>
      )}

      <div className="products-section">
        <h2>Más Vendidos</h2>
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <p>
              {searchTerm 
                ? `No se encontraron productos que coincidan con "${searchTerm}"` 
                : 'No hay productos disponibles en esta categoría.'}
            </p>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {paginatedProducts.map((product) => {
              const formatPrice = (price) => {
                return new Intl.NumberFormat('es-CL', {
                  style: 'currency',
                  currency: 'CLP',
                  minimumFractionDigits: 0
                }).format(price)
              }

              return (
                <Link key={product.id} to={`/product/${product.id}`} className="product-item-link">
                  <div className="product-item">
                    <div className="product-image-container">
                      <img src={product.imagen} alt={product.nombre} className="product-img" />
                    </div>
                    <div className="product-details">
                      <h3 className="product-title">{product.nombre}</h3>
                      <p className="product-price">{formatPrice(product.precio)}</p>
                      {product.marca && (
                        <span className="product-category-badge marca-badge">
                          {product.marca}
                        </span>
                      )}
                      <button 
                        className="btn-add-cart"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          const cart = JSON.parse(localStorage.getItem('cart') || '[]')
                          const existingItem = cart.find(item => item.id === product.id)
                          
                          if (existingItem) {
                            existingItem.quantity += 1
                          } else {
                            cart.push({
                              id: product.id,
                              name: product.nombre,
                              price: product.precio,
                              image: product.imagen,
                              quantity: 1
                            })
                          }
                          
                          localStorage.setItem('cart', JSON.stringify(cart))
                          window.dispatchEvent(new Event('cartUpdated'))
                          alert('Producto agregado al carrito')
                        }}
                      >
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                </Link>
              )
            })}
            </div>
            
            {/* Barra de paginación - Mostrar si hay más de 20 productos */}
            {shouldPaginate && totalPages > 1 && (
              <div className="pagination-container">
                <div className="pagination">
                  <button
                    className="pagination-btn pagination-nav"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Página anterior"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        className={`pagination-btn pagination-number ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                        aria-label={`Ir a página ${page}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                      >
                        {page}
                      </button>
                    )
                  ))}
                  
                  <button
                    className="pagination-btn pagination-nav"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Página siguiente"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                
                <div className="pagination-info">
                  Mostrando {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} de {filteredProducts.length} productos
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="social-section">
        <h2>Síguenos en nuestras redes</h2>
        <p className="social-subtitle">Mantente al día con nuestros últimos productos y ofertas</p>
        <div className="social-links">
          <div className="social-link instagram">
            <div className="social-icon-wrapper">
              <Instagram size={32} strokeWidth={2} />
            </div>
            <span className="social-name">Instagram</span>
            <span className="social-handle">Próximamente</span>
          </div>
          
          <div className="social-link tiktok">
            <div className="social-icon-wrapper">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </div>
            <span className="social-name">TikTok</span>
            <span className="social-handle">Próximamente</span>
          </div>
          
          <div className="social-link whatsapp">
            <div className="social-icon-wrapper">
              <MessageCircle size={32} strokeWidth={2} />
            </div>
            <span className="social-name">WhatsApp</span>
            <span className="social-handle">Próximamente</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
