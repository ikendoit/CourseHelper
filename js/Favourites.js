import React from  'react';
import { Text } from 'react-native';
import { Button } from 'react-native-elements';

export default class Favourites extends React.Component {
    static navigationOptions = ({navigation}) => ({
       title: 'My Favourites',
       headerLeft: <Button icon={{name: 'menu', size: 25 }}
        backgroundColor='rgba(0,0,0,0)'
        onPress = {()=> navigation.navigate('DrawerOpen')}/>
  });

    render() {
        return (<Text>My Favourites</Text>);
    }
}