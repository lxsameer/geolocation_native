/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;


exports.framework = 'React';
exports.title = 'Geolocation';
exports.description = 'Examples of using the Geolocation API.';

exports.examples = [
  {
    title: 'navigator.geolocation',
    render: function(): ReactElement {
      return <GeolocationExample />;
    },
  }
];

var AwesomeProject = React.createClass({
    getInitialState: function() {
        var that = this;
        console.log(navigator.geolocation.getCurrentPosition);
        navigator.geolocation.getCurrentPosition((initialPosition) => that.setState({initialPosition}));


    return {
      initialPosition: 'unknown',
      lastPosition: 'unknown',
    };
  },

    render: function() {

        var aaa = "sameer";
        return (
            <View style={styles.container}>
            <Text style={styles.welcome}>
            Welcome to React Native! {aaa}
            {JSON.stringify(this.state.initialPosition)}
            </Text>
            <Text style={styles.instructions}>
            To get started, edit index.android.js
            </Text>
            <Text style={styles.instructions}>
            Shake or press menu button for dev menu
            </Text>
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
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
