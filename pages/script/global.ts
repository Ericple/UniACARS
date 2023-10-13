export const backendUrl = `/core/UniACARS/handler.php?action=`;
export const acarsUrl = `/action.php/acars/data`;
export const markerUrl = `/lib/images/inair`;
export const ipcPath = "\\\\.\\pipe\\unipipe_get";
export const makeMarker = (baseUrl: string, heading: string) => {
    return `${baseUrl}${markerUrl}/${heading}.png`;
}
export default backendUrl;