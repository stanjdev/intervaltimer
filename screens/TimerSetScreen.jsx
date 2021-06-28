import React, { useEffect, useState } from 'react';
import { Text, View, StatusBar, Image, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import AppButton from '../components/AppButton';
import { useIsFocused } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export default function TimerSetScreen({ navigation, route }) {
  const [sets, setSets] = useState(4);
  const [workTime, setWorkTime] = useState(120);
  const [rest, setRest] = useState(180);
  const [totalDuration, setTotalDuration] = useState(sets * (workTime + rest) - rest);
  const [bellIntervDisplay, setBellIntervDisplay] = useState(4);
  const [bellInterv, setBellInterv] = useState(30000);

  const onChange = async (value, state, setter) => {
    if (setter == setWorkTime || setter == setRest) {
      setter(Math.floor(value * 30));
    } else {
      setter(Math.floor(value));
    }
    if (value !== state) {
      await Haptics.selectionAsync();
    }
  };

  useEffect(() => {
    setTotalDuration(sets * (workTime + rest) - rest);
    console.log(totalDuration);
  }, [sets, workTime, rest])

  const onChangeSecs = async (value) => {
    const bellOptions = {
      // "30 Seconds": 5000, // short 5 sec test
      "30 Seconds": 30000,
      "60 Seconds": 60000,
      "90 Seconds": 90000,
      "2 Minutes": 120000,
      "3 Minutes": 180000,
      "5 Minutes": 300000,
      "OFF": null
    }
    let bellArray = Object.keys(bellOptions);
    if (value >= 0 && value < 7) {
      setBellIntervDisplay(bellArray[value])
      setBellInterv(bellOptions[bellArray[value]])

      if (bellArray[value] !== bellIntervDisplay) {
        await Haptics.selectionAsync();
        // console.log(value);
      }
    }
    // console.log(bellIntervDisplay)
    // console.log(bellInterv)
  }

  const isFocused = useIsFocused();

  let [fontsLoaded] = useFonts({
    'Assistant': require('../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });

  const startTimerExercise = () => {
    // incrementStreak();
    setTimeout(() => {
      navigation.navigate('TimerExerciseScreen', { sets, workTime, rest, bellInterv });
    }, 0);
  }

  return (
    <View style={{ flex: 1, resizeMode: "cover", justifyContent: "center", backgroundColor: "black" }}>
      {isFocused ? <StatusBar hidden={false} barStyle="light-content"/> : null} 
      <TouchableOpacity onPress={() => navigation.goBack()} style={{position: "absolute", top: height * 0.065, zIndex: 100, padding: 15}}>
        <Image source={require('../assets/screen-icons/back-arrow-white.png')} style={{height: 20, }} resizeMode="contain"/>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SavePresetScreen', { sets, workTime, rest })} style={{ position: "absolute", right: width * 0.05, top: height * 0.065, zIndex: 100, paddingBottom: 10, paddingTop: 10 }}>
        <Image source={require('../assets/screen-icons/gear-grey.png')} style={{height: 32, width: 60}} resizeMode="contain"/>
      </TouchableOpacity>
      <View style={{marginTop: 20}}>
        <Text style={{textAlign: "center", fontSize: 23, fontFamily: "Assistant-SemiBold", color: "#828282"}}>New Workout</Text>
        <View style={{flexDirection: "row", padding: 20}}>
          <View style={{backgroundColor: "black", flex: 1, height: height * 0.8, justifyContent: "space-around", alignItems: "center" }}>

            <View style={{alignItems: "center"}}>
              <Text style={{color: "#FFFFFF", fontSize: 32}}>{`${Math.floor(totalDuration / 60)}:${(totalDuration % 60) || "00"}`}</Text>
              <Text style={{color: "#828282", fontSize: 18}}>TOTAL DURATION</Text>
            </View>

            <View style={{width: width * 0.63, height: height * 0.45, justifyContent: "space-around", alignItems: "center"}}>
              <SliderComponent
                name="SETS"
                state={sets}
                maxValue={15}
                onChange={e => onChange(e, sets, setSets)}
              />
              <SliderComponent
                name="WORK TIME"
                state={workTime}
                maxValue={10}
                onChange={e => onChange(e, workTime, setWorkTime)}
              />
              <SliderComponent
                name="REST"
                state={rest}
                maxValue={10}
                onChange={e => onChange(e, rest, setRest)}
              />
            </View>

            <AppButton 
              title="START" 
              buttonStyles={styles.yellowButton}
              buttonTextStyles={styles.buttonText}
              onPress={startTimerExercise}
            />

          </View>
        </View>
      </View>
    </View>
  )
}

const SliderComponent = ({name, state, maxValue, onChange, }) => {
  return (
    <View style={{alignItems: "center"}}>
      <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: width * 0.8}}>
        <Text style={{fontFamily: "Assistant-SemiBold", fontSize: height < 600 ? 18 : 20, color: "#FFFFFF"}}>{name}</Text>
        <View style={{ height: 36, padding: 4, backgroundColor: "#333333", borderRadius: 8}}>
          <Text style={{ fontSize: height < 600 ? 20 : 22, color: "#FFFFFF", }}>{name === "SETS" ? state : `${Math.floor(state / 60)}:${(state % 60) || "00"}`}</Text>
        </View>
      </View>
      
      <Slider
        onValueChange={onChange}
        style={{width: width * 0.8, height: 40}}
        minimumValue={1}
        maximumValue={maxValue}
        value={name === "SETS" ? state : Math.floor(state / 60)}
        minimumTrackTintColor="#FAFF00"
        maximumTrackTintColor="#000000"
        step={1}
      />
    </View>
  )
};

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
    fontSize: 22,
    letterSpacing: 1,
    fontFamily: "Assistant-SemiBold"
  }
});