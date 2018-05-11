import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  AsyncStorage,
  TouchableHighlight
} from 'react-native';

import { Button, Header, Icon, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'; // 0.19.0
import Scanner from './Scanner';
export default class Scan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: props.navigation.state.params.token,
      recordId: props.navigation.state.params.recordId,
      AssetTagID: '',
      scanned: false,
      assetDetail: {},
    };

  }

  updateData  = () => {
    this.setState({scanned: false, });
    //some other stuff
  };
  
  _onCodeRead = (e) => {
      if(!this.state.scanned){
        this.setState({AssetTagID: e.data, scanned: true}, function(){
              this._getAssetDetailsAsync();
              //this.props.navigation.navigate('Detail', { token: this.state.token, AssetTagID: this.state.AssetTagID, onCodeRead:this._onCodeRead, updateData:this.updateData})
        });
      }
  }
  
  _onCodeManual = (data) => {
    this.setState({
                    AssetTagID: data
                  }, function(){
                    this.props.navigation.navigate('Detail', { token: this.state.token, AssetTagID: this.state.AssetTagID})
                  });
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
          assetDetailObj["desc"] = "Asset Not Found"
          //STATES//
          this.setState({assetDetail: assetDetailObj});
        }
        this.setState({animating: false});
        alert(JSON.stringify(this.state.assetDetail))

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

  render() { 
    return (
        <View style={styles.container}>
          <View style={styles.rectangleContainer}>
            <Scanner recordId={this.state.recordId} onBarcodeRead={this._onCodeRead} onBarcodeManual={this._onCodeManual} onCancel={this._handleCancel}/>
          </View> 
        </View>
      )
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
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  loginbuttonStyle: {
        padding: 20,
  },
  userInput: {
    //fontFamily: "Walkway Bold",
    fontSize: 20,
    color: '#050505',
  }, 
  errorStyle: {
    //fontFamily: "Walkway Bold",
    marginBottom: 10,
    fontSize: 15,
    color: '#050505',
    textAlign: 'center'
  },  
  button: {
    alignItems: 'center',
    backgroundColor: '#829255',
  },
  buttonText: {
    //fontFamily: "Walkway Bold",
    color: '#fff', 
    padding: 20,
    fontSize: 20,
  },
});

module.exports = Scan;