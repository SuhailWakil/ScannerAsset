import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableHighlight,
  ScrollView,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';
import { Icon, FormInput} from 'react-native-elements'; // 0.19.0

import Camera from 'react-native-camera'; // 0.13.0
import Moment from 'moment'; // 2.20.1

import renderIf from './renderIf';
import {
  DotIndicator,
} from 'react-native-indicators'; // 0.10.0

export default class Scanner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: props.navigation.state.params.token,
      recordId: props.navigation.state.params.recordId,
      userName: '',
      showCamera: true,
      cameraType: Camera.constants.Type.back,
      //recordId: this.props.recordId,
      AssetTagID: '',
      assetDetail: {},
      inserted: false,
      insertedText: '',
      butLoading: false,
    };
  }
  componentDidMount () { 
    this._updateUN(); 
  } 
  
  async _updateUN () { 
    let userName = await AsyncStorage.getItem('userName'); 
    this.setState({userName: userName});
    
  } 

  onFocusChanged(e){
    console.log('focused!');
  }

  onBarcodeManual = () => {
    this.setState({showCamera: false},
      function(){
        this._getAssetDetailsAsync();
        }
      );
  }

  _onBarCodeRead  = (e) => {
    this.setState({showCamera: false, AssetTagID: e.data},
      function(){
        this._getAssetDetailsAsync();
        }
      );
  }

  async _getAssetDetailsAsync () {
      var data = {
        "token": this.state.token,
        "assetTagId": this.state.AssetTagID,
      }
      //STATES//
      this.setState({animating: true});
      
      fetch("https://bcmstaga.sdcounty.ca.gov/sowebservice/SOWebService.asmx/GetAssetDetails", {
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
          var assetDetailObj = {}//this.state.assetDetail
          assetDetailObj["assetTag"] = this.state.AssetTagID;
          assetDetailObj["assetId"] = this._getValueByKey('AssetID', resultObj) 
          assetDetailObj["AssetSeqNo"] = this._getValueByKey('AssetSeqNo', resultObj) 
          assetDetailObj["name"] = this._getValueByKey('AssetName', resultObj)
          assetDetailObj["desc"] = this._getValueByKey('AssetDesc', resultObj)
          assetDetailObj["type"] = this._getValueByKey('AssetType', resultObj)  
          assetDetailObj["AssetStatus"] = this._getValueByKey('AssetStatus', resultObj)
          assetDetailObj["Area"] = this._getValueByKey('Area', resultObj)
          assetDetailObj["AssignedTo"] = this._getValueByKey('Assigned To', resultObj)
          assetDetailObj["Author"] = this._getValueByKey('Author', resultObj) 
          assetDetailObj["BuildingName"] = this._getValueByKey('Building Name', resultObj)
          assetDetailObj["Cost"] = this._getValueByKey('Cost', resultObj)
          assetDetailObj["DSGLocationCode"] = this._getValueByKey('DSG Location Code', resultObj)
          assetDetailObj["Department"] = this._getValueByKey('Department', resultObj) 
          assetDetailObj["Floor"] = this._getValueByKey('Floor', resultObj)
          assetDetailObj["FundNumber"] = this._getValueByKey('Fund Number', resultObj)
          assetDetailObj["HighOrg"] = this._getValueByKey('High Org', resultObj)
          assetDetailObj["InServiceDate"] = this._getValueByKey('In Service Date', resultObj) 
          assetDetailObj["OrgNumber"] = this._getValueByKey('Org Number', resultObj)
          assetDetailObj["Room"] = this._getValueByKey('Room', resultObj)
          assetDetailObj["HighOrg"] = this._getValueByKey('High Org', resultObj)
          assetDetailObj["TagNumber"] = this._getValueByKey('Tag Number', resultObj) 

          //STATES//
          this.setState({assetDetail: assetDetailObj});
          
        }else{
          var assetDetailObj = {}
          assetDetailObj["assetId"] = ""
          assetDetailObj["AssetSeqNo"] = ""
          assetDetailObj["desc"] = "Asset Not Found"
          //STATES//
          this.setState({assetDetail: assetDetailObj});
        }
        this.setState({animating: false});
        this.setState({butLoading:  false});
        //alert(JSON.stringify(this.state.assetDetail))

      })
      .done();
  }
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
        "assetId": this.state.assetDetail.assetId,
        "assetSeqNo": this.state.assetDetail.AssetSeqNo,
        "assetTagId": this.state.AssetTagID, 
        "recID": this.state.recordId, 
        "date": Moment().format('MM/DD/YYYY'),
        "userID": this.state.userName ,
        "assetDesc": this.state.assetDetail.desc,
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
                            insertedText:  'ASSET SIGHTED',
                          }); 
          }else{
            //STATES//
            this.setState({
                            inserted: false,
                            insertedText:  'Something went wrong. Please try again!',
                          });
          }
          //STATES//
          this.setState({butLoading:  false});
      })
      .done();
  }
  _renderScanButtons= () => {
        if (this.state.inserted) {
            return (
              
                    <View style={{flex:1}}>
                      <TouchableHighlight
                        style={styles.scan}
                        onPress={this._onScanButton.bind(this)}
                        disabled={this.state.butLoading}
                        underlayColor='#3B5999'>
                          <Text style={styles.scanText}>SCAN</Text>
                      </TouchableHighlight>
                    </View>
              
            );
        } else {
            return (
                    <View style={{flex:1}}>
                      <TouchableHighlight
                        style={styles.scan}
                        onPress={this._onAssetSubmit.bind(this)}
                        disabled={this.state.butLoading}
                        underlayColor='#3B5999'>
                          <Text style={styles.scanText}>SUBMIT</Text>
                      </TouchableHighlight>
                    </View>
              
            );
        }
      
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

  _onScanButton = () => {
    this.setState({
        showCamera: true,
        insertedText: '',
        assetDetail: {},
        inserted: false,
        AssetTagID: '',
      }); 
  }
  render() { 
      if(this.state.showCamera) {
        return (
            <View style={styles.rectangleContainer}>
              <Camera
                  ref="cam"
                  defaultOnFocusComponent={true}
                  onFocusChanged={this.onFocusChanged.bind(this)}
                  style={styles.camera}
                  onBarCodeRead={this._onBarCodeRead}
                  type={this.state.cameraType}>
              </Camera>

              <View style={styles.topOverlay} />
              <View style={styles.leftOverlay} />
              <View style={styles.rightOverlay} />
              <View style={styles.bottomOverlay} />
              <View style={styles.topLeftCorner} />
              <View style={styles.topRightCorner} />
              <View style={styles.bottomLeftCorner} />
              <View style={styles.bottomRightCorner} />

              <View style={styles.header}>
                  <View style={styles.manualAssetTag} >
                    <FormInput autoCorrect={false}
                          keyboardType='default'
                          returnKeyType='search'
                          placeholder='Asset Tag ...'
                          onChangeText={(AssetTagID) => {this.setState({AssetTagID})}} 
                          value={this.state.AssetTagID}
                          placeholderTextColor='grey'
                          onSubmitEditing={() => {
                           this.onBarcodeManual()
                        }}

                    />
                  </View>   
                
              </View>
            </View>  
            )
      } else{
        return (
          <View style={styles.container}>
            <View >
              <Text style={styles.welcomeText}>Asset Details</Text>  
            </View> 
            <ActivityIndicator animating={this.state.butLoading} size="large"/>
            {renderIf(this.state.inserted, 
                    <View style={styles.topMessage}>{this._renderMessage()}</View>
            )}
            <View style={{flex: 1}} >
                    <ScrollView>
                      <Text style={styles.scanTitleTextResult}><Text style={{fontWeight:'bold'}}>Scanned Tag: </Text>{this.state.AssetTagID}</Text>
                      
                      {renderIf(this.state.assetDetail.assetId, 
                          <Text style={styles.scanTitleTextResult}><Text style={{fontWeight:'bold'}}>Asset ID:</Text> {this.state.assetDetail.assetId} </Text>
                      )}
                      {renderIf(this.state.assetDetail.name, 
                          <Text style={styles.scanTitleTextResult}><Text style={{fontWeight:'bold'}}>Name:</Text> {this.state.assetDetail.name} </Text>
                      )}
                      {renderIf(this.state.assetDetail.desc, 
                          <Text style={styles.scanTitleTextResult}><Text style={{fontWeight:'bold'}}>Description: </Text>{this.state.assetDetail.desc} </Text>
                      )}
                      {renderIf(this.state.assetDetail.AssetStatus, 
                          <Text style={styles.scanTitleTextResult}><Text style={{fontWeight:'bold'}}>Status:</Text> {this.state.assetDetail.AssetStatus} </Text>
                      )}
                      {renderIf(this.state.assetDetail.AssignedTo, 
                          <Text style={styles.scanTitleTextResult}><Text style={{fontWeight:'bold'}}>Assigned To: </Text>{this.state.assetDetail.AssignedTo} </Text>
                      )}
                      {renderIf(this.state.assetDetail.BuildingName, 
                          <Text style={styles.scanTitleTextResult}><Text style={{fontWeight:'bold'}}>Building Name: </Text>{this.state.assetDetail.BuildingName} </Text>
                      )}
                      {renderIf(this.state.assetDetail.Cost, 
                          <Text style={styles.scanTitleTextResult}><Text style={{fontWeight:'bold'}}>Cost: </Text>{this.state.assetDetail.Cost} </Text>
                      )}
                      {renderIf(this.state.assetDetail.DSGLocationCode, 
                          <Text style={styles.scanTitleTextResult}><Text style={{fontWeight:'bold'}}>DSG Location Code: </Text>{this.state.assetDetail.DSGLocationCode} </Text>
                      )}
                      {renderIf(this.state.assetDetail.Department, 
                          <Text style={styles.scanTitleTextResult}><Text style={{fontWeight:'bold'}}>Department: </Text>{this.state.assetDetail.Department} </Text>
                      )}
                      {renderIf(this.state.assetDetail.HighOrg, 
                          <Text style={styles.scanTitleTextResult}><Text style={{fontWeight:'bold'}}>High Org: </Text>{this.state.assetDetail.HighOrg} </Text>
                      )}
                      {renderIf(this.state.assetDetail.FundNumber, 
                          <Text style={styles.scanTitleTextResult}><Text style={{fontWeight:'bold'}}>Fund Number: </Text>{this.state.assetDetail.FundNumber} </Text>
                      )}
                      {renderIf(this.state.assetDetail.Floor, 
                          <Text style={styles.scanTitleTextResult}><Text style={{fontWeight:'bold'}}>Floor: </Text>{this.state.assetDetail.Floor} </Text>
                      )}
                      {renderIf(this.state.assetDetail.InServiceDate, 
                          <Text style={styles.scanTitleTextResult}><Text style={{fontWeight:'bold'}}>In Service Date: </Text>{this.state.assetDetail.InServiceDate} </Text>
                      )}
                      {renderIf(this.state.assetDetail.Room, 
                          <Text style={styles.scanTitleTextResult}><Text style={{fontWeight:'bold'}}>Room: </Text>{this.state.assetDetail.Room} </Text>
                      )}
                    </ScrollView>
                
                {this._renderScanButtons()}

              </View> 
               {renderIf(this.state.animating,                       
                    <DotIndicator
                    style={styles.activityIndicator}
                    count={3}
                    size={8}
                    color='#fff'
                    animationDuration={800}
                  />
                )}
            </View>
            );
      }
  }
}

