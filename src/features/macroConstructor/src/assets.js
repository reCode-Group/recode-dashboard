export const constructorLogoUrl = new URL('../app/media/constructor.svg', import.meta.url).href;
export const companyAvatarUrl = new URL('../app/media/imakaev.jpg', import.meta.url).href;
export const loaderLogoUrl = new URL('../app/media/logo.png', import.meta.url).href;
const blocklySpriteUrl = new URL('../app/media/sprites.svg', import.meta.url).href;
export const blocklyMediaUrl = `${blocklySpriteUrl.slice(0, blocklySpriteUrl.lastIndexOf('/') + 1)}`;
