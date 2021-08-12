import React, { useEffect } from 'react';
import { Text, View, StyleSheet, StatusBar, Dimensions, ImageBackground, TouchableOpacity, Image, ScrollView} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import AppButton from '../components/AppButton';
const { width, height } = Dimensions.get('window');
const bgImage = require('../assets/splash/splash-screen-ellipse.png');
import PresetButton from '../components/PresetButton';

export default function PresetsLibraryScreen ({ route, navigation }) {
  const isFocused = useIsFocused();

  let [fontsLoaded] = useFonts({
    'SourceCodePro-Regular': require('../assets/fonts/Source_Code_Pro/SourceCodePro-Regular.ttf'),
    'SourceCodePro-Medium': require('../assets/fonts/Source_Code_Pro/SourceCodePro-Medium.ttf'),
    'SourceCodePro-SemiBold': require('../assets/fonts/Source_Code_Pro/SourceCodePro-SemiBold.ttf'),
  });

  const goBack = () => {
    navigation.navigate("TimerSetScreen");
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden={true}/>

      <View style={{ width: width, flexDirection: "row", alignItems: "center", marginTop: height < 700 ? 40 : height * 0.07, position: "absolute", zIndex: 100 }}>
        <TouchableOpacity onPress={goBack} style={{ padding: 15}}>
          <Image source={require('../assets/screen-icons/back-arrow-white.png')} style={{height: 20, marginLeft: 0}} resizeMode="contain"/>
        </TouchableOpacity>
        <Text style={[{textAlign: "center", fontSize: 20, color: "#E0E0E0", position: "absolute", zIndex: -1, width: width}, styles.sourceCodeProMedium]}>SAVED PRESETS</Text>        
      </View>

      {/* IF EMPTY LIBRARY: */}
      {/* <View style={{height: height, width: width, justifyContent: "center", alignItems: "center" }}>
        <ImageBackground source={bgImage} style={styles.image}>
          <Text style={[styles.titleText, styles.sourceCodeProMedium]}>NO SAVED PRESETS</Text>
        </ImageBackground>
        <AppButton 
          title={"CREATE A NEW WORKOUT"}
          buttonStyles={[styles.button, styles.yellowButton]}
          buttonTextStyles={[styles.buttonText, styles.sourceCodeProMedium]}
          onPress={goBack}
        />
      </View> */}

      {/* ELSE, SHOW Programmatically rendered PRESETS: */}
      <ScrollView>
        <View style={{ alignItems: "center", marginTop: height * 0.17, height: height * 0.83 }}>
          <PresetButton presetName="LEG DAY #2" onPress={() => console.log("OFIDSJf")}/>
          <PresetButton presetName="FRIDAY HIIT" onPress={() => console.log("OFIDSJf")}/>
          <PresetButton presetName="SLOW CHEST WORKOUT" onPress={() => console.log("OFIDSJf")}/>
          <PresetButton presetName="STRETCH ROUTINE" onPress={() => console.log("OFIDSJf")}/>
        </View>
      </ScrollView>

    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  image: {
    height: 312,
    width: 312,
    resizeMode: "contain",
    justifyContent: "center",
    alignItems: "center",
    transform: [{rotateY: "180deg"}]
  },
  button: {
    height: 47,
    width: width * 0.8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowRadius: 7,
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowOffset: {width: 3, height: 3},
    position: "absolute",
    bottom: height * 0.1
  },
  yellowButton: {
    backgroundColor: "#FAFF00",
  },
  buttonText: {
    color: "#000",
    flex: 1,
    textAlign: "center",
    fontSize: 19,
  },
  titleText: {
    color: "white",
    fontSize: 24,
    transform: [{rotateY: "180deg"}]
  },
  subTitleText: {
    color: "#828282",
    fontSize: 20,
  },
  sourceCodeProMedium: {
    fontFamily: 'SourceCodePro-Medium'
  }
});