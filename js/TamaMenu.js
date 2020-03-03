"use strict";

import React, { Component } from "react";

import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  PixelRatio,
  TouchableHighlight,
  ImageBackground,
  Image,
} from "react-native";

import {
  ViroARSceneNavigator,
  ViroVRSceneNavigator,
  ViroScene
} from "react-viro";

const InitialARScene = require("./HelloWorldSceneAR");
const InitialARSceneForTama2nd = require("./Tamamon2nd");

const UNSET = "UNSET";
const AR_NAVIGATOR_TYPE = "AR";
const AR_NAVIGATOR_TYPE_2nd = "2nd";
const defaultNavigatorType = UNSET;

export default class TamaMenu extends Component {
  constructor() {
    super();

    this.state = {
      navigatorType: defaultNavigatorType,
    };

    this._getExperienceSelector = this._getExperienceSelector.bind(this);
    this._getARNavigator = this._getARNavigator.bind(this);
    this._getARNavigator2nd = this._getARNavigator2nd.bind(this);
    this._getExperienceButtonOnPress = this._getExperienceButtonOnPress.bind(
      this
    );
    this._exitViro = this._exitViro.bind(this);
  }

  render() {
    if (this.state.navigatorType == UNSET) {
      return this._getExperienceSelector();
    } else if (this.state.navigatorType == AR_NAVIGATOR_TYPE) {
      return this._getARNavigator();
    } else if (this.state.navigatorType == AR_NAVIGATOR_TYPE_2nd) {
      return this._getARNavigator2nd();
    }
  }

  _getExperienceSelector() {
    return (
      <View>
        <ImageBackground source={require('./res/images/background.png')} style={{width: '100%', height: '100%'}}>
        <View style={localStyles.inner}>
          <Text style={localStyles.titleText}>Tamamon List</Text>

          <TouchableHighlight
            onPress={this._getExperienceButtonOnPress(AR_NAVIGATOR_TYPE)}
            style={localStyles.buttons}
            underlayColor={"#68a0ff"}
          >
            <Image source={require('./res/images/icons/cat-1.png')} style={localStyles.images}/>
            
          </TouchableHighlight>

          <TouchableHighlight
            onPress={this._getExperienceButtonOnPress(AR_NAVIGATOR_TYPE_2nd)}
            style={localStyles.buttons}
            underlayColor={"#68a0ff"}
          >
            <Image source={require('./res/images/icons/cat-2.png')} style={localStyles.images}/>
          </TouchableHighlight>
        </View>
        </ImageBackground>
      </View>
    );
  }

  _getARNavigator() {
    return <ViroARSceneNavigator initialScene={{ scene: InitialARScene }} />;
  }
  _getARNavigator2nd() {
    return <ViroARSceneNavigator initialScene={{ scene: InitialARSceneForTama2nd }} />;
  }

  _getExperienceButtonOnPress(navigatorType) {
    return () => {
      this.setState({
        navigatorType: navigatorType,
      });
    };
  }

  _exitViro() {
    this.setState({
      navigatorType: UNSET
    });
  }
}
var localStyles = StyleSheet.create({
  images: {
    width: 80,
    height: 80,
  },
  viroContainer: {
    flex: 1,
    backgroundColor: "black"
  },
  inner: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
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
    height: 90,
    width: 150,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
    alignItems: "center",
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
module.exports = TamaMenu;
