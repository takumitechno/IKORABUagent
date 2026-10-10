/** ライト／ダークの選択を端末に覚えるキー（個人情報は入れない） */
export const THEME_STORAGE_KEY = "theme";

/**
 * 描画の前に、保存してある表示モードを html[data-theme] に反映する（白→黒のちらつきを防ぐ）。
 * 保存がなければ何もしない（OS の設定に従う）。
 */
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t==="dark"||t==="light")document.documentElement.dataset.theme=t}catch(e){}`;
