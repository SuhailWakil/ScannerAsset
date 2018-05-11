import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView
} from 'react-native';

import renderIf from './renderIf';
import {
  DotIndicator,
} from 'react-native-indicators'; // 0.10.0

export default class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AssetTagID: props.navigation.state.params.AssetTagID,
      token: props.navigation.state.params.token,
      assetDetail: {},
      animating: true,
      inserted: false,
      assetLookup: false,
      insertedText: ''

    };
  }

  componentDidMount () { 
    this._getAssetDetailsAsync(); 
  } 

    //Get Asset Information
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

  render() { 
    return (
          <View style={styles.container}>
            <View >
              <Text style={styles.welcomeText}>ASSET DETAILS</Text>  
            </View> 

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
                  
             </View> 
             {renderIf(this.state.animating,                       
                  <DotIndicator
                  style={styles.activityIndicator}
                  size={8}
                  count={3}
                  color='#fff'
                  animationDuration={800}
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
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 20,
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
});

module.exports = Detail;