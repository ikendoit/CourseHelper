import React from 'react';
import {Button, Icon} from 'react-native-elements';

// import classes for modal
import ImageSlider from 'react-native-image-slider';
import * as styles from './styles.js';

import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';


export default class Tutorial extends React.Component {
  static navigationOptions = ({navigation})=> ({
    title: <Text color='white'>Tutorial, Swipe Right</Text>,
    headerLeft: <Button icon={{name: 'menu', size: 25 }}
       backgroundColor='rgba(0,0,0,0)'
       onPress = {()=> navigation.navigate('DrawerOpen')}/>
  });
  constructor() {
    super();
  }

  render() {
    return (
		
		<ImageSlider images={[
			require('../images/1-Falcon.gif'),
			require('../images/2-Falcon.gif'),
			require('../images/3-Falcon.gif')
		]} />

    );
  }
}
