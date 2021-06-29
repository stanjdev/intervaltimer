import React from 'react';
import { Text, View, StatusBar, Image, Dimensions, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import AppButton from '../components/AppButton';
import { useIsFocused } from '@react-navigation/native';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');

export default function SavePresetScreen({ navigation, route }) {
  const isFocused = useIsFocused();

  let [fontsLoaded] = useFonts({
    'SourceCodePro-Regular': require('../assets/fonts/Source_Code_Pro/SourceCodePro-Regular.ttf'),
    'SourceCodePro-Medium': require('../assets/fonts/Source_Code_Pro/SourceCodePro-Medium.ttf'),
    'SourceCodePro-SemiBold': require('../assets/fonts/Source_Code_Pro/SourceCodePro-SemiBold.ttf'),
  });
    
  const { sets, workTime, rest } = route.params;


  return (
    <View style={{ flex: 1, resizeMode: "cover", justifyContent: "center", backgroundColor: "black" }}>
      {isFocused ? <StatusBar hidden={false} barStyle="light-content"/> : null} 
      <TouchableOpacity onPress={() => navigation.goBack()} style={{position: "absolute", top: height * 0.065, zIndex: 100, padding: 15}}>
        <Image source={require('../assets/screen-icons/back-arrow-white.png')} style={{height: 20, }} resizeMode="contain"/>
      </TouchableOpacity>

      <View style={{marginTop: 80}}>
        <View style={{flexDirection: "row"}}>
          <View style={{backgroundColor: "black", flex: 1, height: height * 0.85, alignItems: "center" }}>
            
            <View style={{ alignItems: "center", justifyContent: "space-between", height: 150, marginBottom: height > 700 ? 175 : 100 }}>
              <Text style={{textAlign: "center", fontSize: 14, fontFamily: "SourceCodePro-Medium", color: "#FFF"}}>NAME YOUR PRESET</Text>
              <TextInput 
                placeholder="NEW WORKOUT" 
                placeholderTextColor="#828282" 
                style={[{ 
                  backgroundColor: "#333333", 
                  color: "#FFFFFF", 
                  fontSize: 24, 
                  textAlign: "center", 
                  height: 46, 
                  width: width * 0.9, 
                  borderRadius: 8,
              }, styles.sourceCodeProMedium]}>
              </TextInput>
              <View style={{flexDirection: "row", justifyContent: "space-around", width: width}}>
                <Text style={{ fontSize: 14, fontFamily: "SourceCodePro-Medium", color: "#FFF", }}>{sets} SETS</Text>
                <Text style={{ fontSize: 14, fontFamily: "SourceCodePro-Medium", color: "#FFF", }}>{`${Math.floor(workTime / 60)}:${workTime % 60 || "00"}`} WORK</Text>
                <Text style={{ fontSize: 14, fontFamily: "SourceCodePro-Medium", color: "#FFF", }}>{`${Math.floor(rest / 60)}:${rest % 60 || "00"}`} REST</Text>
              </View>
            </View>

            <AppButton 
              title="SAVE"
              buttonStyles={styles.yellowButton}
              buttonTextStyles={styles.buttonText}
              onPress={() => console.log("save pressed")}
            />

          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  yellowButton: {
    backgroundColor: "#FAFF00",
    height: 47,
    width: width * 0.8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowRadius: 7,
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowOffset: {width: 3, height: 3}
  },
  buttonText: {
    color: "#000",
    flex: 1,
    textAlign: "center",
    fontSize: 19,
    letterSpacing: 1,
    fontFamily: "SourceCodePro-Medium"
  },
  sourceCodeProRegular: {
    fontFamily: "SourceCodePro-Regular"
  },
  sourceCodeProSemiBold: {
    fontFamily: "SourceCodePro-SemiBold"
  },
  sourceCodeProMedium: {
    fontFamily: "SourceCodePro-Medium"
  }
});