import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet
} from 'react-native';

import { Header, Icon } from 'react-native-elements';

export default class Navigation extends Component {
  constructor(props) {
    super(props);

  }
  render() { 
    return (
      <Header
          outerContainerStyles={styles.headerOuterContainer}
          innerContainerStyles={styles.headerInnerContainer}
          centerComponent={<Text style={styles.headerText} > Asset Scanner </Text>}
        /> 
      )
  }
}

const styles = StyleSheet.create({
  headerOuterContainer: {
    padding: 10,
    height: 80,
    backgroundColor: '#083045',
    borderBottomWidth:0
  },
  headerInnerContainer: {
    justifyContent: 'space-between'
  },
  headerText: { 
    //fontFamily: "Walkway Bold", 
    color: '#fff', 
    fontSize: 25,
    paddingBottom: 10 
  }
});

module.exports = Navigation;