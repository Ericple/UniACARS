import path from 'path';

export const page = (target: 'login' | 'main') => {
    return path.join(__dirname, target) + ".html";
}