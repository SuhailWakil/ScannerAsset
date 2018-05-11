import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  AsyncStorage,
  Platform,
  TextInput,
  TouchableHighlight,
  AlertIOS,
  ActivityIndicator,
} from 'react-native';


import { CheckBox, Button, Header, SocialIcon, Icon, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'; // 0.19.0
var styles = require('./LoginStyles.js');

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: '',
      token: '',
      isloggingIn: false,
      butLoading: false,
      errorMessage: '',
    };
  }

  componentDidMount () { 
    this._updateUNPW(); 
  } 

  async _updateUNPW () { 
    let userName = await AsyncStorage.getItem('userName'); 
    let password = await AsyncStorage.getItem('password'); 

    this.setState({userName: userName});
    this.setState({password:  password});
  } 

  async _onlogin(){    
    if(this.state.userName && this.state.password){
      this.setState({butLoading:  true});
      await AsyncStorage.setItem('userName', this.state.userName);
      await AsyncStorage.setItem('password', this.state.password);

      //API's
      var data = {
        "agency": "METS",
        "env": "STAGE",
        "usr": this.state.userName,
        "passwd": this.state.password
      }

      fetch("https://bcmstaga.sdcounty.ca.gov/sowebservice/SOWebservice.asmx/AuthenticateAccelaUser", {
         method: "POST",
         headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
         body:  JSON.stringify(data)
      })
      .then((response) => response.json())
      .then((responseData) => {
        if(responseData.d){
          //this.setState({token: responseData.d})
          //this.props.loggedIn(true, responseData.d, this.state.userName);
          this.props.navigation.navigate('Workorders', { token: responseData.d, userName: this.state.userName });
          this.setState({errorMessage: ""});

        }else{
          this.setState({errorMessage: "Authentication Failure"});
          
        }
        this.setState({butLoading:  false});
      })
      .catch((error) => { 
          AlertIOS.alert('Failure Logging In' + JSON.stringify(error))
      });

    }else if(!this.state.userName && !this.state.password){
      this.setState({errorMessage: "Enter User Name and password"});
    }else if(!this.state.userName){
      this.setState({errorMessage: "Enter User Name"});
    }else if(!this.state.password){
      this.setState({errorMessage: "Enter Password"});
    }  
  }

  render() { 
    return (
      <View style={styles.container}>
          <View style={styles.innerBot} >
              <TextInput 
                style={styles.textbox}
                placeholder = "User Name"
                placeholderTextColor = '#fff'
                autoCorrect = {false}
                onChangeText={(text) => this.setState({userName: text, errorMessage: ''})}
                value={this.state.userName}
              />
              <TextInput 
                style={styles.textbox}
                placeholder = "Password"
                autoCorrect = {false}
                secureTextEntry = {true}
                placeholderTextColor = '#fff'
                onChangeText={(text) => this.setState({password: text, errorMessage: ''})}
                value={this.state.password}
              />
              <FormValidationMessage labelStyle={styles.leftText}>{this.state.errorMessage}</FormValidationMessage>
              <ActivityIndicator animating={this.state.butLoading} size="large"/>   
              <TouchableHighlight
                style={styles.signin}
                onPress={() => this._onlogin(this)}
                disabled={this.state.butLoading}
                underlayColor='#3B5999'>
                  <Text style={styles.signinText}>Log in</Text>
              </TouchableHighlight>  
          </View>
      </View>

      
      )
  }
}


module.exports = Login;