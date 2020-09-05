/**
 * Function that return an image in base64
 * @param event indicates the event where the file is passing through
 */
function getBase64(event: Event): (string | ArrayBuffer) {
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return reader.result
}
