import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';
import { decode } from 'base64-arraybuffer';
import resizeImage from "./ResizeImage"

async function uploadImage(type: string) {
    // Request permission to access the user's photos
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
    }

    // Let the user pick an image from their device
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
    });

    if (!result.canceled) {
        // Read the image file as binary data
        const imageUri = Platform.OS === 'android' ? result.assets[0].uri : result.assets[0].uri.replace('file://', '');
        // const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: 'base64' });
        // Resize the image
        const resizedUri = await resizeImage(imageUri, 200);

        const base64 = await FileSystem.readAsStringAsync(resizedUri, { encoding: 'base64' });

        // Generate a unique filename based on the current timestamp
        const filename = `avatar_${Date.now()}.jpg`;

        // Upload the image to Supabase Storage
        let { error: uploadError } = await supabase.storage.from('images/' + type)
            .upload(filename, decode(base64), { contentType: 'image/jpeg', upsert: true });

        if (uploadError) {
            console.error(uploadError);
            return;
        }

        // Get the URL of the uploaded image
        let { data: urlData } = await supabase.storage.from('images/' + type).getPublicUrl(filename);

        let publicURL = urlData?.publicUrl; // Corrected this line
        // console.log(publicURL);  // You can now use this URL to display the image or save it to your database
        return publicURL
    }

}

export default uploadImage