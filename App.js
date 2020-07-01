/* eslint-disable */
import React, { Component } from 'react';
import { StyleSheet, Platform, View, Image, Text, TextInput, TouchableOpacity, Alert, YellowBox , FlatList} from 'react-native';
var Realm = require('realm');
let realm ;
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
 
class MainActivity extends Component{
  static navigationOptions =
  {
     title: 'MainActivity',
  };
  GoToSecondActivity = () =>
  {
     this.props.navigation.navigate('Second');
  }
  constructor(){
    super();
    this.state = {
      Student_Name : '',
      Student_Class : '',
      Student_Subject : ''
 
  }
 
    realm = new Realm({
      schema: [{name: 'Student_Info', 
      properties: 
      {
        student_id: {type: 'int',   default: 0},
        student_name: 'string', 
        student_class: 'string',
        student_subject: 'string'
      }}]
    });

    YellowBox.ignoreWarnings([
      'Warning: componentWillMount is deprecated',
      'Warning: componentWillReceiveProps is deprecated',
      'Warning: isMounted(...) is deprecated', 'Module RCTImageLoader'
     ]);
 
  }
 
  add_Student= async ()=>{
  try {
     
    realm.write(() => {
 
      var ID = realm.objects('Student_Info').length + 1;
 
       realm.create('Student_Info', {
         student_id: ID, 
         student_name: this.state.Student_Name, 
         student_class: this.state.Student_Class, 
         student_subject : this.state.Student_Subject
        });
        
    });
 
    Alert.alert("Student Details Added Successfully.")
  } catch (error) {
    Alert.alert("Error")
    
  }
 
  }
 
  render() {
    return (
        <View style={styles.MainContainer}>
          <TextInput 
                placeholder="Enter Student Name"
                style = { styles.TextInputStyle } 
                underlineColorAndroid = "transparent" 
                onChangeText = { ( text ) => { this.setState({ Student_Name: text })} } 
              />
          <TextInput  
                placeholder="Enter Student Class"
                style = { styles.TextInputStyle } 
                underlineColorAndroid = "transparent" 
                onChangeText = { ( text ) => { this.setState({ Student_Class: text })} } 
              />
          <TextInput 
                placeholder="Enter Student Subject"
                style = { styles.TextInputStyle } 
                underlineColorAndroid = "transparent" 
                onChangeText = { ( text ) => { this.setState({ Student_Subject: text })} } 
              />
 
          <TouchableOpacity onPress={this.add_Student} activeOpacity={0.7} style={styles.button} >
            <Text style={styles.TextStyle}> CLICK HERE TO ADD STUDENT DETAILS </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.GoToSecondActivity} activeOpacity={0.7} style={styles.button} >
            <Text style={styles.TextStyle}> SHOW ALL ENTERED DATA INTO LISTVIEW </Text>
          </TouchableOpacity>
        </View>
              
    );
  }
}
 
class ShowDataActivity extends Component
{
  static navigationOptions =
  {
     title: 'ShowDataActivity',
  };
  constructor() {
    super();
    YellowBox.ignoreWarnings([
     'Warning: componentWillMount is deprecated',
     'Warning: componentWillReceiveProps is deprecated',
     'Warning: isMounted(...) is deprecated', 'Module RCTImageLoader'
    ]);
 
   var mydata = realm.objects('Student_Info');
 
 
    this.state = {
      dataSource: mydata,
    };
  
  }
  GoToEditActivity (student_id, student_name, student_class, student_subject) {
    this.props.navigation.navigate('Third', { 
      ID : student_id,
      NAME : student_name,
      CLASS : student_class,
      SUBJECT : student_subject,

    });
    }
  ListViewItemSeparator = () => {
    return (
      <View
        style={{
          height: .5,
          width: "100%",
          backgroundColor: "#000",
        }}
      />
    );
  }
  render()
  {
    console.log(this.state.dataSource )
     return(
        <View style = { styles.MainContainer }>
       <FlatList
        data={this.state.dataSource}
        renderItem={({ item }) => (
          <View style={{flex:1, flexDirection: 'column', borderWidth:1, borderRadius:5, borderColor:'#DDD'}} >
                      <TouchableOpacity onPress={this.GoToEditActivity.bind(this, item.student_id, item.student_name, item.student_class, item.student_subject)} >
                      <Text style={styles.textViewContainer} >{'id = ' + item.student_id}</Text>
                      <Text style={styles.textViewContainer} >{'Name = ' + item.student_name}</Text>
                      <Text style={styles.textViewContainer} >{'Class = ' + item.student_class}</Text>
                      <Text style={styles.textViewContainer} >{'Subject = ' + item.student_subject}</Text>
                      </TouchableOpacity>
                    </View> 
        )}
        keyExtractor={item => item.id}
      />
        </View>
     );
  }
}

