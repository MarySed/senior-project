/**
 * Copyright (c) 2017-present, Viro, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  ImageBackground,
  Image
} from "react-native";

import { ViroARSceneNavigator } from "react-viro";

// Device ID module --> to integrate see README

// import DeviceInfo from "react-native-device-info";
import makeNewUser from "./graphql/mutations";
import { userData, devices } from "./graphql/queries";
import clone from "./utils/clone";
const axios = require("axios");

var sharedProps = {
  apiKey: "API_KEY_HERE"
};

// Sets the default scene you want for AR and VR
var InitialARScene = require("./js/Tamamon1st");
var TamaMenu = require("./js/TamaMenu");

var UNSET = "UNSET";
var AR_NAVIGATOR_TYPE = "AR";
var TAMA_MENU_TYPE = "TAMA";

// This determines which type of experience to launch in, or UNSET, if the user should
// be presented with a choice of AR or VR. By default, we offer the user a choice.
var defaultNavigatorType = UNSET;

export default class ViroSample extends Component {
  constructor() {
    super();

    this.state = {
      navigatorType: defaultNavigatorType,
      sharedProps: sharedProps,
      // deviceID: DeviceInfo.getUniqueId(),
      wallet: 0,
      serverData: []
    };
    this._getExperienceSelector = this._getExperienceSelector.bind(this);
    this._getARNavigator = this._getARNavigator.bind(this);
    this._getTamaNavigator = this._getTamaNavigator.bind(this);
    this._getExperienceButtonOnPress = this._getExperienceButtonOnPress.bind(
      this
    );
    this._exitViro = this._exitViro.bind(this);
  }

  // componentDidMount() {
  //   const initalCall = async () => {
  //     console.log("calling");
  //     await axios({
  //       url: "https://tamomon.herokuapp.com/v1/graphql",
  //       method: "post",
  //       data: {
  //         query: devices()
  //       }
  //     }).then(result => {
  //       const deviceList = result.data.data.user_data;

  //       const deviceArray = [];

  //       deviceList.forEach(device => {
  //         deviceArray.push(device.device_id);
  //       });

  //       const exists = deviceArray.includes(this.state.deviceID);

  //       console.log("checking id");
  //       if (exists) {
  //         console.log("I exist!");
  //       } else {
  //         console.log("Time for a new ID");
  //         axios({
  //           url: "https://tamomon.herokuapp.com/v1/graphql",
  //           method: "post",
  //           data: {
  //             query: makeNewUser(this.state.deviceID)
  //           }
  //         }).then(result => {
  //           console.log("new row in DB", result);
  //         });
  //       }
  //     });
  //   };

  //   const updateCall = async () => {
  //     console.log("calling again");
  //     await axios({
  //       url: "https://tamomon.herokuapp.com/v1/graphql",
  //       method: "post",
  //       data: {
  //         query: userData(this.state.deviceID)
  //       }
  //     })
  //       .then(result => {
  //         const deviceData = clone(result.data.data.user_data_by_pk);
  //         this.state.serverData = deviceData.tamamons;
  //         this.state.wallet = deviceData.wallet;
  //         console.log("pre-update", result.data.data.user_data_by_pk);
  //       })
  //       .then(res => {
  //         const currentTime = new Date();
  //         Object.keys(this.state.serverData).map(key => {
  //           const lastModified = new Date(this.state.serverData[key].modified);
  //           const diff = (currentTime - lastModified) / (1000 * 60);
  //           if (diff > 60) {
  //             this.state.serverData[key].washed = false;
  //             this.state.serverData[key].played = false;
  //           }
  //           this.state.serverData[key].fedCount =
  //             Math.floor(diff / 60) > this.state.serverData[key].fedCount
  //               ? 0
  //               : this.state.serverData[key].fedCount - Math.floor(diff / 60);
  //           if (this.state.serverData[key].fedCount === 0) {
  //             this.state.serverData[key].fed = false;
  //           }
  //         });
  //         console.log("new state?", this.state.serverData);
  //       });
  //   };

  //   initalCall();
  //   updateCall();
  // }

  // Replace this function with the contents of _getVRNavigator() or _getARNavigator()
  // if you are building a specific type of experience.
  render() {
    if (this.state.navigatorType == UNSET) {
      return this._getExperienceSelector();
    } else if (this.state.navigatorType == AR_NAVIGATOR_TYPE) {
      return this._getARNavigator();
    } else if (this.state.navigatorType == TAMA_MENU_TYPE) {
      return this._getTamaNavigator();
    }
  }

  // Presents the user with a choice of an AR or VR experience
  _getExperienceSelector() {
    return (
      <View>
        <ImageBackground
          source={require("./js/res/images/Sprite-0001.gif")}
          style={{ width: "100%", height: "100%" }}
        >
          <View style={localStyles.inner}>
            <Image
              source={require("./js/res/images/logo.png")}
              style={localStyles.images}
            />
            <TouchableHighlight
              style={localStyles.buttons}
              onPress={this._getExperienceButtonOnPress(TAMA_MENU_TYPE)}
              underlayColor={"#68a0ff"}
            >
              <Text style={localStyles.buttonText}>START</Text>
            </TouchableHighlight>
          </View>
        </ImageBackground>
      </View>
    );
  }

  // Returns the ViroARSceneNavigator which will start the AR experience
  _getARNavigator() {
    return (
      <ViroARSceneNavigator
        {...this.state.sharedProps}
        initialScene={{ scene: InitialARScene }}
      />
    );
  }

  _getTamaNavigator() {
    return (
      // <ViroVRSceneNavigator {...this.state.sharedProps} initialScene={{scene: TamaMenu}} onExitViro={this._exitViro} />
      <TamaMenu></TamaMenu>
    );
  }
  // This function returns an anonymous/lambda function to be used
  // by the experience selector buttons
  _getExperienceButtonOnPress(navigatorType) {
    return () => {
      this.setState({
        navigatorType: navigatorType
      });
    };
  }

  // This function "exits" Viro by setting the navigatorType to UNSET.
  _exitViro() {
    this.setState({
      navigatorType: UNSET
    });
  }
}

var localStyles = StyleSheet.create({
  images: {
    marginTop: 150
  },
  viroContainer: {
    flex: 1,
    backgroundColor: "black"
  },
  inner: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center"
  },
  titleText: {
    paddingTop: 100,
    paddingBottom: 20,
    color: "#fff",
    textAlign: "center",
    fontSize: 25
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 20
  },
  buttons: {
    height: 80,
    width: 150,
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 100,
    marginBottom: 10,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#fff"
  },
  exitButton: {
    height: 50,
    width: 100,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#68a0cf",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff"
  }
});

module.exports = ViroSample;
