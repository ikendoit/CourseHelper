import React from 'react';
import {ListView, Image, ScrollView, Text, StyleSheet, View, ActivityIndicator, AsyncStorage,} from 'react-native';
import {
  Button, Icon
} from 'react-native-elements';

export default class Introduction extends React.Component {

  constructor(props){
    super(props);   
    this.state = { 
        loaded : false 
    }
  }
    
  static navigationOptions = ({navigation}) => ({
    title: 'News Feed',
    headerLeft: <Button icon={{name: 'menu', size: 25 }}
     backgroundColor='rgba(0,0,0,0)'
     onPress = {()=> navigation.navigate('DrawerOpen')}/>
  });

  componentDidMount(){
    this.fetchData();
  }

  fetchData() {
	let data = [];
	let news = [];
	let fetcher = fetch('http://35.182.249.219/langara/').then((res) => res.json())
		.then((resJSON) => {
			resJSON.forEach((child)=> {
				data.push({
					dept: child.dept,
			        courses: child.courses,
				});
			});
			fetch('http://35.182.249.219/langara/news').then((newly) => newly.json())
				.then((newsJSON) => {
					newsJSON.forEach((child)=>{
						news.push({
							title: child.text,
							img: "https://langara.ca/"+child.img, 
							link: child.link,
						});
					});
	
					if (data.length > 2) {
						AsyncStorage.setItem("data",JSON.stringify(data));
					}
					AsyncStorage.setItem("news",JSON.stringify(news));
					this.setState({
						loaded : true,
						news
					});
				});
		
		})
		.catch((error) => {
			console.log("error this" +error);
		});
	}

  // this function shows news from a data array
  showNews() {
    let data = [];
	let curNews = this.state.news;
    for (let i = 0; i < curNews.length; i++) {
      data.push(
        <View key={i}>
          <Text style={introStyles.title}>{curNews[i].title}</Text>
        </View>
      );
    }
		
	return data;
		
    //return (
	//	<ListView
	//		dataSource={curNews}
	//		renderRow={(rowData) => <Text>{RowData.title} </Text> }
	//	/>
	//);
  }

  // loading view while deparments are being pulled from the server
  renderLoadingView() {
    return (
      <View style={introStyles.container}>
        <ActivityIndicator
          animating={this.state.animating}
          style={[introStyles.centering, {height: 80}]}
          size="large"
          color="#0000ff"
        />
      </View>
    );
  }

  render() {
    if (!this.state.loaded){
        return this.renderLoadingView();
    } else {
      return (
        <ScrollView>
          {this.showNews()} 
        </ScrollView>
      );
    }
  }
}

//styling
const introStyles = StyleSheet.create({
  container: {
    flex:1 ,
    justifyContent: 'center', 
    backgroundColor: '#F5FCFF',
  },
  description: {
    color: 'red',
    fontSize: 20,
    textAlign: 'center',
  },
  title: {
    color: 'black',
    fontSize: 14,
    textAlign: 'center',
	backgroundColor: '#93EF1D',
	marginBottom: 10,
  },
  moreInfo: {
    textAlign: 'center',
  }
});
