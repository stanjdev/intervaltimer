import React, { useEffect, useState, useRef } from 'react';
import { Animated, Text, View, StatusBar, Alert, Vibration, Image, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import AppButton from '../components/AppButton';
import { useIsFocused } from '@react-navigation/native';
import { useKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import { useFonts } from 'expo-font';
import useInterval from '../hooks/useInterval';
import { LinearGradient } from 'expo-linear-gradient';

import { Audio } from 'expo-av';

const { width, height } = Dimensions.get('window');

export default function TimerExerciseScreen({ route, navigation }) {
  useKeepAwake();
  const isFocused = useIsFocused();

  const [countOffDone, setCountOffDone] = useState(false);
  const [countOffNum, setCountOffNum] = useState(3);

  let [fontsLoaded] = useFonts({
    'SourceCodePro-Regular': require('../assets/fonts/Source_Code_Pro/SourceCodePro-Regular.ttf'),
    'SourceCodePro-Medium': require('../assets/fonts/Source_Code_Pro/SourceCodePro-Medium.ttf'),
    'SourceCodePro-SemiBold': require('../assets/fonts/Source_Code_Pro/SourceCodePro-SemiBold.ttf'),
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
      console.log("sets remaining: ", setsRemaining);
      if (workOrRest === "work") {
        // setMins(Math.floor(rest / 60));
        // setSecs(rest % 60);
        
        // // SHORT 2 SEC TEST
        setMins(0);
        setSecs(2);

        setWorkOrRest("rest");
      } else if (workOrRest === "rest") {
        setSetsRemaining(setsRemaining - 1);
        // setMins(Math.floor(workTime / 60));
        // setSecs(workTime % 60);
        
        // // SHORT 2 SEC TEST
        setMins(0);
        setSecs(2);
        
        setWorkOrRest("work");
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
        setSetsRemaining(setsRemaining - 1);
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
    workOrRest === "complete" 
    ? 
    navigation.navigate("TimerSetScreen") 
    :
    Alert.alert("Quit this workout?", "You will have to restart from the beginning if you exit.", [
      {text: "Continue", style: "cancel", onPress: () => console.log("continued")}, 
      {text: "Quit", style: "cancel", onPress: () => navigation.navigate("TimerSetScreen")}
    ]);
  }


  let currentSet = sets - setsRemaining;
  // const [ currentSet, setCurrentSet ] = useState(sets - setsRemaining);


  const restart = () => {
    console.log(workTime, rest);
    console.log(bellInterv);

    // setCurrentSet(0);
    currentSet = 0;
    setSetsRemaining(sets);
    setWorkOrRest("work");
    
    // setMins(Math.floor(rest / 60));
    // setSecs(rest % 60);
    // setMins(Math.floor(workTime / 60));
    // setSecs(workTime % 60);

    setMins(0);
    setSecs(1);
    
    setCountOffDone(false);
    setCountOffNum(3);
    countOff();
    setTimeout(() => {
      if (runningClock) {
        setTimerRunning(true);
        console.log("RUNNING CLOCK, Clock toggled!");
        toggleClock();
        toggleClock();
        setSetsRemaining(sets - 1);
      } 
    }, 3000);
    
  }


  const renderIntervalBalls = () => {
    let balls = [];
    for (let i = 0; i < sets; i++) {
      balls.push(<View key={i} style={{ 
        borderColor: workOrRest === "complete" ? "#6FCF97" : i < currentSet - 1 ? "#828282" : i < currentSet && workOrRest == "work" ? "#FAFF00" : i < currentSet && workOrRest == "rest" ? "#2D9CDB" : "#828282", 
        backgroundColor: workOrRest === "complete" ? "#6FCF97" : i < currentSet - 1 ? "#828282" : i < currentSet && workOrRest == "work" ? "#FAFF00" : i < currentSet && workOrRest == "rest" ? "#2D9CDB" : null, 
        height: 20, 
        width: 20, 
        borderRadius: 50, 
        borderWidth: 2,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 3,
        marginBottom: 3,
      }}></View>)
      // console.log(i, currentSet, sets);
    }
    return balls;
  }

  /*
  
  0 1 2 3
  */


  return (
    <View style={{ flex: 1, resizeMode: "cover", position: "relative", zIndex: -10, backgroundColor: "#000000"}}>
      {isFocused ? <StatusBar hidden={false} barStyle="light-content"/> : null} 

      <View style={{ width: width, flexDirection: "row", alignItems: "center", marginTop: height < 700 ? 40 : height * 0.07, position: "absolute", zIndex: 100 }}>
        <TouchableOpacity onPress={goBack} style={{ padding: 15}}>
          <Image source={require('../assets/screen-icons/back-arrow-white.png')} style={{height: 20, marginLeft: 0}} resizeMode="contain"/>
        </TouchableOpacity>
        <Text style={[{textAlign: "center", fontSize: 20, color: "#828282", position: "absolute", zIndex: -1, width: width}, styles.sourceCodeProMedium]}>LEG DAY #2</Text>        
      </View>

      <View style={{ justifyContent: "space-evenly", alignItems: "center", height: height * 0.96, width: width, marginTop: 25 }}>
        <View style={{flexDirection: "row", justifyContent: "space-around", width: width, marginTop: height < 700 ? 50 : 25}}>
          <Text style={[{ fontSize: 14, color: "#828282", }, styles.sourceCodeProMedium]}>{sets} SETS</Text>
          <Text style={[{ fontSize: 14, color: "#828282", }, styles.sourceCodeProMedium]}>{`${Math.floor(workTime / 60)}:${workTime % 60 || "00"}`} WORK</Text>
          <Text style={[{ fontSize: 14, color: "#828282", }, styles.sourceCodeProMedium]}>{`${Math.floor(rest / 60)}:${rest % 60 || "00"}`} REST</Text>
        </View>
        
          {countOffDone ? 
          <View style={[styles.mainCircle, {
            borderColor: workOrRest == "work" ? "#FAFF00" : workOrRest == "rest" ? "#2D9CDB" : "#6FCF97",
            // backgroundColor: workOrRest == "work" ? "linear-gradient(347.78deg, #FAFF00 13.14%, rgba(250, 255, 0, 0) 87.81%);" : workOrRest == "rest" ? "#2D9CDB" : "#6FCF97",
          }]}>
            {/* <LinearGradient 
            colors={['#4c669f', '#3b5998', '#192f6a']} 
            start={{x: 0.2, y: 0.2}}
            end={{x: 0.5, y: 0.1}}
            locations={[0.5, 0.8]}
            style={{    
              height: 312, 
              width: 312
            }}> */}
              <Text style={[{color: "#FFFFFF", fontSize: workOrRest == "complete" ? 48 : 41, textAlign: "center"}, styles.sourceCodeProMedium]}>{timerRunning && workOrRest == "work" ? "WORK" : timerRunning && workOrRest == "rest" ? "REST" : workOrRest == "complete" ? "WORKOUT COMPLETE" : "PAUSED"}</Text>
              <Text style={[ styles.timerText, timerRunning ? null : styles.timerStrikeThrough ]}>{workOrRest == "complete" ? null : `${mins}:${leadingZero(secs)}`}</Text>
            {/* </LinearGradient> */}
          </View>
          : 
          <View style={{alignItems: "center", padding: 30, borderWidth: 9, borderRadius: 1000, height: 300}}>
            <Text style={[{color: "#FFFFFF", fontSize: 30}, styles.sourceCodeProMedium]}>STARTING IN</Text>
            <Text style={[{color: "#FAFF00", fontSize: 120}, styles.sourceCodeProMedium]}>{countOffNum}</Text>
          </View>
          }
        

          <View style={{alignItems: "center"}}>
            <Text style={[{ color: "#828282", fontSize: 20 }, styles.sourceCodeProMedium]}>INTERVAL {`${currentSet > 1 ? currentSet : 1}/${sets}`}</Text>
            <View style={{ 
              flexDirection: "row", 
              flexWrap: "wrap", 
              width: 122, 
              marginTop: 15,
              // justifyContent: "center",
              // borderColor: "orange", 
              // borderWidth: 1
            }}>
              {renderIntervalBalls()}
              {/* <View style={{ borderColor: "#FAFF00", backgroundColor: "#FAFF00", height: 20, width: 20, borderRadius: 50, borderWidth: 2 }}></View>
              <View style={{ borderColor: "#828282", height: 20, width: 20, borderRadius: 50, borderWidth: 2 }}></View>
              <View style={{ borderColor: "#828282", height: 20, width: 20, borderRadius: 50, borderWidth: 2 }}></View>
              <View style={{ borderColor: "#828282", height: 20, width: 20, borderRadius: 50, borderWidth: 2 }}></View> */}
            </View>
          </View>

          {
            countOffDone && workOrRest !== "complete" ? 
              <AppButton 
                title={timerRunning ? "PAUSE" : "Resume"}
                icon={timerRunning ? require('../assets/screen-icons/pause.png') : require('../assets/screen-icons/start.png')}
                iconStyles={{ height: 14, width: 12, }}
                buttonStyles={[styles.button, timerRunning ? styles.greyButton : styles.yellowButton]}
                buttonTextStyles={[styles.buttonText, timerRunning ? styles.whiteText : styles.blacktext]}
                onPress={() => toggle()}
              />
              : countOffDone && workOrRest == "complete" ? 
              <View style={{display: "flex", flexDirection: "row"}}>
                <AppButton 
                  title={"RESTART"}
                  buttonStyles={[styles.halfButton, styles.yellowButton]}
                  buttonTextStyles={[styles.buttonText, styles.blacktext]}
                  onPress={() => restart()}
                />
                <AppButton 
                  title={"FINISH"}
                  buttonStyles={[styles.halfButton, styles.greyButton]}
                  buttonTextStyles={[styles.buttonText, styles.whiteText]}
                  onPress={() => navigation.navigate("TimerSetScreen")}
                />
              </View>
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
  mainCircle: {
    alignItems: "center", 
    justifyContent: "center",
    padding: 30, 
    borderWidth: 9, 
    borderRadius: 1000, 
    height: 312, 
    width: 312
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
    shadowOffset: {width: 3, height: 3}
  },
  halfButton: {
    height: 47,
    width: width * 0.4,
    borderRadius: 8,
    marginLeft: 6,
    marginRight: 6,
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
    fontSize: 19,
    letterSpacing: 1,
    fontFamily: "SourceCodePro-Medium",
    textAlign: "center"
  },
  whiteText: {
    color: "#FFF"
  },
  blackText: {
    color: "#000"
  },
  timerText: {
    fontFamily: "SourceCodePro-Medium", 
    color: "white", 
    fontSize: 100,
    marginTop: -15
  },
  timerStrikeThrough: { 
    textDecorationLine: "line-through",
    color: "#828282"
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