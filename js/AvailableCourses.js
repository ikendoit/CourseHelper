import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
  AsyncStorage,
  TouchableHighlight,
} from 'react-native';

import {
  Button
} from 'react-native-elements';

// for styles and stuff
import * as styles from './styles.js';
import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';

export default class DepartmentLister extends React.Component {
    //Ken
    //Following a component design pattern, which help changing static context (eg: NavigationOption)

    static me = null;

	//**********************Component initialization
	// set navigation params for static context switching
    _setNavigationParams(){
        let opened = this.state.opened;

		let textInput = <TextInput placeholder="search" autoFocus={true} style={{backgroundColor: "white", width: 200}} onChangeText={(text)=>this.textSearch(text)} />; 

		let closeButton = <Button icon={{name: 'clear', size: 25 }} backgroundColor='rgba(0,0,0,0)' onPress = {()=> {this.onButtonPress()}}/>;

		let searchButton = <Button icon={{name: 'search', size: 25 }} backgroundColor='rgba(0,0,0,0)' onPress = {()=> this.onButtonPress()}/>;

        this.props.navigation.setParams({
            opened,
			textInput, 
			closeButton, 
			searchButton,
        });
    }

    constructor(props) {
      super(props);
      this.state = {
        loaded: false,
        opened : false,
		searcher : "",
		activeSection: false,
      }
    }

	componentDidMount(){
	  //load data into state.dpts
	  AsyncStorage.getItem("data").then((value)=> {
	  	//FILTER OUT OPEN COURSES
	  	value = JSON.parse(value);
		availCourses = [];
	  	for (dep of value){
			//each course eg: MATH 1171
			for (course of dep.courses){
				for (let i = 0 ; i < course.offerings.length; i++){
					if (course.offerings[i].seats == "" || course.offerings[i].seats == "0"){
						//remove courses with no seat
						course["offerings"].splice(i,1); 
						i--;
					}
				}
				availCourses.push(course);
			}
		}
	    this.setState({availCourses, loaded: true,})
	  });
	  
      this._setNavigationParams();
    }

	//After this component has mounted
    componentWillMount() {
		me = this;
		this.setState({opened : false});
    }

	//**************************SEARCHES

	//change between nav mode vs search mode
	onButtonPress(){
		let changeOpened = ! this.state.opened;
		this.setState({ 
			opened : changeOpened 
		}, ()=> {
			this._setNavigationParams();
			if (this.state.opened == false) {
				this.textSearch("");
			}
		});
	}

	//search for courses based on text in search bar
	//@params: text : from search bar
	textSearch(text){
		if (text == "" ) {
			this.setState({ 
				searchCourses : []
			});				
			return;
		}
		allCourses = [] ;
		for (let i = 0 ; i < this.state.availCourses.length ; i++){
			if (this.state.availCourses[i]["course_id"].toUpperCase().includes(text.toUpperCase())) {
				allCourses.push(course);
			}
		}

		this.setState({
			searchCourses : allCourses,
			seacher : text,
		});
		
		return allCourses;
	}

    static navigationOptions = ({navigation,screenProps}) => {
        const params = navigation.state.params || {};
		//checking if search is on
		const opened = params.opened || false;
        return {
            //set header right : 2 ways: in search mode or normal mode
            headerLeft:  
               <Button icon={{name: 'menu', size: 25 }} backgroundColor='rgba(0,0,0,0)' onPress = {()=> {navigation.navigate('DrawerOpen');}}/>,

            //set title, 2 ways.
            headerTitle : ( params.opened  ? params.textInput : "Available Courses" ), 
            //set header right 
            headerRight : (  opened ? params.closeButton :params.searchButton ), 
			//title for navigation 
			title: "Available Courses",
        }
     };

    // Sets section to 'expanded'
    _setSection(section) {
      this.setState({ activeSection: section });
    }

    //add course to fav async storage 
    addFavs(id_sec) {
    	/*generate json of favs : 
      	favs : 
      		name : string 
      		nums : []
      */
    	AsyncStorage.getItem("favs").then((value)=>{ 
      	let favs = [];

      	//if storage is not empty 
      	if (value != null) {
      		favs=JSON.parse(value);
      	}

      	//boolean helps checking if course_id is stored
      	let contained = false;

      	//parse fav course id 
      	let id = id_sec.split(" -- ")[0];
      	let num = id_sec.split(" -- ")[1];

      	//check all stored 
      	for (miniFav of favs){
      		//if course_id already stored
      		if (miniFav["name"] == id){
      			if (miniFav["nums"] == null){
      				miniFav["nums"] = []; 
      			}
      			if (miniFav["nums"].indexOf(num) < 0){
      				miniFav["nums"].push(num);
      			} else { 
                      alert(id+" "+num+" has already been added");
                  }
      			contained = true; 
      		}

      	}
      	//if this is a new course_id
      	if (!contained) {
      		favs.push({
      			"name" : id,
      			"nums" : [num],
      		});
      	}
      	AsyncStorage.setItem("favs",JSON.stringify(favs));

      	//reset the fav database, uncomment when you need to reset
      	//AsyncStorage.setItem("favs",JSON.stringify([]));
      });
    }


    // displays courses as an accordion but closed
    _renderHeader(course, i, isActive) {
    	if (course.offerings[0] == null) {
			return (
				<View/>
			);
        }
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
      		<TouchableHighlight onPress={()=>{ me.addFavs(course.course_id + " -- "+ course.offerings[j].course_num); }} backgroundColor="rgba(255,255,255,0.6)" style={{alignItems: 'center', backgroundColor: '#DDDDDD', padding: 10, }} underlayColor='#00BFFF' >
      			<Text> Add to Favorites </Text> 
      		</TouchableHighlight>

              <Text >{'\n'}</Text>
            </Animatable.View>
          );
	
      }
      return sections;
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

    //main renderer
    render() {
      if (!this.state.loaded && !this.state.availCourses) {
        return this.renderLoadingView();
      }
      return(
	  	<View>
          <ScrollView style={{padding: 10}}>
		  	<Accordion style={styles.strongShadow}
				activeSection={this.state.activeSection}
				sections={this.state.availCourses}
				renderHeader={this._renderHeader}
				renderContent={this._renderContent}
				duration={50}
				onChange={this._setSection.bind(this)}
				easing="easeOutCubic"
		  	/>
          </ScrollView>
		</View>
      );
    }
};
