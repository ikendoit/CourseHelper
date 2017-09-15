import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableHighlight,
} from 'react-native';

import {
  Button, Icon
} from 'react-native-elements';

// for styles and stuff
import * as styles from './styles.js';
import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyA881FOyVulJ9uou8zAetJF-DZ16O2skXE",
    authDomain: "coursebackend1.firebaseapp.com",
    databaseURL: "https://coursebackend1.firebaseio.com",
    storageBucket: "coursebackend1.appspot.com",
    persistence: true
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class DepartmentLister extends React.Component {
  static navigationOptions = ({navigation}) => ({
       title: 'Departments',
       headerRight: <Button icon={{name: 'search', size: 25 }}
        backgroundColor='rgba(0,0,0,0)'
        />,
       headerLeft: <Button icon={{name: 'menu', size: 25 }}
        backgroundColor='rgba(0,0,0,0)'
        onPress = {()=> navigation.navigate('DrawerOpen')}/>,
  });

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      dpts: [],
    }
    this.itemsRef = firebaseApp.database().ref();
  }
  componentDidMount() {
    this.fetchData(this.itemsRef);
  }
  // retrieve deparments data from the firebase server
  fetchData(itemsRef) {
    let data = [];
    /* loop for each value retrieved, then pushed to data array */
    itemsRef.on('value', (snap)=> {
      snap.forEach((child) => {
        data.push({
          dept: child.val().dept,
          courses: child.val().courses});
      });
      /* update view state */  
      this.setState({
        loaded: true,
        dpts: data,
      });
    });
    
  }

  // shows the list of deparments
  showDepartments()  {
    const courses = [];
    const {navigate} = this.props.navigation;
    let departments = this.state.dpts;
    
    for (let i = 0; i < departments.length; i++){
      courses.push(
        <View key={departments[i].dept}>
        <Button style={{paddingBottom: 10, paddingTop: 10}}
          onPress={ ()=> navigate('Courses', { 
            coursesData: departments[i].courses, 
            dept: departments[i].dept
          })}
          title={departments[i].dept}
          backgroundColor="#3f91f5"
          raised/>
          </View>
      );
    }
    return courses;
  }

  // loading view while deparments are being pulled from the server
  renderLoadingView() {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          animating={this.state.animating}
          style={[styles.centering, {height: 80}]}
          size="large"
          color="#0000ff"
        />
      </View>
    );
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }
    return(
      <ScrollView>
        {this.showDepartments()}
      </ScrollView>

    );
  }
};
