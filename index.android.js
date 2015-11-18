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
  ScrollView,
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
      <View style={{flex: 1}}>
        <Image source={require('./background.jpg')} resizeMode="cover" style={styles.backgroundImage} />
        <ToolbarAndroid title="ProjectAlpha" style={styles.toolbar}
                        actions={toolbarActions}
                        navIcon={require('./loogo.png')}
                        titleColor="#ffffff"
                        onActionSelected={this.onActionSelected} />

        <View style={styles.container}>

          <Text style={styles.header1}>
            Project Alpha
          </Text>

          <Text style={styles.header2}>
            Demo Application
          </Text>

        </View>

        <View style={styles.signin_container}>
          <TextInput placeholder="Email . . ." placeholderTextColor="#9f9f9f" keyboardType="email-address" style={styles.nameInput} onChangeText={(text) => this.setState({name: text})}  />

          <TouchableOpacity  onPress={this.clicked} style={styles.signin}>
            <View style={{flex: 1, alignItem: 'center', alignSelf: 'center', justifyContent: 'center'}}>
                <Icon name="sign-in" size={30} color="#ffffff" />
            </View>
          </TouchableOpacity>

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
          <Text style={{color: '#F59D92'}}>
            {rowData[1]}
          </Text>
          <Text style={styles.location}>
             {rowData[2]} - {rowData[3]}
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
      <View style={{flex: 1}}>
        <ToolbarAndroid title="ProjectAlpha" style={styles.toolbar}
                        actions={toolbarActions}
                        navIcon={require('./loogo.png')}
                        titleColor="#ffffff"
                        onActionSelected={this.onActionSelected} />
        <ScrollView style={{flex: 1}}>

          <ListView dataSource={this.state.nearby_users}
                    renderRow={this.renderUser} />
        </ScrollView>
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
  map: {
    height: 150,
    margin: 10,
    borderWidth: 1,
    borderColor: '#000000',
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
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
    //resizeMode: 'contain',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: null,
    height: null,
  },

  header1: {
    fontSize: 40,
    color: '#ffffff',
    fontWeight: "900",
    marginTop: 50,
  },
  header2: {
    fontSize: 16,
    color: '#d2d2d2',
    fontWeight: "400",

  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //alignSelf: 'stretch',

  },
  signin_container: {
    flex: 0,
    //justifyContent: 'center',
    alignItems: 'center',
    //alignSelf: 'flex-end',
    flexDirection: 'row',
  },

  nameInput: {
    flex: 0.8,
    color: '#2f2f2f',
    backgroundColor: '#ffffff',
    height: 50,
    flexDirection: 'row',
    alignSelf: 'center',
    //alignItems: 'flex-start',
  },

  signin: {
    alignSelf: 'center',
    flex: 0.2,
    height: 50,
    justifyContent: 'center',
    backgroundColor: "#BF0C43",
  }

});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
