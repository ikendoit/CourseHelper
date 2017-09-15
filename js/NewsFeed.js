import React from 'react';
import {Text, StyleSheet, View} from 'react-native';

import {
  Button, Icon
} from 'react-native-elements';

export default class Introduction extends React.Component {
  static navigationOptions = ({navigation}) => ({
       title: 'News Feed',
       headerLeft: <Button icon={{name: 'menu', size: 25 }}
        backgroundColor='rgba(0,0,0,0)'
        onPress = {()=> navigation.navigate('DrawerOpen')}/>
  });

  // this function shows news from a data array
  showNews() {
    let data = [];
    for (let i = 1; i < 6; i++) {
      data.push(
        <View key={i}>
          <Text style={introStyles.title}>News {i}</Text>
          <Text style={introStyles.moreInfo}>Lorem ipsum lmao hjajaja</Text>
          <Text style={introStyles.description}>Hello World!</Text>
        </View>
      );
    }
    return data;
  }
  render() {
    return (
      <View>
        <Text style={introStyles.description}>Hello World!</Text>
        <Text style={introStyles.title}>News 1</Text>
        <Text style={introStyles.moreInfo}>Lorem ipsum lmao hjajaja</Text>
        {this.showNews()} 
      </View>
    );
  }
}
const introStyles = StyleSheet.create({
  description: {
    color: 'red',
    fontSize: 20,
    textAlign: 'center',
  },
  title: {
    color: 'blue',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  moreInfo: {
    textAlign: 'center',
  }
});
