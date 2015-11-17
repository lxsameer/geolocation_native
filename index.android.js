'use strict';

import React from 'react-native';
import Subscribable from 'Subscribable';
import WS from 'ws';
import AndroidLocation from './ReactLocation';
import ToolbarAndroid from 'ToolbarAndroid';
import Icon from 'react-native-vector-icons/FontAwesome';

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  TextInput,
  TouchableOpacity,
  DeviceEventEmitter,
} = React;

var toolbarActions = [
  {title: 'Create', },
  {title: 'Filter'},
  {title: 'Settings'},
];

var AwesomeProject = React.createClass({
  mixins: [Subscribable.Mixin],

  getInitialState: function() {
    return {
      name: "",
      started: false,
      nearby_users: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      longitude: '-',
      latitude: '-',
      mapRegion: null,
      mapRegionInput: null,
      annotations: null,
      isFirstLoad: true,
    };
  },


  clicked: function() {
    AndroidLocation.getLocation(2000, 0);
    this.setState({started: true});
  },


  location_changed: function(x) {
    this.setState({
      longitude: x.longitude,
      latitude: x.latitude,
    });

    console.log('Sending latitude');
    packet = { command: 'my-position',
               latitude: x.latitude,
               longitude: x.longitude,
               user: this.state.name };

    data = JSON.stringify(packet);
    console.log(data);
    this.ws.send(data);
  },

  provider_status_changed: function(x) {
    console.log('prodiver state changed');
  },
  componentWillMount: function() {
    console.log("init");
  },

  componentDidMount: function() {
    console.log("Component did mount.");
    var that = this;

    this.ws = new WS('ws://192.168.1.7:4000/');

    this.ws.addEventListener('open', function() {
      console.log('sent');
    });

    this.ws.addEventListener('error', function(data) {
      console.log('error');
      console.log(data);
    });

    this.ws.addEventListener('message', function(e) {
      console.log('rec: --------');
      console.log(e.data);

      var users = JSON.parse(e.data);
      console.log(users);

      that.setState({
        nearby_users: that.state.nearby_users.cloneWithRows(users),
      });
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

  renderInputScreen: function() {
    return (
      <View>
      <ToolbarAndroid title="ProjectAlpha" style={styles.toolbar}
                      actions={toolbarActions}
                      navIcon={require('./loogo.png')}
                      titleColor="#ffffff"
                      onActionSelected={this.onActionSelected} />

      <View style={styles.container}>
        <View>
          <TextInput placeholder="Email" style={styles.nameInput} onChangeText={(text) => this.setState({name: text})}  />
        </View>

          <Icon.Button name="play" backgroundColor="#BF0C43" onPress={this.clicked}>
            Start
          </Icon.Button>

      </View>
      </View>
  )},

  renderUser: function(rowData, a, b) {
    console.log("#####");
    console.log(rowData);

    return (
      <View style={styles.row}>
        <View style={styles.avatar_container}>
          <Image style={styles.avatar}
                 source={{uri: 'http://www.gravatar.com/avatar/' + rowData[5]}} />
        </View>
        <View style={styles.details}>
          <Text style={styles.username}>
            {rowData[4]}
          </Text>
          <Text style={styles.location}>
            {rowData[1]} - {rowData[2]}
          </Text>
        </View>
      </View>
    );
  },

  onActionSelected: function(position) {
    if (position === 0) {
      //
    }
  },
  renderList: function() {
    return (
      <View>
        <ToolbarAndroid title="ProjectAlpha" style={styles.toolbar}
                        actions={toolbarActions}
                        navIcon={require('./loogo.png')}
                        titleColor="#ffffff"
                        onActionSelected={this.onActionSelected} />

        <ListView
          dataSource={this.state.nearby_users}
          renderRow={this.renderUser} />
      </View>
    )
  },

  render: function() {

    if (this.state.started) {
      return this.renderList();
    }
    else {
      return this.renderInputScreen();
    }
  }
});

var styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  avatar_container: {
    //flex: 0.2;
    padding: 5,
  },
  details: {
    flex: 1,
    paddingLeft: 5,
  },
  toolbar: {
    backgroundColor: '#e9eaed',
    height: 56,
    backgroundColor: '#8EAC00',


  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  username: {
    fontSize: 20,
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: '#bebebe',
  },
  nameInput: {
    flex: 0.2,
    //alignItems: 'flex-start',
  },
  map: {
    height: 150,
    margin: 10,
    borderWidth: 1,
    borderColor: '#000000',
  },

  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',

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
    backgroundColor: '#8EAC00',
    alignItems: 'center',
    flex: 0.2,
    padding: 20,
  },
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
