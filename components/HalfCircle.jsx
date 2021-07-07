import React from "react";
import { View } from "react-native";

import { RADIUS } from "./Constants";

export default function HalfCircle ({ percent, workOrRest, color, leftBorderColor, rotation="0deg" }) {
  console.log(workOrRest)
  return(
    <View style={{
      height: RADIUS,
      width: RADIUS * 2,
      overflow: "hidden",
      // borderColor: "orange",
      // borderWidth: 1,
      transform: [
        { rotate: rotation },
      ],
    }}>
      <View style={{
        backgroundColor: color,
        borderWidth: 9, 
        borderColor: leftBorderColor ? leftBorderColor 
          : workOrRest == "work" && percent >= 0.5 ? "#FAFF00" 
          : workOrRest == "rest" && percent >= 0.5 ? "#2D9CDB" 
          : workOrRest == "complete" ? "#6FCF97" 
          : "#828282",
        width: RADIUS * 2,
        height: RADIUS * 2,
        borderRadius: RADIUS,
        // opacity: 0.7
      }}/>
    </View>
  )
};