import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';
import { initializeApp } from "firebase/app";
import { getDatabase, push, ref, onValue, remove, child } from 'firebase/database';
import { API_KEY } from '@env';

export default function App() {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: { API_KEY },
    authDomain: "shoppinglist-cf4d0.firebaseapp.com",
    projectId: "shoppinglist-cf4d0",
    storageBucket: "shoppinglist-cf4d0.appspot.com",
    messagingSenderId: "137346739978",
    appId: "1:137346739978:web:4db67b83a090ce724414f3"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  ref(database, 'list/')

  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [list, setList] = useState([]);

  const initialFocus = useRef(null);

  // Save product
  const saveItem = () => {
    push(
      ref(database, 'list/'),
      { 'product': product, 'amount': amount });

    setProduct("");
    setAmount("");
    initialFocus.current.focus();
  }

  // Realtime update
  useEffect(() => {
    const itemsRef = ref(database, 'list/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      
      const products = data ? Object.keys(data).map(key => ({ key, ...data[key] })) : [];
      setList(products)
    })
  }, []);

  // Delete product
  const deleteItem = (item) => {
    // const key = push(child(ref(database), 'list/')).key;
    // console.log(key);
  }

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
};

  return (
    <View style={styles.container}>
      <TextInput placeholder='Product' ref={initialFocus} style={{marginTop: 30, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(product) => setProduct(product)}
        value={product}/>  
      <TextInput placeholder='Amount' style={{ marginTop: 5, marginBottom: 10,  fontSize:18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(amount) => setAmount(amount)}
        value={amount}/>
      <Button onPress={saveItem} title="Save" /> 
      <Text style={styles.title}>Shopping list</Text>
      <FlatList 
        style={{marginLeft : "5%"}}
        renderItem={({item}) => <View style={styles.listcontainer}><Text style={{fontSize: 18}}>{item.product}, {item.amount}</Text>
        <Text style={{fontSize: 18, color: '#0000ff'}} onPress={() => deleteItem(item)}> - delete</Text></View>} 
        data={list} 
        ItemSeparatorComponent={listSeparator} 
      />      
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 25
 },
 listcontainer: {
  flexDirection: 'row',
  backgroundColor: '#fff',
  alignItems: 'center'
 },
 title: {
  fontSize: 20,
  fontWeight: 'bold',
  marginTop: 30,
  marginBottom: 10
 }
});
