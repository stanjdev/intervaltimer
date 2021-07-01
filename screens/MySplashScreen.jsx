import React, { useEffect } from 'react';
import { Text, View, StyleSheet, StatusBar, Dimensions, ImageBackground } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import AppButton from '../components/AppButton';
const { width, height } = Dimensions.get('window');
const bgImage = require('../assets/splash/splash-screen-ellipse.png')

export default function MySplashScreen ({ route, navigation }) {
  const isFocused = useIsFocused();

  let [fontsLoaded] = useFonts({
    'SourceCodePro-Regular': require('../assets/fonts/Source_Code_Pro/SourceCodePro-Regular.ttf'),
    'SourceCodePro-Medium': require('../assets/fonts/Source_Code_Pro/SourceCodePro-Medium.ttf'),
    'SourceCodePro-SemiBold': require('../assets/fonts/Source_Code_Pro/SourceCodePro-SemiBold.ttf'),
  });

  const navTo = () => route.params ? 
                      navigation.navigate('TimerSetScreen')
                    : navigation.navigate('TimerSetScreen', { screen: 'Meditate' })

  useEffect(() => {
    let timeout = setTimeout(() => {
      navTo();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isFocused])

  return (
    <View style={styles.container}>
      <StatusBar hidden={true}/>
      <View>
        <AppButton
          buttonStyles={styles.pressScreenButton} 
          onPress={navTo}
        />
        <View style={{height: height, width: width, justifyContent: "center", alignItems: "center"}}>
          <ImageBackground source={bgImage} style={styles.image}>
            <Text style={[styles.titleText, styles.sourceCodeProMedium]}>INTERVAL TIMER</Text>
            <Text style={[styles.subTitleText, styles.sourceCodeProMedium]}>by Semicircle Labs</Text>
          </ImageBackground>
        </View>
      </View>
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
    alignItems: "center"
  },
  body: {
    flex: 2,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  footerIntro: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 45,
    justifyContent: "space-evenly",
  },
  pressScreenButton: {
    height: height,
    width: width,
    position: "absolute",
    zIndex: 10,
    top: 0,
    right: 0,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    flex: 1,
    textAlign: "center",
    fontSize: 24,
  },
  titleText: {
    color: "white",
    fontSize: 30,
    marginBottom: 15
  },
  subTitleText: {
    color: "#828282",
    fontSize: 20,
  },
  sourceCodeProMedium: {
    fontFamily: 'SourceCodePro-Medium'
  }
});