'use strict';
var React = require('react-native');

var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#5F514B',
  },
  innerBot:{
  	flex: 2,
  	//backgroundColor: '#303030',
  	alignItems: 'stretch', 
  	justifyContent: 'center', 
  	padding: 40,
  },
  textbox: {
  	margin: 10,
    height: 40, 
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 15,
    textAlign: 'left',
    color: '#fff',
    borderColor: '#fff', 
    borderWidth: 1,
    borderRadius: 5
  },
  testing: {
  	borderRadius: 4,
    borderWidth: 5,
    borderColor: 'red',
  },
  textInput: {
	borderColor: 'white', 
	borderWidth: 1,
	height: 34,
	paddingBottom:40
  },
  signin:{
	marginRight:20,
	marginLeft:20,
	marginTop:10,
	paddingTop:20,
	paddingBottom:20,
	backgroundColor:'#3B5999',
	borderRadius:30,
	//borderWidth: 1,
	//borderColor: '#fff'
  },
  signinText:{
  	  fontSize: 15,
      color:'#fff',
      textAlign:'center',
  },
  login:{
    marginRight:20,
    marginLeft:20,
    marginTop:10,
    paddingTop:20,
    paddingBottom:20,
    backgroundColor:'#FFFFFF',
    borderRadius:30,
    //borderWidth: 1,
    //borderColor: '#fff'
  },
  loginText:{
  	  fontSize: 15,
      color:'#3B5999',
      textAlign:'center',
  },
  rightText: {
    margin: 1,
    fontSize: 15,
    textAlign: 'right',
    color: '#fff',
  },
  leftText: {
    margin: 1,
    fontSize: 15,
    textAlign: 'center',
    color: '#fff',
  },
  centerText: {
    margin: 25,
    fontSize: 15,
    textAlign: 'center',
    color: '#fff',
  },
  leftView: {
  	flex: 1,
  	alignItems: 'flex-start',
  },
  rightView: {
  	flex: 1.5,
  	alignItems: 'flex-end',
  },
  leftViewFace: {
  	flex: 1,
  	//alignItems: 'flex-start',
  },
  rightViewTwit: {
  	flex: 1,
  	//alignItems: 'flex-end',
  },
  rowTextView: {
  	flexDirection: "row", 
  	margin: 10 
  }

});