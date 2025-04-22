import React, { useState, useEffect } from "react";
import { Text, View, Dimensions, Linking, TouchableOpacity, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import mammoth from "mammoth";
import * as Speech from 'expo-speech';
import { COLORS, icons } from "../constants";
import { Button } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';

const DocxReader = ({ docxUrl }) => {
  const [htmlContent, setHtmlContent] = useState(null);
  const [textContainerWidth, setTextContainerWidth] = useState(Dimensions.get("window").width);
  const [plainText, setPlainText] = useState("");
  const [speechRate, setSpeechRate] = useState(1.0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechPosition, setSpeechPosition] = useState(0);
  const [currentSpeechText, setCurrentSpeechText] = useState("");
  const [isSpeakingRequested, setIsSpeakingRequested] = useState(false);

  useEffect(() => {
    const fetchDocxAndConvertToHtml = async () => {
      try {
        const response = await fetch(docxUrl);
        const docxData = await response.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer: docxData });
        setHtmlContent(result.value);

        const plainTextResult = await mammoth.extractRawText({
          arrayBuffer: docxData,
        });
        setPlainText(plainTextResult.value);
      } catch (error) {
        console.error("Error reading or converting DOCX:", error);
      }
    };

    fetchDocxAndConvertToHtml();
  }, [docxUrl]);

  useEffect(() => {
    setTextContainerWidth(Dimensions.get("window").width - 15);
  }, []);

  useEffect(() => {
    handleReadAloud();
  }, [speechRate]);


  const handleReadAloud = () => {
    Speech.stop();
    setIsSpeaking(true);
    setCurrentSpeechText(plainText.slice(speechPosition));
    Speech.speak(plainText.slice(speechPosition), {
      rate: speechRate,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
    });
  };

  const handlePause = () => {
    setIsSpeakingRequested(false); // Set the desired state
    Speech.stop();
    setIsSpeaking(false);
  };

  const handleNavigationStateChange = (event) => {
    if (!event.url.startsWith('data:text/html')) {
      Linking.openURL(event.url);
      return false;
    }
    return true;
  };

  const injectedJS = `
    var style = document.createElement('style');
    style.innerHTML = 'body { font-size: 20px; text-align: justify; font-family: Roboto}';
    document.head.appendChild(style);

    var textContainerWidth = ${textContainerWidth};
    var images = document.getElementsByTagName('img');
    for (var i = 0; i < images.length; i++) {
      images[i].style.width = textContainerWidth + 'px';
      images[i].style.height = 'auto';

      var imageContainer = document.createElement('div');
      imageContainer.style.paddingRight = '20px';
      imageContainer.style.boxSizing = 'border-box';
      images[i].parentNode.insertBefore(imageContainer, images[i].nextSibling);
      imageContainer.appendChild(images[i]);
    }

    var links = document.getElementsByTagName('a');
    for (var j = 0; j < links.length; j++) {
      var linkContainer = document.createElement('div');
      linkContainer.style.width = '100%';
      linkContainer.style.overflow = 'hidden';
      linkContainer.style.textOverflow = 'ellipsis';
      linkContainer.style.whiteSpace = 'nowrap';

      links[j].parentNode.insertBefore(linkContainer, links[j]);
      linkContainer.appendChild(links[j]);
    }
  `;

  return (
    <View style={{ flex: 1 }}>
      {htmlContent ? (
        <>
          <WebView
            originWhitelist={["*"]}
            source={{ html: htmlContent }}
            style={{ flex: 1 }}
            injectedJavaScript={injectedJS}
            javaScriptEnabled={true}
            scalesPageToFit={false}
            scrollEnabled={false}
            onShouldStartLoadWithRequest={handleNavigationStateChange}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', margin: 5, flexWrap: 'wrap' }}>
            <Button
              buttonStyle={{
                backgroundColor: COLORS.darkRed,
                borderRadius: 50,
                padding: 5,
                width: 35,
                height: 35,
                margin: 2,
              }}
              onPress={handleReadAloud}
              icon={<icons.speaker fill="white" />}
            />
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.darkRed,
                borderRadius: 50,
                padding: 5,
                width: 35,
                height: 35,
                margin: 2,
              }}
              onPress={handlePause}>
              <icons.pause fill={'white'} />
            </TouchableOpacity>
            <Picker
              selectedValue={speechRate}
              style={{ height: 25, width: 120, margin: 2 }}
              onValueChange={(itemValue) => setSpeechRate(itemValue)}
            >
              <Picker.Item label="0.25x" value={0.25} />
              <Picker.Item label="0.5x" value={0.5} />
              <Picker.Item label="0.75x" value={0.75} />
              <Picker.Item label="1x" value={1.0} />
              <Picker.Item label="1.25x" value={1.25} />
              <Picker.Item label="1.5x" value={1.5} />
              <Picker.Item label="1.75x" value={1.75} />
              <Picker.Item label="2x" value={2.0} />
            </Picker>
          </View>
        </>
      ) : (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={COLORS.darkRed} />
        </View>
      )}
    </View>
  );
};

export default DocxReader;
