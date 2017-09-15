import React from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

// for styles and stuff
import * as styles from './styles.js';

// for accordion
import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';

export default class CourseLister extends React.Component {
  static navigationOptions = ({navigation}) => ({
    headerStyle: {
      /* F15A22 - orange */
      backgroundColor: '#3f91f5'
    },
    headerTitle: `${navigation.state.params.dept}`,
    title: "Departments",
    headerTintColor: 'white',
  });
  
  constructor(props, context) {  
    super(props, context);
    this.state = {
      loaded: false,
      activeSection: false,
      collapsed: true,
    };
  }  
  // if the view has loaded fully, update state
  componentDidMount() {
    this.setState({
      loaded: true,
      data: this.props.navigation.state.params.coursesData,
      title: this.props.navigation.state.params.dept,
    });
  }

  // Expands section
  _toggleExpanded = () => {
    this.setState({ collapsed: !this.state.collapsed });
  }

  // Sets section to 'expanded'
  _setSection(section) {
    this.setState({ activeSection: section });
  }

  // displays courses as an accordion but closed
  _renderHeader(course, i, isActive) {
    return (
      <Animatable.View transition="backgroundColor" duration={500} style={[{ padding: 10, }, isActive ? styles.active : styles.inactive]}>
        <Text style={[isActive ? [styles.activeText, styles.headerActiveText]: [styles.inactiveText, styles.headerInactiveText]]}>{course.course_id} - {course.offerings[0].title} </Text>
      </Animatable.View>
    );
  }

  // displays courses and their sections
  _renderContent(course, i, isActive) {
    let sections = [];
    for (let j = 0; j < course.offerings.length; j++) {
      let room = course.offerings[j].component[0].room; //lecture
      let waitlist = course.offerings[j].waitlist; // people on waitlist
        sections.push(
          <Animatable.View transition="backgroundColor" key={i+j} duration={500} style={[{paddingLeft: 20, paddingRight: 20}, isActive ? styles.active : styles.inactive]}>
            <Animatable.Text style={[{textAlign: 'center', padding: 10}, styles.activeText]} >Section {course.offerings[j].section} - CN: {course.offerings[j].course_num}</Animatable.Text>
            <View style={{ borderBottomColor: 'white', borderBottomWidth: 1, paddingBottom: 5 }}/>
            
            <Animatable.Text style={{color: 'white', paddingTop: 5}} >Seats Available: {course.offerings[j].seats}</Animatable.Text>
            { waitlist != '' ? 
              <Animatable.Text style={{color: 'white',}} >Current Waitlist: {waitlist}</Animatable.Text> :
              <Animatable.Text style={{color: 'white',}} >Current Waitlist: 0</Animatable.Text> 
            }
            <Animatable.Text style={{color: 'white',}} >Instructor: {course.offerings[j].instructor}</Animatable.Text>
            { room != 'WWW' && room != '' && room != 'TBSCH' ? 
              <Animatable.Text style={{color: 'white',}} >Lecture Room: {room}</Animatable.Text> :
              <Animatable.Text style={{color: 'white',}} >Lecture Room: TBA</Animatable.Text> 
            }
            <Text>{'\n'}</Text>
          </Animatable.View>
        );
    }
    return sections;
  }

  // main render function
  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }
    return (
          <ScrollView style={{padding: 10}}>
              <Accordion style={styles.strongShadow}
                activeSection={this.state.activeSection}
                sections={this.state.data}
                renderHeader={this._renderHeader}
                renderContent={this._renderContent}
                duration={100}
                onChange={this._setSection.bind(this)}
              />
          </ScrollView>
    );
  }
  // show loading view while data is being loaded
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
}
