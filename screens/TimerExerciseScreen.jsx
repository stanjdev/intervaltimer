import React, { useEffect, useState, useRef } from 'react';
import { Animated, Text, View, StatusBar, Alert, Vibration, Image, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import AppButton from '../components/AppButton';
import { useIsFocused } from '@react-navigation/native';
import { useKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import { useFonts } from 'expo-font';
import useInterval from '../hooks/useInterval';

import { Audio } from 'expo-av';

const { width, height } = Dimensions.get('window');

export default function TimerExerciseScreen({ route, navigation }) {
  useKeepAwake();
  const isFocused = useIsFocused();

  const [countOffDone, setCountOffDone] = useState(false);
  let [countOffNum, setCountOffNum] = useState(3);

  let [fontsLoaded] = useFonts({
    'Assistant': require('../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });
  
  const [ overlay, setOverlay ] = useState(true);
  const overlayFade = useRef(new Animated.Value(0)).current;

  const overlayFader = () => {
    Animated.timing(overlayFade, {
      toValue: overlay ? 1 : 0,
      duration: 200,
      useNativeDriver: true
    }).start();
  }; 

  const { sets, workTime, rest, bellInterv } = route.params;

  const [ workOrRest, setWorkOrRest ] = useState("work");
  const [ timerRunning, setTimerRunning ] = useState(true);
  const [ setsRemaining, setSetsRemaining ] = useState(sets);
  // const [ mins, setMins ] = useState(Math.floor(workTime / 60));
  // const [ secs, setSecs ] = useState(workTime % 60);

  // // SHORT 2 SEC TEST
  const [ mins, setMins ] = useState(0);
  const [ secs, setSecs ] = useState(2);

  // Add leading zero to numbers 9 or below (purely for aesthetics):
  function leadingZero(time) {
      if (time <= 9) {
          time = "0" + time;
      }
      return time;
  };
  

  // useInterval() ATTEMPT - ghetto, but works for the most part. once it hits 00:00, it still hits the else, and still runs every second. BUT DESTRUCTURING THE CLEAR() METHOD FROM USEINTERVAL FUNCTION AND CALLING THAT WORKS!
  // COUNTDOWN - useInterval()
  const runExerciseClock = () => {
    if (secs > 0) {
      setSecs(secs - 1);
    } else if (mins >= 1 && secs == 0) {
      setSecs(59);
      setMins(mins - 1);
    } else if (setsRemaining > 0) {
      // if still sets exist, continue with work/rest sets
      setSetsRemaining(setsRemaining - 1);
      if (workOrRest === "work") {
        setMins(Math.floor(rest / 60));
        setSecs(rest % 60);
        setWorkOrRest("rest")
      } else if (workOrRest === "rest") {
        setMins(Math.floor(workTime / 60));
        setSecs(workTime % 60);
        setWorkOrRest("work")
      }
    } else {
      // FINALLY FINISHED
      setWorkOrRest("complete");
      setTimerRunning(false);
      bellSound.unloadAsync();
      // console.log('else');
      loadFinishedSound(); // final 3 bells because of the 2 sec setTimeout below.
      clear();
      // deactivateKeepAwake();
      setTimeout(() => {
        finishedSound.unloadAsync(); // cuts off the sound
        bellSound.unloadAsync(); // 
        // navigation.navigate("MeditateTimerSetScreen");
      }, 6000);
    }
    console.log("sessionSecs: " + sessionSecs);
    setSessionSecs(sessionSecs => sessionSecs += 1);
  }





  // BELL SOUND - useInterval()  
  const bellSound = new Audio.Sound();
  Audio.setAudioModeAsync({
    playsInSilentModeIOS: true, 
    staysActiveInBackground: true,
    interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: true,
    allowsRecordingIOS: true,
    interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
  });

  const playBell = async () => await bellSound.replayAsync();
  const playBellFirst = async () => await bellSound.playAsync();

  const loadSound = async () => {
    try {
      await bellSound.loadAsync(require('../assets/audio/singing-bowl.mp3'));
      // bellInterv === null ? null : await bellSound.playAsync();
      console.log("load sound!");
    } catch (error) {
      console.log(error);
    }
    // // https://docs.expo.io/versions/latest/sdk/audio/?redirected#parameters
  }

  // FINISHED BELL SOUND
  const finishedSound = new Audio.Sound();
  Audio.setAudioModeAsync({playsInSilentModeIOS: true, staysActiveInBackground: true});

  const loadFinishedSound = async () => {
    try {
      await finishedSound.loadAsync(require('../assets/audio/meditation-finished-sound.mp3'));
      await finishedSound.playAsync()
      console.log("finished bell loaded!")
    } catch (error) {
      console.log(error);
    }
  }





  const countOff = () => {
    const threeTwoOne = setInterval(() => {
      setCountOffNum(countOffNum => countOffNum = countOffNum - 1)
    }, 1000);
    setTimeout(() => {
      setCountOffDone(true);
      clearInterval(threeTwoOne);
    }, 3000);
  };
  
  useEffect(() => {
    // MOUNT
    // loadSound();
    // playBellFirst();
    console.log("useEffect loadSound mounted/started!");
    console.log(bellInterv);
    toggleClock();
    countOff();
    setTimeout(() => {
      if (runningClock) {
        console.log("RUNNING CLOCK, Clock toggled!");
        toggleClock();
      } 
    }, 3000);

    // UNMOUNT
    return () => bellSound.unloadAsync();
  }, [])

  useEffect(() => {
    // UNMOUNT FINAL BELL
    return () => finishedSound.unloadAsync();
  }, [])

  const [toggleClock, runningClock, clear] = useInterval(() => {
    runExerciseClock();
  }, 1000);

  const [toggleBell, runningBell] = useInterval(() => {
    timerRunning ? loadSound() : null;
  }, bellInterv);

  const toggle = () => {
    toggleClock();
    bellInterv === null ? null : toggleBell();
    setTimerRunning(!timerRunning);
  }

  const [sessionSecs, setSessionSecs] = useState(0);

  const goBack = () => {
    // pause when this is pressed? 
    Alert.alert("Quit this workout?", "You will have to restart from the beginning if you exit.", [
      {text: "Go Back", style: "cancel", onPress: () => console.log("continued")}, 
      {text: "Quit", style: "cancel", onPress: () => navigation.navigate("TimerSetScreen")}
    ]);
  }

  const renderIntervalBalls = () => {
    let balls = [];
    for (let i = 0; i < sets; i++) {
      balls.push(<View key={i} style={{ borderColor: "#828282", height: 20, width: 20, borderRadius: 50, borderWidth: 2 }}></View>)
    }

    return balls;
  }


  return (
    <View style={{ flex: 1, resizeMode: "cover", position: "relative", zIndex: -10, backgroundColor: "#000000"}}>
      {isFocused ? <StatusBar hidden={false} barStyle="light-content"/> : null} 

      <View style={{ width: width, flexDirection: "row", alignItems: "center", marginTop: height * 0.07, position: "absolute", zIndex: 100 }}>
        <TouchableOpacity onPress={goBack} style={{ padding: 15}}>
          <Image source={require('../assets/screen-icons/back-arrow-white.png')} style={{height: 20, marginLeft: 0}} resizeMode="contain"/>
        </TouchableOpacity>
        <Text style={{textAlign: "center", fontSize: 20, fontFamily: "Assistant-SemiBold", color: "#828282", position: "absolute", zIndex: -1, width: width}}>LEG DAY #2</Text>        
      </View>

      <View style={{ justifyContent: "space-evenly", alignItems: "center", position: "absolute", height: height, width: width, marginTop: 25 }}>
        <View style={{flexDirection: "row", justifyContent: "space-around", width: width}}>
          <Text style={{ fontSize: 14, fontFamily: "Assistant-SemiBold", color: "#828282", }}>{sets} SETS</Text>
          <Text style={{ fontSize: 14, fontFamily: "Assistant-SemiBold", color: "#828282", }}>{`${Math.floor(workTime / 60)}:${workTime % 60 || "00"}`} WORK</Text>
          <Text style={{ fontSize: 14, fontFamily: "Assistant-SemiBold", color: "#828282", }}>{`${Math.floor(rest / 60)}:${rest % 60 || "00"}`} REST</Text>
        </View>
        
          {countOffDone ? 
          <View style={{alignItems: "center", padding: 30, borderColor: workOrRest == "work" ? "#FAFF00" : workOrRest == "rest" ? "#2D9CDB" : "#6FCF97", borderWidth: 9, borderRadius: 1000, height: 300}}>
            <Text style={{color: "#FFFFFF", fontSize: 41}}>{timerRunning && workOrRest == "work" ? "WORK" : timerRunning && workOrRest == "rest" ? "REST" : workOrRest == "complete" ? "WORKOUT COMPLETE" : "PAUSED"}</Text>
            <Text style={[ styles.timerText, timerRunning ? null : styles.timerStrikeThrough ]}>{workOrRest == "complete" ? null : `${leadingZero(mins)}:${leadingZero(secs)}`}</Text>
          </View>
          : 
          <View style={{alignItems: "center", padding: 30, borderWidth: 9, borderRadius: 1000, height: 300}}>
            <Text style={{color: "#FFFFFF", fontSize: 30}}>STARTING IN</Text>
            <Text style={{color: "#FAFF00", fontSize: 120 }}>{countOffNum}</Text>
          </View>
          }
        

          <View>
            <Text style={{ color: "#828282", fontSize: 20 }}>INTERVAL {`${sets - setsRemaining > 0 ? sets - setsRemaining : 1}/${sets}`}</Text>
            <View style={{ flexDirection: "row", width: width * 0.5, justifyContent: "space-between", marginTop: 15}}>
              {renderIntervalBalls()}
              {/* <View style={{ borderColor: "#FAFF00", backgroundColor: "#FAFF00", height: 20, width: 20, borderRadius: 50, borderWidth: 2 }}></View>
              <View style={{ borderColor: "#828282", height: 20, width: 20, borderRadius: 50, borderWidth: 2 }}></View>
              <View style={{ borderColor: "#828282", height: 20, width: 20, borderRadius: 50, borderWidth: 2 }}></View>
              <View style={{ borderColor: "#828282", height: 20, width: 20, borderRadius: 50, borderWidth: 2 }}></View> */}
            </View>
          </View>

          {
            countOffDone ? 
              <AppButton 
                title={timerRunning ? "PAUSE" : "Resume"}
                buttonStyles={[styles.button, timerRunning ? styles.greyButton : styles.yellowButton]}
                buttonTextStyles={[styles.buttonText, timerRunning ? styles.whiteText : styles.blacktext]}
                onPress={() => toggle()}
              />
            :
              <AppButton 
                title={""}
                buttonStyles={[styles.button]}
                onPress={() => console.log("countoff not finished")}
              />
          }

      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  button: {
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
  greyButton: {
    backgroundColor: "#4F4F4F",
  },
  yellowButton: {
    backgroundColor: "#FAFF00",
  },
  buttonText: {
    color: "#000",
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    letterSpacing: 1,
    fontFamily: "Assistant-SemiBold"
  },
  whiteText: {
    color: "#FFF"
  },
  blackText: {
    color: "#000"
  },
  timerText: {
    fontFamily: "Assistant-SemiBold", 
    color: "white", 
    fontSize: 100, 
  },
  timerStrikeThrough: { 
    textDecorationLine: "line-through",
    color: "#828282"
  }
});