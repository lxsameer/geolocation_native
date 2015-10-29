/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var AndroidLocation = require('./ReactLocation');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} = React;


var AwesomeProject = React.createClass({
  getInitialState: function() {
    return {
      position: '-'
    };
  },

  success: function(position) {
    console.log(position);
    this.setState({position: 'I got it'});
  },

  clicked: function() {
    console.log('here');

    AndroidLocation.getLocation(3000, 1,
                                function(x){
                                  console.log("success");
                                  console.log(x);
                                },
                                function(x) {
                                  console.log("disabled");
                                  console.log(x);

                                },
                                function(x) {
                                  console.log("enabled");
                                  console.log(x);

                                },
                                function(x, y) {
                                  console.log("changed");
                                  console.log(x);
                                  console.log(y);
                                }
                               );

    this.setState({position: 'Hi'});
  },

  componentWillMount: function() {
    console.log("init");
  },

  render: function() {

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Position: {this.state.position}
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
