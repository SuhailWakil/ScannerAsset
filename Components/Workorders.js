'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl
} from 'react-native';
import { NavigationActions } from 'react-navigation';

import { Icon, List, ListItem } from 'react-native-elements';
import {
  DotIndicator,
} from 'react-native-indicators';

import Moment from 'moment';
import renderIf from './renderIf';

export default class Workorders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: props.navigation.state.params.token,
      userName: props.navigation.state.params.userName,
      listOfRec: [],
      animating: true,
      refreshing: false
    };
  }

  componentDidMount () { 
    this._getAssignedRecordsAsync(); 
  } 
  _onRefresh() {
    this.setState({refreshing: true}, function(){
      this._getAssignedRecordsAsync(); 
    });
  }
  _showAssetList = (data) => {
    this.props.navigation.navigate('Assets', { token: this.state.token, recordId: data });
  }

  //Get UserAssignedRecords Async
  async _getAssignedRecordsAsync() {
      var data = {
        "token": this.state.token,
        "user": this.state.userName
      }
      this.setState({animating: true});
      fetch("https://bcmstaga.sdcounty.ca.gov/sowebservice/SOWebservice.asmx/UserAssignedRecords", {
         method: "POST",
         headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
         body:  JSON.stringify(data)
      })
      .then((response) => response.json())
      .then((responseData) => {
          var innerData = responseData.d;          
          var recArr = [];
          for( var i in innerData){
            var rData = {};
            rData.altId= innerData[i].altId,
            rData.notes= innerData[i].notes,
            rData.spclText= innerData[i].spclText
            rData.assignDate= innerData[i].assignDate
            recArr.push(rData)

            //STATES//
            this.setState({animating: false});
            this.setState({refreshing: false});
            
            this.setState({ listOfRec: recArr })
          }
        })
      .catch((error) => { 
          console.error(error);
      });
  }

  _logout= () => {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Login'})
      ]
    })
    this.props.navigation.dispatch(resetAction)
  }

  render() { 
    return (
      <View style={styles.container}>
          <View style={{flexDirection:"row"}}>
            <View style={{flex:3}}>
              <Text style={styles.welcomeText}> Welcome {this.state.userName}</Text>  
            </View>   
            <View style={{flex:1}}>
              <View style={styles.logoutIcon} >
                <Icon onPress={() => this._logout()} underlayColor='#5F514B' name='sign-out' type= 'octicon' color= '#fff' size= {30}/>
              </View>
            </View>
          </View>
          <ScrollView 
              contentContainerStyle={styles.contentContainer} 
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh.bind(this)}
                />
              }> 
              
              <List style={styles.subtitleView} containerStyle={{marginTop: 25, borderTopWidth: 0, borderBottomWidth: 0, borderBottomColor: '#cbd2d9'}}>
              {
                this.state.listOfRec.map((l, i) => (
                  <ListItem underlayColor='#5F514B' containerStyle={styles.listItem}
                    button onPress={() => this._showAssetList(l.altId)} 
                    key={i}
                    title={l.altId}
                    titleStyle={styles.listTitle}
                    roundAvatar
                    avatar={require('../assets/images/countygs.png') }
                    //leftIcon={{name: 'arrow-right', type: 'octicon', color: '#083045', size: 40 }}
                    subtitle={
                              <View style={styles.listSubView}>
                                <Text style={styles.splText}>{l.spclText}</Text>
                                <Text style={styles.rtText}>{Moment(l.assignDate).format('DD MMM YYYY')}</Text>
                              </View>
                            }
                  />
                ))
              }
              </List>  
            </ScrollView>
          
          {renderIf(this.state.animating,                       
              <DotIndicator
                style={styles.activityIndicator}
                size={8}
                count={3}
                color='#fff'
                animationDuration={1000}
              />
            )}
      </View>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5F514B',

  },
  listTitle:{
    color: '#ffffff',
  },
  welcomeText: {
    justifyContent: 'flex-start',
    fontSize: 20,
    paddingLeft: 25,
    paddingTop: 15,
    color: '#ffffff',
  },
  tableText: {
    justifyContent: 'flex-start',
    fontSize: 20,
    paddingLeft: 20,
    paddingTop: 20,
    color: '#5F514B',
    fontWeight: 'bold'
  },
  logoutIcon: {
    justifyContent: 'flex-end',
    paddingTop: 15,
    paddingRight: 5,
  },
  subtitleView: {
    paddingLeft: 10,
    paddingTop: 5
  },
  listSubView: {
    paddingTop: 5,
    paddingLeft: 10,
  },
  splText: {
    color: '#fff',
  },
  rtText: {
    alignSelf: 'flex-end',  
    color: '#fff',
    fontSize: 15,
    marginBottom: 5,
    marginTop: 5,
    marginRight: 20
  },
  listItem: {
    backgroundColor: '#5F514B',
    padding: 10,
    borderRadius: 0,
    borderBottomColor: '#666',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  activityIndicator: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'
   },
  contentContainer: {
    marginTop: 0
    //flex: 1,
    //paddingVertical: 20
  },
});

module.exports = Workorders;