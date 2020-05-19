import React, { Component } from 'react';
import { StyleSheet,Text,  View } from 'react-native';
import * as firebase from 'firebase';
import { firebaseConfig} from './config';
import {Item,Input,Label,Button,List,ListItem} from 'native-base';
import Constants from 'expo-constants'

firebase.initializeApp(firebaseConfig);

export default class App extends Component {

  state={
    text:"",
    mylist:[]
  }

componentDidMount(){
  const myitems=firebase.database().ref("mywishes");
  myitems.on("value",datasnap=>{
   // console.log(Object.values(datasnap.val()))
   if(datasnap.val()){
   this.setState({mylist:Object.values(datasnap.val())})
   }
  })
}
saveitem(){
  const mywishes = firebase.database().ref("mywishes");
  mywishes.push().set({
    text:this.state.text,
    time:Date.now()
  })
  this.setState({text:""})
}
  RemoveIt(){
    firebase.database().ref("mywishes").remove();
    this.setState({mylist:[]})
  }
  render(){

    console.log(this.state)

    const myitems=this.state.mylist.map(item=>{
      return(
        <ListItem style={{justifyContent:'space-between'}} key={item.time}>
          <Text>{item.text}</Text>
          <Text>{new Date(item.time).toDateString()}</Text>

        </ListItem>
      )
    })
  return (
    <View style={styles.container}>
      <Item floatingLabel>
       <Label>Add items</Label>
       <Input 
       value={this.state.text}
       onChangeText={(text)=>this.setState({text:text})}
       />
      </Item>
      <View style={{flexDirection:"row",padding:20,justifyContent:"space-around"}}>
        <Button rounded success style={styles.mybtn} onPress={()=>this.saveitem()}>
          <Text style={styles.text} >Add</Text> 
        </Button>
        <Button rounded danger style={styles.mybtn} onPress={() => this.RemoveIt()}>
          <Text style={styles.text}>Delete All</Text>
        </Button>
      </View>
      <List>
        {myitems}
      </List>
    </View>
  );
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:Constants.statusBarHeight
  },
  mybtn:{
    padding:10,
    width:120,
    justifyContent:"center"
  },
  text:{
    color:'white',
    fontSize:20
  }
});
