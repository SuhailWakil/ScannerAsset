
'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TouchableHighlight,
  TouchableOpacity,
  ListView,
  Image,
  KeyboardAvoidingView,
  AlertIOS,
  ActivityIndicator,
  ScrollView
} from 'react-native';

import { SwipeListView } from 'react-native-swipe-list-view';
import { Button, Header, Icon, FormLabel, FormInput, FormValidationMessage, List, ListItem } from 'react-native-elements';
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';

import Navigation from './Navigation';
import Scanner from './Scanner';
import Login from './Login';
import Moment from 'moment';
import renderIf from './renderIf';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      token: '',
      isloggedIn: false,
      showCamera: false,
      listOfAssetDataView: [],
      listOfRec: [],
      assetAdded: {},
      userName:'',
      recordId:'',
      tasks: true,
      assets: false,
      scan: false,
      item: false,
      login: true,
      animating: true,
      inserted: false,
      assetLookup: false,
      insertedText: ''
    };
  }
  
  componentDidMount () { 
  } 

  //Get UserAssignedRecords (set states first)
  _getAssignedRecords = (isloggedIn, token, userName) => {
    if(isloggedIn){
      //STATES//
      this.setState({
                    isloggedIn: isloggedIn,
                    token: token,
                    userName: userName
                  }, function(){
                      this._getAssignedRecordsAsync();
                  });
    }
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
            this.setState({ listOfRec: recArr })
          }
        })
      .catch((error) => { 
          console.error(error);
          AlertIOS.alert('Failure Logging In' + JSON.stringify(error))
      });
  }

  //Asset Details
  _getAssetDetails = (tag) => {
    const dataObj = {
        assetTag: tag,
        recid: this.state.recordId
      }
    //STATES//
    this.setState({
                    assetAdded: dataObj,
                    assets: false,
                    assetLookup: true,
                    item: true,
                  }, function(){
                    this._getAssetDetailsAsync();  
                  });
  }

  //On BarCode Scan
  _onCodeRead = (e) => {
    const dataObj = {
        assetTag: e.data,
        recid: this.state.recordId
      }
    //STATES//
    this.setState({
                    assetAdded: dataObj,
                    scan: false,
                    item: true,
                    assetLookup: false,
                  }, function(){
                    this._getAssetDetailsAsync();  
                  });
  }

  //On BarCode Scan
  _onCodeManual = (data) => {
    if(data){
        const dataObj = {
          assetTag: data,
          recid: this.state.recordId
        }
      //STATES//
      this.setState({
                      assetAdded: dataObj,
                      scan: false,
                      item: true,
                      assetLookup: false,
                    }, function(){
                      this._getAssetDetailsAsync();  
                    });
    }
  }


  //Get Asset Information
  async _getAssetDetailsAsync () {
      var data = {
        "token": this.state.token,
        "assetTagId": this.state.assetAdded.assetTag,
        "recID": this.state.assetAdded.recid, 
        "date": Moment().format('MM/DD/YYYY'),
        "userID": this.state.userName 
      }

      //STATES//
      this.setState({animating: true});
      
      fetch("https://bcmstaga.sdcounty.ca.gov/sowebservice/SOWebService.asmx/SetAssetDetails", {
         method: "POST",
         headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
         body:  JSON.stringify(data)
      })
      .then((response) => response.json())
      .then((responseData) => {
        if(responseData.d.length){
          var resultObj = responseData.d;
          var assetAddedObj = this.state.assetAdded
          assetAddedObj["assetId"] = this._getValueByKey('AssetID', resultObj) 
          assetAddedObj["name"] = this._getValueByKey('AssetName', resultObj)
          assetAddedObj["desc"] = this._getValueByKey('AssetDesc', resultObj)
          assetAddedObj["type"] = this._getValueByKey('AssetType', resultObj)  

          assetAddedObj["AssetStatus"] = this._getValueByKey('AssetStatus', resultObj)
          assetAddedObj["Area"] = this._getValueByKey('Area', resultObj)
          assetAddedObj["AssignedTo"] = this._getValueByKey('Assigned To', resultObj)
          assetAddedObj["Author"] = this._getValueByKey('Author', resultObj) 
          assetAddedObj["BuildingName"] = this._getValueByKey('Building Name', resultObj)
          assetAddedObj["Cost"] = this._getValueByKey('Cost', resultObj)
          assetAddedObj["DSGLocationCode"] = this._getValueByKey('DSG Location Code', resultObj)
          assetAddedObj["Department"] = this._getValueByKey('Department', resultObj) 
          assetAddedObj["Floor"] = this._getValueByKey('Floor', resultObj)
          assetAddedObj["FundNumber"] = this._getValueByKey('Fund Number', resultObj)
          assetAddedObj["HighOrg"] = this._getValueByKey('High Org', resultObj)
          assetAddedObj["InServiceDate"] = this._getValueByKey('In Service Date', resultObj) 
          assetAddedObj["OrgNumber"] = this._getValueByKey('Org Number', resultObj)
          assetAddedObj["Room"] = this._getValueByKey('Room', resultObj)
          assetAddedObj["HighOrg"] = this._getValueByKey('High Org', resultObj)
          assetAddedObj["TagNumber"] = this._getValueByKey('Tag Number', resultObj) 

          //STATES//
          this.setState({assetAdded: assetAddedObj});


        }else{
          var assetAddedObj = this.state.assetAdded
          assetAddedObj["assetId"] = ""
          //assetAddedObj["name"] = "Do you want to Submit?"
          assetAddedObj["desc"] = "Asset Not Found"

          //STATES//
          this.setState({assetAdded: assetAddedObj});

        }
        //STATES//
        this.setState({animating: false});
      })
      .done();
  }

  //Supporting method
  _getValueByKey(compare, data) {
      var i, len = data.length;
      for (i = 0; i < len; i++) {
          if (data[i] && data[i]['Name']==compare) {
              return data[i]['Value']+ '';
          }
      }
      return '';
  }

  //Submit Asset to Accela ASIT
   async _onAssetSubmit() {
    var data = {
        "token": this.state.token,
        "assetId": this.state.assetAdded.assetId,
        "assetTagId": this.state.assetAdded.assetTag,
        "recID": this.state.assetAdded.recid, 
        "date": Moment().format('MM/DD/YYYY'),
        "userID": this.state.userName ,
        "assetDesc": this.state.assetAdded.desc,
      }
      //STATES//
      this.setState({butLoading:  true});
      
      fetch("https://bcmstaga.sdcounty.ca.gov/sowebservice/SOWebService.asmx/AddToASIT", {
         method: "POST",
         headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
         body:  JSON.stringify(data)
      })
      .then((response) => response.json())
      .then((responseData) => {
          var result = responseData.d;
          if(result == '"ADDED"'){
            //STATES//
            this.setState({
                            inserted: true, 
                            insertedText:  'ASSET SIGHTED'
                          });  
          }else{
            //STATES//
            this.setState({
                            inserted: false,
                            insertedText:  'Something went wrong. Please try again!'
                          });  
          }
          //STATES//
          this.setState({butLoading:  false});
      })
      .done();
  }

  //Asset List for an Inventory Record
  _showAssetList = (data) => {
    //STATES//
    this.setState({
      recordId: data, 
      assets: true, 
      tasks: false,
      inserted: false,
      insertedText: '',
    }, function() {
        if(!this.state.assetLookup){
          this._showAssetListAsync();
        }
    });
  }
  
  //Get Async Asset List for an Inventory Record
  async _showAssetListAsync () {
    var data = {
        "token": this.state.token,
        "table": "INVENTORY",
        "recID": this.state.recordId
      }
      this.setState({animating: true});
      fetch("https://bcmstaga.sdcounty.ca.gov/sowebservice/SOWebservice.asmx/GetASITData", {
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
            rData.DateSighted= innerData[i].DateSighted,
            rData.SightedBy= innerData[i].SightedBy,
            rData.AssetTagID= innerData[i].AssetTagID
            rData.AssetID= innerData[i].AssetID
            rData.AssetDescription= innerData[i].AssetDescription
            recArr.push(rData)
          }

          var assetInfolist = recArr.slice(0).reverse().map(function(item) {
               return (
                <View style={{flex: 1}}>
                  <View style={{flex: 1}} >
                    <Text style={styles.listHeaderView}>Tag: {item['AssetTagID']}</Text>
                  </View>

                  <View style={{flexDirection:"row", flex: 1}} >
                    <View style={{flex: 1}} >
                      <Text style={styles.assetText}>{item['AssetID']}</Text>
                    </View>
                    <View style={{flex: 1}} >
                      <Text style={styles.rtText}>{item['SightedBy']} on {item['DateSighted']}</Text>
                    </View>
                  </View>
                  <View style={{flex: 3}} >
                    <Text style={styles.assetText}>{item['AssetDescription']}</Text>
                  </View>
                </View>
               );
           });   

           //STATES//
           this.setState({animating: false});
           this.setState({listOfAssetDataView: assetInfolist}); 
        })
      .catch((error) => { 
          console.error(error);
          AlertIOS.alert('Failure Logging In' + JSON.stringify(error))
      });
  }

  //Turn On Camera View to Scan
  _onScanButton = (data) => {
    this.setState({
        inserted: false,
        insertedText: '',
        scan: true,
        assets: false,
        item: false,
      }); 
  }
  
  //Cancel out of Camera View or Asset Detail View
  _handleCancel= () => {
    this.setState({scan: false,
                  assets: true,
                  inserted: false, 
                          
                }, function(){
                    this._showAssetListAsync() 
                  });
  }

  //Show Inventory Record List (Local)
  goToRecords = () => {
    this.setState({tasks: true});
    this.setState({assets: false});
    this.setState({scan: false});
    this.setState({assetLookup: false});
    this.setState({listOfAssetDataView: []}); 
  }
  
  //Logout
  _logout= () => {
    this.setState({isloggedIn: false});
    this.setState({token: ''});
    this.setState({isloggedIn: false});
    this.setState({showCamera: false});
    this.setState({listOfRec: []});
    this.setState({assetAdded: {}});
    this.setState({userName:''});
    this.setState({recordId:''});
    this.setState({tasks: true});
    this.setState({assets: false});
    this.setState({scan: false});
    this.setState({item: false});
    this.setState({login: true});

  }

  _renderMessage= () => {
        if (this.state.inserted) {
            return (
              <View style={styles.messageView}> 
                <Icon underlayColor='#F1F3F4' name='check-circle' type= 'FontAwesome' color= '#A2B86C' size= {40}/>
                <Text style={styles.insertText}>{this.state.insertedText}</Text>
              </View>
            )
        }
      }
  //Toggle Scan Button with Submit/Cancel Button
  _renderScanButtons= () => {
       if (!this.state.assetLookup) { 
        if (this.state.inserted) {
            return (
              <View style={styles.rowbuttons}>
                    <View style={{flex:1}}>
                      <Button
                        small 
                        onPress={this._handleCancel.bind(this)}
                        icon={{name: 'cancel', type: 'MaterialCommunityIcons' }}
                        title='CANCEL' />  
                    </View>
                    <View style={{flex:1}}>
                       <Button
                        small 
                        onPress={this._onScanButton.bind(this)}
                        icon={{name: 'device-camera', type: 'octicon' }}
                        title='SCAN' />  
                    </View>
                </View>    
            );
        } else {
            return (
                <View style={styles.rowbuttons}>
                    <View style={{flex:1}}>
                      <Button
                        small 
                        onPress={this._handleCancel.bind(this)}
                        icon={{name: 'cancel', type: 'MaterialCommunityIcons' }}
                        //style={styles.loginbuttonStyle}
                        title='CANCEL' />  
                    </View>
                    <View style={{flex:1}}>
                      <Button
                        small
                        onPress={this._onAssetSubmit.bind(this)}
                        loading={this.state.butLoading}
                        icon={{name: 'send', type: 'FontAwesome' }}
                        //style={styles.loginbuttonStyle}
                        title='SUBMIT' />  
                    </View>
                </View>    
            );
        }
      }
  }

  //Main Render
  render() {
    // Logged In
    if(this.state.isloggedIn) {
        //Show Inventory Records
        if (this.state.tasks){
          return (
            <View style={styles.container}>
                  <Navigation/>
                  <View >
                    <Text style={styles.tableText}>WORK ORDERS</Text>  
                  </View>  
                  <View style={{flexDirection:"row"}}>
                    <View style={{flex:3}}>
                      <Text style={styles.welcomeText}> Welcome {this.state.userName} </Text>  
                    </View>   
                    <View style={{flex:1}}>
                      <View style={styles.logoutIcon} >
                        <Icon onPress={() => this._logout()} underlayColor='#F1F3F4' name='sign-out' type= 'octicon' color= '#083045' size= {30}/>
                      </View>
                    </View>
                  </View>
                  <ScrollView contentContainerStyle={styles.contentContainer}> 
                    <List style={styles.subtitleView} containerStyle={{marginBottom: 20}}>
                    {
                      this.state.listOfRec.map((l, i) => (
                        <ListItem containerStyle={styles.listItem}
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
                        count={3}
                        color='#C2561A'
                        animationDuration={800}
                      />
                    )}
              </View>
          );
        } 
        //Show Assets per Record
        else if (this.state.assets){
          return (
              <View style={styles.container}>
                  <Navigation/>
                  <View >
                    <Text style={styles.tableText}> INVENTORY TABLE </Text>  
                  </View>  
                  <View style={styles.topView}> 
                    <Icon onPress={() => this.goToRecords()} underlayColor='#F1F3F4' name='arrow-left' type= 'octicon' color= '#083045' size= {40}/>
                    <Text style={styles.topText}>{this.state.recordId}</Text>
                  </View>
                  <SwipeListView
                        dataSource={this.ds.cloneWithRows(this.state.listOfAssetDataView)}
                        renderRow={ data => (
                          <TouchableOpacity
                            onPress={ _ => this._getAssetDetails(data.props.children[0].props.children.props.children[1]) }
                            style={styles.rowFront}
                            underlayColor={'#F1F3F4'}
                          >
                            <View style={styles.rowFront}>
                              {data}
                            </View>
                           </TouchableOpacity> 
                        )}
                        enableEmptySections={true}
                    /> 
                    <Button
                      small
                      onPress={this._onScanButton.bind(this)}
                      icon={{name: 'device-camera', type: 'octicon' }}
                      style={styles.loginbuttonStyle}
                      title='SCAN ASSET' />

                      {renderIf(this.state.animating,                       
                          <DotIndicator
                          style={styles.activityIndicator}
                          count={3}
                          color='#C2561A'
                          animationDuration={800}
                        />
                      )}

                </View>
            );
        }
        //Show Scanner
        else if (this.state.scan){
          return (
            <View style={styles.container}>
              <View style={styles.rectangleContainer}>
                <Scanner recordId={this.state.recordId} onBarcodeRead={this._onCodeRead} onBarcodeManual={this._onCodeManual} onCancel={this._handleCancel}/>
              </View> 
            </View>
          );
        }
        //Show Asset Details
        else{
          return (
              <View style={styles.container}>
                  <Navigation/>
                  <View >
                    <Text style={styles.tableText}>ASSET DETAILS </Text>  
                  </View> 
                  <View style={styles.topView}> 
                    <Icon onPress={() => this._showAssetList(this.state.recordId)} underlayColor='#F1F3F4' name='arrow-left' type= 'octicon' color= '#083045' size= {40}/>
                    <Text style={styles.topText}>{this.state.recordId}</Text>
                  </View>
                    
                  <View style={{flex: 1}} >
                        {renderIf(this.state.inserted, 
                                <View style={styles.topMessage}>{this._renderMessage()}</View>
                        )}
                      
                        <View style={{flex: 10}}>
                          <ScrollView>
                            <Text style={styles.scanTitleTextResult}><Text style={{fontWeight:'bold'}}>Scanned Tag: </Text>{this.state.assetAdded.assetTag}</Text>
                            
                            {renderIf(this.state.assetAdded.assetId, 
                                <Text style={styles.scanTitleTextResult}><Text style={{fontWeight:'bold'}}>Asset ID:</Text> {this.state.assetAdded.assetId} </Text>
                            )}
                            {renderIf(this.state.assetAdded.name, 
                                <Text style={styles.scanTitleTextResult}><Text style={{fontWeight:'bold'}}>Name:</Text> {this.state.assetAdded.name} </Text>
                            )}
                            {renderIf(this.state.assetAdded.desc, 
                                <Text style={styles.scanTitleTextResult}><Text style={{fontWeight:'bold'}}>Description: </Text>{this.state.assetAdded.desc} </Text>
                            )}
                            {renderIf(this.state.assetAdded.AssetStatus, 
                                <Text style={styles.scanTitleTextResult}><Text style={{fontWeight:'bold'}}>Status:</Text> {this.state.assetAdded.AssetStatus} </Text>
                            )}
                            {renderIf(this.state.assetAdded.AssignedTo, 
                                <Text style={styles.scanTitleTextResult}><Text style={{fontWeight:'bold'}}>Assigned To: </Text>{this.state.assetAdded.AssignedTo} </Text>
                            )}
                            {renderIf(this.state.assetAdded.BuildingName, 
                                <Text style={styles.scanTitleTextResult}><Text style={{fontWeight:'bold'}}>Building Name: </Text>{this.state.assetAdded.BuildingName} </Text>
                            )}
                            {renderIf(this.state.assetAdded.Cost, 
                                <Text style={styles.scanTitleTextResult}><Text style={{fontWeight:'bold'}}>Cost: </Text>{this.state.assetAdded.Cost} </Text>
                            )}
                            {renderIf(this.state.assetAdded.DSGLocationCode, 
                                <Text style={styles.scanTitleTextResult}><Text style={{fontWeight:'bold'}}>DSG Location Code: </Text>{this.state.assetAdded.DSGLocationCode} </Text>
                            )}
                            {renderIf(this.state.assetAdded.Department, 
                                <Text style={styles.scanTitleTextResult}><Text style={{fontWeight:'bold'}}>Department: </Text>{this.state.assetAdded.Department} </Text>
                            )}
                            {renderIf(this.state.assetAdded.HighOrg, 
                                <Text style={styles.scanTitleTextResult}><Text style={{fontWeight:'bold'}}>High Org: </Text>{this.state.assetAdded.HighOrg} </Text>
                            )}
                            {renderIf(this.state.assetAdded.FundNumber, 
                                <Text style={styles.scanTitleTextResult}><Text style={{fontWeight:'bold'}}>Fund Number: </Text>{this.state.assetAdded.FundNumber} </Text>
                            )}
                            {renderIf(this.state.assetAdded.Floor, 
                                <Text style={styles.scanTitleTextResult}><Text style={{fontWeight:'bold'}}>Floor: </Text>{this.state.assetAdded.Floor} </Text>
                            )}
                            {renderIf(this.state.assetAdded.InServiceDate, 
                                <Text style={styles.scanTitleTextResult}><Text style={{fontWeight:'bold'}}>In Service Date: </Text>{this.state.assetAdded.InServiceDate} </Text>
                            )}
                            {renderIf(this.state.assetAdded.Room, 
                                <Text style={styles.scanTitleTextResult}><Text style={{fontWeight:'bold'}}>Room: </Text>{this.state.assetAdded.Room} </Text>
                            )}
                          </ScrollView>
                        </View>
                        {this._renderScanButtons()}
                        
                   </View> 
                   {renderIf(this.state.animating,                       
                        <DotIndicator
                        style={styles.activityIndicator}
                        count={3}
                        color='#C2561A'
                        animationDuration={800}
                      />
                    )}
            </View>

          );
        }
    }
    // Login 
    else {
      return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <View style={styles.container}>
              <Navigation/>
              <View style={styles.rectangleContainer}>
                <Image
                  style={{
                      alignSelf: 'center',
                      height: 150,
                      width: 150,
                      borderWidth: 0,
                      borderRadius: 75
                  }}
                  source={require('../assets/images/countygs.png')}
                  resizeMode="stretch"
                />
              </View>
                <Login loggedIn={this._getAssignedRecords}/>
            </View>
          </KeyboardAvoidingView>
        );
    }
    
  }
}


