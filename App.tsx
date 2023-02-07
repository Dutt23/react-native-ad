import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import Ball from './src/components/Ball'
import Deck from './src/components/Deck'
import { Card, Button, Icon } from 'react-native-elements';

const DATA = [
  { id: 1, text: 'Card #1', uri: 'https://picsum.photos/id/237/200/300' },
  { id: 2, text: 'Card #2', uri: 'https://picsum.photos/200/300' },
  { id: 3, text: 'Card #3', uri: 'https://picsum.photos/200/300' },
  { id: 4, text: 'Card #4', uri: 'https://picsum.photos/seed/picsum/200/300' },
  { id: 5, text: 'Card #5', uri: 'https://picsum.photos/seed/picsum/200/300' },
  { id: 6, text: 'Card #6', uri: 'https://picsum.photos/id/23/200/300' },
  { id: 7, text: 'Card #7', uri: 'https://picsum.photos/id/27/200/300' },
  { id: 8, text: 'Card #8', uri: 'https://picsum.photos/id/7/200/300' },
];

export default function App() {

  const renderCard = ({ id, text, uri}) => {
    return (
      <Card key = {id}>
        <Card.Title>{text}</Card.Title>
        <Card.Divider/>
        <Card.Image source={{ uri }}></Card.Image>
        <Text style={{ marginBottom: 20, marginTop: 20}}>
          Customized here
        </Text>
        <Button
      icon={<Icon name='code' color='#03a9f4' />}
      buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
      title='VIEW NOW!' />
      </Card>)
  }
  
  const renderNoMoreCards = () =>{
    return (
      <Card>
        <Card.Title>All done</Card.Title>
        <Card.Divider/>
        <Text style={{ marginBottom: 10}}>
          Customized here
        </Text>
        <Button
      icon={<Icon name='code' color='#03a9f4' />}
      buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
      title='GET MORE!' />
      </Card>
    )
  }
  return (
    <View>
      <Deck 
      onSwipeLeft={(item) => console.log(`Somsrhing has swiped left ${item.id}`)}
      onSwipeRight={(item) => console.log(`Somehing was swiped right ${item.id}`)}
      data={DATA}
      renderCard={renderCard}
      renderNoMoreCards={renderNoMoreCards}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#fff',
    // Aliging to center
    alignItems: 'center',
    // justifyContent: 'center',
  },
});
