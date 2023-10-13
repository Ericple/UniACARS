import fs from 'fs';
import path from 'path'
export const loadPage = (template: string | null, callback?: () => void):void => {
    if(template === null) return;
    const content = fs.readFileSync(path.join(__dirname, 'page-template', template + '.html'), 'utf-8');
    const container = document.getElementById('page-container');
    if (!container) throw new Error("No container!");
    container.innerHTML = content;
    setTimeout(() => {
        if(callback) callback();
    }, 100);
}
export const loadExternalPage = (pluginName: string | null, template: string | null): void => {
    if(template==null || pluginName==null) return;
    const pluginPath = path.join(__dirname, '..', '..', '..', '..', 'plugins', pluginName);
    const pluginFuncs = require(path.join(pluginPath, 'entry.js'));
    const pages = pluginFuncs.pages;
    const content = fs.readFileSync(path.join(pluginPath, 'template', template+'.html'), 'utf-8');
    const container = document.getElementById('page-container');
    if(!container) return;
    container.innerHTML=content;
    setTimeout(() => {
        pages.forEach((navButton:any) => {
            if(navButton.name == template && navButton.callback) navButton.callback();
        })
    }, 100);
}
export const sidebarSelect = (index: number) => {
    const el = document.getElementsByClassName('side-bar-item');
    const sidebarItems = [...el];
    sidebarItems.forEach((item, i) => {
        if(index === i) {
            document.getElementById(item.id)?.classList.add('active');
        }else{
            document.getElementById(item.id)?.classList.remove('active');
        }
    });
}
export default loadPage;