const styles = StyleSheet.create({
  containerStyle: {
        marginTop: 10,
    },
  container: {
    flex: 1,
    backgroundColor: '#F1F3F4',

  },
  welcome: {
      marginTop: 35,
      fontSize: 35,
      textAlign: 'center',
      color: '#050505',
  }, 
  listTitle:{
    color: '#050505',
  },
  scannedText: {
      marginTop: 0,
      fontSize: 20,
      textAlign: 'center'
  },
  scannedTextSmall: {
      marginTop: 0,
      fontSize: 15,
      textAlign: 'left',
  },
  assetText: {
      color: 'grey',
      marginBottom: 5,
      marginLeft: 20,
      marginTop: 5,
    },
  middleText:{
      color: '#333333',
      fontSize: 30,
      marginRight: 20,
      marginLeft: 20,
      textAlign: 'center'
  },
  rectangleContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
  },
  rectangle: {
      width: 250,
      borderWidth: 2,
      borderColor: '#00FF00',
      backgroundColor: 'transparent',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#C02E1D',
  },
  topView: {
    flexDirection:"row",
    paddingLeft: 20,
  },
  topMessage: {
    flexDirection:"row"
  },
  buttonText: {
    padding: 20,
    fontSize: 20,
    color: '#fff',
  },
  topText: {
    padding: 20,
    fontSize: 20,
  },
  insertText: {
    padding: 10,
    fontSize: 20,
    fontWeight: 'bold'
  },
  welcomeText: {
    justifyContent: 'flex-start',
    fontSize: 20,
    paddingLeft: 15,
    paddingTop: 15
  },
  tableText: {
    justifyContent: 'flex-start',
    fontSize: 20,
    paddingLeft: 20,
    paddingTop: 20,
    color: '#C2561A',
    fontWeight: 'bold'
  },
  logoutIcon: {
    justifyContent: 'flex-end',
    paddingTop: 15,
    paddingRight: 5,
  },
  rowFront: {
    alignItems: 'stretch',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
    justifyContent: 'center',
    flex: -1,
  },
  rowBack: {
    alignItems: 'stretch',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  subtitleView: {
    paddingLeft: 10,
    paddingTop: 5
  },
  listSubView: {
    paddingTop: 5,
    paddingLeft: 10,
  },
  listHeaderView: {
    paddingLeft: 20,
    paddingTop: 10,
    fontSize: 16,
    color: '#050505',
  },
  scanTitleText: {
    fontSize: 20,
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  scanTitleTextResult: {
    fontSize: 17,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    color: 'grey',
  },
  insertedText: {
    fontSize: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 30,
  },

  splText: {
    color: 'grey',
  },
  rtText: {
    alignSelf: 'flex-end',  
    color: 'grey',
    fontSize: 15,
    marginBottom: 5,
    marginTop: 5,
    marginRight: 20
  },
  headerText: {
    textAlign: 'center',
    fontSize: 30,
    padding: 20,
    backgroundColor: 'grey',
  },
  
  listItem: {
    backgroundColor: '#F1F3F4',
    padding: 10,
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
   loginbuttonStyle: {
      padding: 20,
  },
  logoutbuttonStyle: {
      backgroundColor: '#F1F3F4',
      borderRadius: 10,

  },
  rowbuttons: {
      alignItems: 'flex-end',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 20,
  },
  messageView: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection:"row",
    paddingLeft: 20,
  },
  contentContainer: {
    //flex: 1,
    //paddingVertical: 20
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: .1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: 'grey',
    padding: 20,

  },
  overlay1: {
    padding: 20,

  }
  
});
