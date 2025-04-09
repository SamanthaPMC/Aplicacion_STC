import { Alert, Animated, Easing, Image, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import { Button, Layout, Text } from '@ui-kitten/components';
import { MyIcon } from '../../components/ui/MyIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';

interface Props extends StackScreenProps<RootStackParams, 'PresentationScreen'> { }

export const PresentationScreen = ({ navigation }: Props) => {
  const { height } = useWindowDimensions();
  const [opacity] = useState(new Animated.Value(0));
  ///? Mostrar boton Información and Configuración
  const handlePressInF = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 100,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };


  const handleAnalisisRapido = () =>{
    try {
      navigation.navigate('Onboarding2Screen', {CI:null,NombreApellido:null,Email:null,Telefono:null})
    } catch (error) {
      Alert.alert('Error al ingresar a la base de datos')
    }
  }
  return (
    <Layout style={{ flex: 1 }}>
      <TouchableOpacity
        style={{
          // flexDirection: 'row',
          justifyContent:'flex-start',
          position: 'absolute',
          left:20 ,
          top:20,
          zIndex: 2,
        }}
        onPress={() => {navigation.navigate('InfoScreen')}}
      >
        <MyIcon name="info-outline" white />
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          // flexDirection: 'row',
          justifyContent:'flex-start',
          position: 'absolute',
          right:20 ,
          top:20,
          zIndex: 2,
        }}
        onPress={() => {navigation.navigate('AuthAdminScreen')}}
      >
        <MyIcon name="person" white />
      </TouchableOpacity>




      <Text category='h1' style={{ color: 'white', textAlign: 'center', position: 'absolute', top: height * 0.30, zIndex: 2 }} >
        Dispositivo electrónico como apoyo a la prevención del STC
      </Text>
      <Image
        source={require('../../../assets/images/utn.png')}
        style={{ position: 'absolute', height: height * 0.15, width: height * 0.15, marginTop: height * 0.15, zIndex: 2, alignSelf: 'center' }}
      // resizeMode="contain"
      />

      <Image
        source={require('../../../assets/images/background.png')}
        style={{ height: height, width: height, marginTop: 100, zIndex: 0 }}
      // resizeMode="contain"
      />
      <Image
        source={require('../../../assets/images/background.png')}
        style={{ height: height, width: height, position: 'absolute', zIndex: 0 }}
      // resizeMode="contain"
      />
      <Image
        source={require('../../../assets/images/light.png')}
        style={{ marginLeft: height * 0.03, position: 'absolute', top: -80, zIndex: 1 }}
      // resizeMode="contain"
      />

      <Image
        source={require('../../../assets/images/light.png')}
        style={{ position: 'absolute', top: -130, marginLeft: height * 0.35, zIndex: 1 }}
      // resizeMode="contain"
      />

      <Layout style={{ position: 'absolute', top: height * 0.65, alignSelf: 'center' }}>
        <Button style={{ width: 250, justifyContent: 'space-between', borderColor: 'white' }}
          accessoryRight={<MyIcon name="clipboard-outline" color='black' />}
          //  status='control'
          appearance='outline'
          onPress={() => navigation.navigate('RegisterScreen')}
        >Registrar paciente
        </Button>
      </Layout>
      <Layout style={{ position: 'absolute', top: height * 0.75, alignSelf: 'center' }}>
        <Button style={{ width: 250, justifyContent: 'space-between', borderColor: 'white' }}
          accessoryRight={<MyIcon name="clock-outline" color='black' />}
          //  status='control'
          appearance='outline'
          onPress={() => handleAnalisisRapido()}
        >
          Analisis rapido
        </Button>
      </Layout>
      <Layout style={{ position: 'absolute', top: height * 0.85, alignSelf: 'center' }}>
        <Button style={{ width: 250, justifyContent: 'space-between', borderColor: 'white' }}
          accessoryRight={<MyIcon name="settings-2-outline" color='black' />}
          //  status='control'
          appearance='outline'
          onPress={() => navigation.navigate('ConfigScreen')}
        >
          Configuración de red
        </Button>
      </Layout>


    </Layout>

  )
}

const styles = StyleSheet.create({
  tooltip2: {
    position: 'absolute',
    top: 30,
    padding: 6,
    borderRadius: 10,
    color: 'black',
    fontSize: 12,
    backgroundColor: 'white',
    right: 0,
  },
});