const BOX_MARGIN = 30;
const BOX_SIZE = Dimensions.get('window').width - BOX_MARGIN * 2;
const BOX_TOP = Dimensions.get('window').height / 2 - BOX_SIZE / 2;
const BOX_BOTTOM = BOX_TOP + BOX_SIZE;
const BOX_LEFT = BOX_MARGIN;
const BOX_RIGHT = Dimensions.get('window').width - BOX_MARGIN;

const overlayBaseStyle = {
  position: 'absolute',
  backgroundColor: 'rgba(0,0,0,0.6)',
};

const cornerBaseStyle = {
  position: 'absolute',
  borderColor: '#fff',
  backgroundColor: 'transparent',
  borderWidth: 2,
  width: 10,
  height: 10,
};

const styles = StyleSheet.create({
  camera: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      height: Dimensions.get('window').width,
      width: Dimensions.get('window').width
  },  
  topLeftCorner: {
    ...cornerBaseStyle,
    top: BOX_TOP - 1,
    left: BOX_MARGIN - 1,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRightCorner: {
    ...cornerBaseStyle,
    top: BOX_TOP - 1,
    right: BOX_MARGIN - 1,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeftCorner: {
    ...cornerBaseStyle,
    bottom: Dimensions.get('window').height - BOX_BOTTOM - 1,
    left: BOX_MARGIN - 1,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRightCorner: {
    ...cornerBaseStyle,
    bottom: Dimensions.get('window').height - BOX_BOTTOM - 1,
    right: BOX_MARGIN - 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  topOverlay: {
    ...overlayBaseStyle,
    top: 0,
    left: 0,
    right: 0,
    bottom: Dimensions.get('window').height - BOX_TOP,
  },
  leftOverlay: {
    ...overlayBaseStyle,
    top: BOX_TOP,
    left: 0,
    right: BOX_RIGHT,
    bottom: Dimensions.get('window').height - BOX_BOTTOM,
  },
  rightOverlay: {
    ...overlayBaseStyle,
    top: BOX_TOP,
    left: BOX_RIGHT,
    right: 0,
    bottom: Dimensions.get('window').height - BOX_BOTTOM,
  },
  bottomOverlay: {
    ...overlayBaseStyle,
    top: BOX_BOTTOM,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        alignItems: 'center',
        left: 0,
      },
      android: {
        alignItems: 'flex-start',
        left: 25,
      },
    }),
  },
  manualAssetTag: {
    position: 'absolute',
    top: 40,
    left: 10,
    right: 10,
  },
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    backgroundColor: '#5F514B',

  },
  welcomeText: {
    justifyContent: 'flex-start',
    fontSize: 20,
    paddingLeft: 25,
    paddingTop: 15,
    paddingBottom: 10,
    color: '#ffffff',
  },
  scanTitleTextResult: {
    fontSize: 17,
    paddingLeft: 30,
    paddingRight: 25,
    paddingTop: 10,
    color: '#fff',
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
  messageView: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection:"row",
    paddingLeft: 20,
  },
  scan:{
    borderRadius: 30,
    position: 'absolute',
    bottom: 16,
    left: 48,
    right: 48,
    paddingVertical: 16,
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B5999',
  },
  scanText:{
      fontSize: 15,
      color:'#fff',
      textAlign:'center',
  },
    topMessage: {
    flexDirection:"row"
  },
  insertText: {
    padding: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color:'#4da81f',
  },
});

module.exports = Scanner;