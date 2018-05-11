import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  ListView,
  AlertIOS,
  RefreshControl
} from 'react-native';

import { SwipeListView } from 'react-native-swipe-list-view'; // 1.0.4
import {
  DotIndicator,
} from 'react-native-indicators'; // 0.10.0
import renderIf from './renderIf';
export default class Assets extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      token: props.navigation.state.params.token,
      recordId: props.navigation.state.params.recordId,
      listOfAssetDataView: [],
      refreshing: false,

    };

  }

  componentDidMount () { 
    this._showAssetListAsync(); 
  } 

  _onRefresh() {
    this.setState({refreshing: true}, function(){
      this._showAssetListAsync(); 
    });
  }

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
           this.setState({refreshing: false});
           this.setState({listOfAssetDataView: assetInfolist}); 
        })
      .catch((error) => { 
          console.error(error);
          AlertIOS.alert('Failure Logging In' + JSON.stringify(error))
      });
  }


  render() { 
    return (
      <View style={styles.container}>
          <View >
            <Text style={styles.welcomeText}>Inventory</Text>  
          </View>  
          <SwipeListView
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh.bind(this)}
                />}
                dataSource={this.ds.cloneWithRows(this.state.listOfAssetDataView)}
                renderRow={ data => (
                  <TouchableOpacity
                    //onPress={ _ => this._getAssetDetails(data.props.children[0].props.children.props.children[1]) }
                    onPress={ _ =>  this.props.navigation.navigate('Detail', { token: this.state.token, AssetTagID: data.props.children[0].props.children.props.children[1] }) }
                    underlayColor={'#F1F3F4'}
                  >
                    <View style={styles.rowFront}>
                      {data}
                    </View>
                   </TouchableOpacity> 
                )}
                enableEmptySections={true}
            /> 
            <TouchableHighlight
                style={styles.scan}
                onPress={ _ => this.props.navigation.navigate('Scanner', { token: this.state.token, recordId: this.state.recordId })}
                underlayColor='#3B5999'>
                  <Text style={styles.scanText}>SCAN</Text>
              </TouchableHighlight>
            

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
  assetText: {
      color: '#fff',
      marginBottom: 5,
      marginLeft: 20,
      marginTop: 5,
    },
  
  welcomeText: {
    justifyContent: 'flex-start',
    fontSize: 20,
    paddingLeft: 25,
    paddingTop: 15,
    paddingBottom: 10,
    color: '#ffffff',
  },
  rowFront: {
    backgroundColor: '#5F514B',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomColor: '#666',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  listHeaderView: {
    paddingLeft: 20,
    paddingBottom: 5,
    fontSize: 18,
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
  rtText: {
    alignSelf: 'flex-end',  
    color: '#fff',
    fontSize: 15,
    marginBottom: 5,
    marginTop: 5,
    marginRight: 20
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

});

module.exports = Assets;