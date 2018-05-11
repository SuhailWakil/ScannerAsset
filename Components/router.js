import React from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Button, Icon } from 'react-native-elements';

import Login from './Login';
import Workorders from './Workorders';
import Assets from './Assets';
import Detail from './Detail';
import Scanner from './Scanner';



export const Tabs = TabNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      tabBarLabel: 'New User',
      tabBarIcon: ({ tintColor }) => <Icon name="list" size={35} color={tintColor} />
    },
  },
  Workorders: {
    screen: Workorders,
    navigationOptions: {
      tabBarLabel: 'Workorders',
      tabBarIcon: ({ tintColor }) => <Icon name="account-circle" size={35} color={tintColor} />
    },
  },
},
{
    tabBarPosition: 'bottom',
    swipeEnabled: true,
    animationEnabled: true,
  },);

export const FeedStack = StackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      title: 'COSD Login',
      headerTintColor: '#ffffff',
      headerStyle: {
        backgroundColor: '#8D8882',
      },
      headerTitleStyle: {
        fontSize: 18,
      },
    },
  },
  Detail: {
    screen: Detail,
    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.params.AssetTagID.toUpperCase()}`,
      headerTintColor: '#ffffff',
      headerStyle: {
        backgroundColor: '#5F514B',
      },
      headerTitleStyle: {
        fontSize: 18,
      },
    }),
  },
  Assets: {
    screen: Assets,
    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.params.recordId.toUpperCase()}`,
      headerTintColor: '#ffffff',
      headerStyle: {
        backgroundColor: '#5F514B',
      },
      headerTitleStyle: {
        fontSize: 18,
      },
    }),
  },
  Scanner: {
    screen: Scanner,
    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.params.recordId.toUpperCase()}`,
      /*headerLeft: (
        <Button
          title={true ? 'Done' : `${user}'s info`}
          onPress={() => navigation.navigate('Assets', { token: navigation.state.params.token , recordId: navigation.state.params.recordId })}
        />
      ),*/
      headerTintColor: '#ffffff',
      headerStyle: {
        backgroundColor: '#5F514B',
      },
      headerTitleStyle: {
        fontSize: 18,
      },
    }),
  },
  Workorders: {
    screen: Workorders,
    navigationOptions: ({ navigation }) => ({
      title: "Workorders",
      headerLeft: null,
      headerTintColor: '#ffffff',
      headerStyle: {
        backgroundColor: '#5F514B',
      },
      headerTitleStyle: {
        fontSize: 18,
      },
    }),
  },
  Login: {
    screen: Login,
    navigationOptions: ({ navigation }) => ({
      title: `Login`,
      headerTintColor: '#ffffff',
      headerStyle: {
        backgroundColor: '#5F514B',
      },
      headerTitleStyle: {
        fontSize: 18,
      },
    }),
  },
},
{ 
    headerMode: 'screen',
    tabBarPosition: 'bottom',
    swipeEnabled: true,
    animationEnabled: true,
  });