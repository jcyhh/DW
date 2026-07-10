import { createI18n } from 'vue-i18n'
import { getLang } from '../config/storage';

import enCommon from './common/en.json';
import koCommon from './common/ko.json';
import jaCommon from './common/ja.json';
import hkCommon from './common/hk.json';
import zhCommon from './common/zh.json';
import idCommon from './common/id.json';
import esCommon from './common/es.json';
import trCommon from './common/tr.json';
import viCommon from './common/vi.json';
import thCommon from './common/th.json';

import en from './modules/en.json';
import ko from './modules/ko.json';
import ja from './modules/ja.json';
import hk from './modules/hk.json';
import zh from './modules/zh.json';
import id from './modules/id.json';
import es from './modules/es.json';
import tr from './modules/tr.json';
import vi from './modules/vi.json';
import th from './modules/th.json';

const messages = {
    en: {...en, ...enCommon},
    ko: {...ko, ...koCommon},
    ja: {...ja, ...jaCommon},
    hk: {...hk, ...hkCommon},
    zh: {...zh, ...zhCommon},
    id: {...id, ...idCommon},
    es: {...es, ...esCommon},
    tr: {...tr, ...trCommon},
    vi: {...vi, ...viCommon},
    th: {...th, ...thCommon}
}


/**
 * name => 名称
 * lang => 前端使用的多语言值
 * value => 请求头传给后端的值
 */
export const langs = [
    { name: 'English', lang: 'en', value: 'en' }, // 英语
    { name: '한국어', lang: 'ko', value: 'ko' }, // 韩语
    { name: '日本語', lang: 'ja', value: 'ja' }, // 日语
    { name: '繁体中文', lang: 'hk', value: 'zh-Hant' }, // 繁体中文
    { name: '简体中文', lang: 'zh', value: 'zh-Hans' }, // 简体中文
    // { name: 'Indonesian', lang: 'id', value: 'id' }, // 印尼语
    // { name: 'Español', lang: 'es', value: 'es' }, // 西班牙语
    // { name: 'Türkçe', lang: 'tr', value: 'tr' }, // 土耳其语
    // { name: 'Tiếng Việt', lang: 'vi', value: 'vi' }, // 越南
    // { name: 'ภาษาไทย', lang: 'th', value: 'th' } // 泰国
]

// 获取当前请求头要传的值
export function getHeaderLang(): string {
    let lang = getLang()
    const langInfo = langs.find( item => item.lang == lang )!
    return langInfo.value
}

export const i18n = createI18n({
    legacy: false,
    locale: getLang(),
    messages
})

export const t = i18n.global.t