class EditActivity extends Component{
  static navigationOptions =
  {
     title: 'EditActivity',
  };
  constructor(){
    super();
 
    this.state = {
      Student_Id : '',
      Student_Name : '',
      Student_Class : '',
      Student_Subject : ''
 
  }
  }

  componentDidMount(){
    this.setState({ 
      Student_Id : this.props.navigation.state.params.ID,
      Student_Name: this.props.navigation.state.params.NAME,
      Student_Class: this.props.navigation.state.params.CLASS,
      Student_Subject: this.props.navigation.state.params.SUBJECT
    })

   }
 
  Update_Student=()=>{
    realm.write(() => {
       var ID = this.state.Student_Id - 1;
       var obj = realm.objects('Student_Info');
       obj[ID].student_name = this.state.Student_Name;
       obj[ID].student_class = this.state.Student_Class;
       obj[ID].student_subject = this.state.Student_Subject;

      });
 
    Alert.alert("Student Details Updated Successfully.")
 
  }

  Delete_Student=()=>{
    realm.write(() => {
      var ID = this.state.Student_Id - 1;
     realm.delete(realm.objects('Student_Info')[ID]);
      });
    Alert.alert("Record Deleted Successfully.")
    this.props.navigation.navigate('First');
 
  }
  render() {
    return (
        <View style={styles.MainContainer}>
          <TextInput 
                value={this.state.Student_Name}
                style = { styles.TextInputStyle } 
                underlineColorAndroid = "transparent" 
                onChangeText = { ( text ) => { this.setState({ Student_Name: text })} } 
              />
          <TextInput  
                value={this.state.Student_Class}
                style = { styles.TextInputStyle } 
                underlineColorAndroid = "transparent" 
                onChangeText = { ( text ) => { this.setState({ Student_Class: text })} } 
              />
          <TextInput 
                value={this.state.Student_Subject}
                style = { styles.TextInputStyle } 
                underlineColorAndroid = "transparent" 
                onChangeText = { ( text ) => { this.setState({ Student_Subject: text })} } 
              />
          <TouchableOpacity onPress={this.Update_Student} activeOpacity={0.7} style={styles.button} >
            <Text style={styles.TextStyle}> CLICK HERE TO UPDATE STUDENT DETAILS </Text>
          </TouchableOpacity>
          <TouchableOpacity  activeOpacity={0.7} style={styles.button} onPress={this.Delete_Student} >
            <Text style={styles.TextStyle}> CLICK HERE TO DELETE CURRENT RECORD </Text>
          </TouchableOpacity>
        </View>
              
    );
  }
}
 
const Project = createStackNavigator(
  {
   First: { screen: MainActivity },
   Second: { screen: ShowDataActivity },
   Third : { screen: EditActivity}
  });
    
const styles = StyleSheet.create({
    
 MainContainer :{
  flex:1,
  justifyContent: 'center',
  paddingTop: (Platform.OS) === 'ios' ? 20 : 0,
  margin: 10
  },
 
  TextInputStyle:
    {
      borderWidth: 1,
      borderColor: '#009688',
      width: '100%',
      height: 40,
      borderRadius: 10,
      marginBottom: 10,
      textAlign: 'center',
    },
 
  button: {
      width: '100%',
      height: 40,
      padding: 10,
      backgroundColor: '#4CAF50',
      borderRadius:7,
      marginTop: 12
    },
     
  TextStyle:{
      color:'#fff',
      textAlign:'center',
    },
 
    textViewContainer: {
      textAlignVertical:'center', 
      padding:10,
      fontSize: 20,
      color: '#000',
      
     }
  });

  export default createAppContainer(Project);