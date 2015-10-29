/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var Subscribable = require('Subscribable');

var AndroidLocation = require('./ReactLocation');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  DeviceEventEmitter,
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

  },

    provider_status_changed: function(x) {
      this.setState({position: 'Status changed'});

  },

  componentWillMount: function() {
    console.log("init");

    this.addListenerOn(DeviceEventEmitter,
                       "location_changed",
                       this.location_changed);

    this.addListenerOn(DeviceEventEmitter,
                       "provider_status_changed",
                       this.provider_status_changed);

  },


  render: function() {

    return (
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
    );
  }
});

var styles = StyleSheet.create({
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
