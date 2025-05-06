import * as ImageManipulator from 'expo-image-manipulator';
async function resizeImage(uri, maxWidth) {
    const data = await ImageManipulator.
        manipulateAsync(uri, [
            { resize: { width: maxWidth, height: maxWidth } },
        ],
            { compress: 0.5, format: ImageManipulator.SaveFormat.PNG });
    return data.uri
}
export default resizeImage