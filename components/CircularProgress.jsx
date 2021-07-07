import React from "react";
import { Animated, View, StyleSheet } from "react-native";

import { withAnchorPoint } from "react-native-anchor-point";
import HalfCircle from "./HalfCircle";
import { PI, RADIUS } from "./Constants";


export default function CircularProgress({ workOrRest, percent, leftColor, rightColor, rotation }) {
  
  console.log(`${rotation}deg`)
  const getTransform = () => {
    let transform = {
        transform: [{ perspective: 100 }, ],
    };
    return withAnchorPoint(transform, { x: 0.5, y: 0.5 }, );
  };

  return(
    <>
      <View style={{ width: RADIUS * 2, flexDirection: "column", transform: [{ rotate: "270deg" }] }}>
        
        {/* Left half */}
        <View style={{ 
          transform: [
            { translateY: RADIUS / 2 },
            { rotate: percent > 0.5 ? "0deg" : `${-rotation + 180}deg` },
            { translateY: -RADIUS / 2 } 
          ],
          zIndex: percent > 0.5 ? 1 : -1
        }}>
          <HalfCircle workOrRest={workOrRest} percent={percent} color={leftColor} leftBorderColor={leftColor} rotation={"0deg"}/>
        </View>
        
        {/* Right half */}
        <View style={{ 
          transform: [
            { translateY: -RADIUS / 2 },
            { rotate: percent < 0.5 ? "0deg" : `${-rotation}deg` },
            { translateY: RADIUS / 2 } 
          ],
          zIndex: percent < 0.5 ? 1 : -1
        }}>
          <HalfCircle workOrRest={workOrRest} percent={percent} color={percent < 0.5 ? "black" : rightColor} rotation={"180deg"}/>
        </View>
        
      </View>
    </>
  )
};