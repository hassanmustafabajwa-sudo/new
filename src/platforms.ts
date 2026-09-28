import {siMeta,siInstagram,siFacebook,siWhatsapp,siTiktok,siGoogle,siGoogleads,siGoogleanalytics,siGooglesearchconsole,siGoogletagmanager,siYoutube,siGooglechrome,siShopify,siCanva,siLinkedin,siPinterest,siSnapchat} from 'simple-icons'
// If the build reports a missing export (e.g. siLinkedin in newer simple-icons), swap in another legitimate SVG path or drop that line.
export type Family='meta'|'google'|'tiktok'|'shop'|'other'
export type Platform={name:string;path:string;family:Family;scale:number;hub?:boolean;perf?:boolean;media?:boolean}
const P=(name:string,i:{path:string},family:Family,scale=1,x:Partial<Platform>={}):Platform=>({name,path:i.path,family,scale,...x})
// Dedicated marks missing for Ads Manager / Business Suite / Ads Library / Search Console / Tag Manager / TikTok Ads use the parent mark where no own icon exists.
export const PLATFORMS:Platform[]=[
P('Meta',siMeta,'meta',1.5,{hub:true,perf:true}),P('Instagram',siInstagram,'meta',1.1,{media:true}),P('Facebook',siFacebook,'meta'),P('WhatsApp',siWhatsapp,'meta'),
P('Meta Ads Manager',siMeta,'meta',.8),P('Meta Business Suite',siMeta,'meta',.7),P('Meta Ads Library',siMeta,'meta',.7),
P('Google',siGoogle,'google',1.5,{hub:true,perf:true}),P('Google Ads',siGoogleads,'google',1,{perf:true}),P('Google Analytics',siGoogleanalytics,'google'),P('Google Search Console',siGooglesearchconsole,'google',.8),P('Google Tag Manager',siGoogletagmanager,'google',.8),P('YouTube',siYoutube,'google',1.2,{perf:true,media:true}),P('Chrome',siGooglechrome,'google'),
P('TikTok',siTiktok,'tiktok',1.4,{hub:true,perf:true,media:true}),P('TikTok Ads Manager',siTiktok,'tiktok',.8,{perf:true}),
P('Shopify',siShopify,'shop',1.2,{hub:true}),P('Canva',siCanva,'other'),P('LinkedIn',siLinkedin,'other',1,{media:true}),P('Pinterest',siPinterest,'other'),P('Snapchat',siSnapchat,'other')]
