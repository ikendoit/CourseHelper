/*
  Author: Mark Ranges
  Last Modified: July 4, 2017
  Description: Course helper main application.
  License: MIT
*/

import React from 'react';
import {AppRegistry, Text, StyleSheet, View} from 'react-native';

// for navigation
import { DrawerNavigator, StackNavigator } from 'react-navigation';
import { Button, Icon } from 'react-native-elements';

// import classes for different screens
import CourseLister from './CourseLister';
import DepartmentLister from './DepartmentLister';
import Tutorial from './Tutorial';
import Introduction from './NewsFeed';
import Favourites from './Favourites';

/* menu button for all em */
const navMenuStyle = {
  headerStyle: {
    backgroundColor: '#3f91f5' /* color theme */
  },
  headerTintColor: 'white', 
};
/* search button for Departments and Courses */
const searchButton = {
  headerRight: <Button icon={{name: 'search', size: 25}}
          backgroundColor='rgba(0,0,0,0)'/>
}

const Default = StackNavigator({
  Intro: {
    screen: Introduction,
    navigationOptions: navMenuStyle
  }
});
const Saved = StackNavigator({
  Favourites: {
    screen: Favourites,
    navigationOptions: navMenuStyle
  }
})
const Browse = StackNavigator({
  Departments: {
    screen: DepartmentLister,
    navigationOptions: navMenuStyle
  },
  Courses: {
    screen: CourseLister,
    navigationOptions: searchButton
  }
});
const Help = StackNavigator({
  Tutorial: {
    screen: Tutorial,
    navigationOptions: navMenuStyle
  }
})

const Menu = DrawerNavigator({
  Default: {
    screen: Default
  },
  Favourites: {
    screen: Saved,
  },
  Browse: {
    screen: Browse
  },
  Tutorial: {
    screen: Help,
  },
  
  // Settings: {
  //   screen: Settings,
  // },
  });
AppRegistry.registerComponent('CourseHelper', () => Menu)
