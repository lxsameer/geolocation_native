/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

//var React        = require('react-native');
import React from 'react-native';

//var Subscribable = require('Subscribable');
import Subscribable from 'Subscribable';
import  WS from 'ws';

var AndroidLocation = require('./ReactLocation');
var ToolbarAndroid = require('ToolbarAndroid');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  DeviceEventEmitter,
//  ToolbarAndroid,
} = React;


var AwesomeProject = React.createClass({
  mixins: [Subscribable.Mixin],

  getInitialState: function() {
    return {
      longitude: '-',
      latitude: '-',
      position: '-',
      speed: '-',
      bearing: '-',
      altitude: '-',
    };
  },


  clicked: function() {
    AndroidLocation.getLocation(3000, 0);
    this.setState({position: 'Clicked'});
  },


  location_changed: function(x) {

    this.setState({
      longitude: x.longitude,
      latitude: x.latitude,
      bearing: x.bearing,
      speed: x.speed,
      altitude: x.altitude,
    });

    console.log('Sending latitude');
    this.ws.send('latitude: ' + x.latitude);
  },

    provider_status_changed: function(x) {
      this.setState({position: 'Status changed'});

  },

  componentWillMount: function() {
    console.log("init");
  },

  componentDidMount: function() {
    console.log("Component did mount.");
    var that = this;

    this.ws = new WS('ws://192.168.1.31:4000/');

    this.ws.addEventListener('open', function() {
      console.log('sent');
      that.setState({position: 'sent'});
      that.ws.send('something');
    });

    this.ws.addEventListener('message', function(e) {
      // a message was received
      console.log(e.data);
    });

    this.ws.addEventListener('close', function(e) {
      // connection closed
      console.log(e.code, e.reason);
    });

    this.addListenerOn(DeviceEventEmitter,
                       "location_changed",
                       this.location_changed);

    this.addListenerOn(DeviceEventEmitter,
                       "provider_status_changed",
                       this.provider_status_changed);

  },

  onActionSelected: function(position) {
    if (position === 0) {
      //showSettings();
    }
  },

  render: function() {

    return (
      <View>
      <ToolbarAndroid title="AwesomeApp" />

      <View style={styles.topNav}>
        <TextInput style={styles.nameInput} value={this.state.name} />
        <Text style={styles.startButton} onPress={this.start}>
          Start
        </Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Longitude: {this.state.longitude}
        </Text>
        <Text style={styles.welcome}>
          Latitude: {this.state.latitude}
        </Text>
        <Text style={styles.welcome}>
          Altitude: {this.state.altitude}
        </Text>
        <Text style={styles.welcome}>
          Speed: {this.state.speed}
        </Text>
        <Text style={styles.welcome}>
          Bearing: {this.state.bearing}
        </Text>

        <Text style={styles.welcome}>
          {this.state.position}
        </Text>
        <TouchableOpacity onPress={this.clicked}>
          <View style={styles.position_button}>
            <Text>
              Get Position
            </Text>
          </View>

        </TouchableOpacity>
      </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  topNav: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'row',

  },
  nameInput: {
    flex: 1,
    //alignItems: 'flex-start',
  },
  startButton: {
    flex: 0.25,
    //alignItems: 'flex-end',
    padding: 10,
    backgroundColor: '#009dcc',
    color: '#ffffff',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  position_button: {
    backgroundColor: '#009dcc',
    alignItems: 'center',
    padding: 20,
  },
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
