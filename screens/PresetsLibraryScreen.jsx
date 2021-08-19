import React, { useEffect } from 'react';
import { Text, View, Alert, StyleSheet, StatusBar, Dimensions, ImageBackground, TouchableOpacity, Image, ScrollView, TouchableWithoutFeedback} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import AppButton from '../components/AppButton';
const { width, height } = Dimensions.get('window');
const bgImage = require('../assets/splash/splash-screen-ellipse.png');
import PresetButton from '../components/PresetButton';
const trashcan = require('../assets/screen-icons/trashcan.png');

import { SwipeListView } from 'react-native-swipe-list-view';

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

  const myData = [
    {
      key: "1",
      name: "LEG DAY #2"
    }, {
      key: "2",
      name: "FRIDAY HIIT"
    }, {
      key: "3",
      name: "SLOW CHEST WORKOUT"
    }, {
      key: "4",
      name: "LEG DAY #2"
    }, {
      key: "5",
      name: "FRIDAY HIIT"
    }, {
      key: "6",
      name: "SLOW CHEST WORKOUT"
    }, {
      key: "7",
      name: "LEG DAY #2"
    }, {
      key: "8",
      name: "FRIDAY HIIT"
    }, {
      key: "9",
      name: "SLOW CHEST WORKOUT"
    }
  ];

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) rowMap[rowKey].closeRow();
  };

  const deleteItem = () => {
    Alert.alert("DEKLETLKEJ?", "You will have to restart from the beginning if you exit.", [
      {text: "Delete", style: "cancel", onPress: () => console.log("delte butteon")}, 
      {text: "Cancel", style: "cancel", onPress: () => console.log("continued")}
    ]);
  };

  const renderFrontItem = (data, i) => (
    <View>
      <PresetButton key={data.item.name} presetName={data.item.name} onPress={() => console.log(data.item.name)}/>
    </View>
  );

  const renderHiddenItem = (data, rowMap) => (
    <TouchableWithoutFeedback onPress={deleteItem}>
      <View style={styles.rowBack}>
        <View style={{alignSelf: "flex-end", alignItems: "center", marginRight: 27 }}>
          <Image source={trashcan} style={{ height: 20, width: 20 }} resizeMode="contain"></Image>
          <Text style={[ styles.sourceCodeProMedium, { fontSize: 12, color: "white" }]}>DELETE</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );


  return (
    <View style={styles.container}>
      <StatusBar hidden={true}/>

      <View style={{ width: width, flexDirection: "row", alignItems: "center", marginTop: height < 700 ? 40 : height * 0.07, position: "absolute", zIndex: 100 }}>
        <TouchableOpacity onPress={goBack} style={{ padding: 15}}>
          <Image source={require('../assets/screen-icons/back-arrow-white.png')} style={{height: 20, marginLeft: 0}} resizeMode="contain"/>
        </TouchableOpacity>
        <Text style={[{textAlign: "center", fontSize: 20, color: "#E0E0E0", position: "absolute", zIndex: -1, width: width}, styles.sourceCodeProMedium]}>SAVED PRESETS</Text>        
      </View>


      <View style={{ alignItems: "center", marginTop: height * 0.17, marginBottom: height * 0.05 }}>
        <SwipeListView
          data={myData}
          renderItem={renderFrontItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-95}
          leftOpenValue={0}
          previewRowKey={'0'}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          disableRightSwipe={true}
          // onRowOpen={rowKey => console.log(`opened ${rowKey}`)}
        />
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



      {/* OLD WAY, SHOW Programmatically rendered PRESETS: */}
      {/* <ScrollView
        // scrollEnabled={!swipeDeleteOpened}
      >
        <View style={{ alignItems: "center", marginTop: height * 0.17, marginBottom: height * 0.05 }}>
          <PresetButton presetName="LEG DAY #2" onPress={() => console.log("OFIDSJf")}/>
          <PresetButton presetName="FRIDAY HIIT" onPress={() => console.log("OFIDSJf")}/>
          <PresetButton presetName="SLOW CHEST WORKOUT" onPress={() => console.log("OFIDSJf")}/>
          <PresetButton presetName="STRETCH ROUTINE" onPress={() => console.log("OFIDSJf")}/>
          <PresetButton presetName="STRETCH ROUTINE" onPress={() => console.log("OFIDSJf")}/>
          <PresetButton presetName="STRETCH ROUTINE" onPress={() => console.log("OFIDSJf")}/>
          <PresetButton presetName="STRETCH ROUTINE" onPress={() => console.log("OFIDSJf")}/>
          <PresetButton presetName="STRETCH ROUTINE" onPress={() => console.log("OFIDSJf")}/>
          <PresetButton presetName="STRETCH ROUTINE" onPress={() => console.log("OFIDSJf")}/>
          <PresetButton presetName="STRETCH ROUTINE" onPress={() => console.log("OFIDSJf")}/>
          <PresetButton presetName="STRETCH ROUTINE" onPress={() => console.log("OFIDSJf")}/>
        </View>
      </ScrollView> */}


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
  },
  rowBack: {
    backgroundColor: 'maroon',
    height: 90,
    width: width * 0.8,
    alignSelf: "flex-end",
    borderRadius: 8,
    justifyContent: "center",
    marginTop: 7,
    marginBottom: 7
  }
});