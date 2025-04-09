import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { Alert, TouchableOpacity, useWindowDimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MyIcon } from '../../components/ui/MyIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { useState } from 'react';
import { register, verifition } from '../../../actions/auntentificarFirebase';
import { useNavigation } from '@react-navigation/native';


export const AddNewUserScreen = () => {
  const navigation = useNavigation();
  const [email, setemail] = useState('');
  const [nombreApellido, setnombreApellido] = useState('');
  const [telefono, setTelefono] = useState<number>(0);
  const [ci, setCi] = useState<number | null>(null);


  const { height } = useWindowDimensions();


  // Manejo del registro
  const handleCreateAccount = () => {

    // Función para validar que el CI tenga 10 números
    const validateCi = (ci: number) => {
      const ciString = ci.toString();
      const ciRegex = /^\d{10}$/;
      return ciRegex.test(ciString);
    };


    const validateNombreApellido = (nombreApellido: string) => {
      const trimmed = nombreApellido.trim();
      const nombreApellidoRegex = /^(\p{L}+(?:[\s'-]\p{L}+)*)(\s\p{L}+(?:[\s'-]\p{L}+)*)+$/u;
      return nombreApellidoRegex.test(trimmed);
    };

    // Función para validar el formato del correo
    const validateEmail = (email: string) => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    };

    // Validar si el correo tiene un formato válido
    if (!validateEmail(email)) {
      Alert.alert('Error', 'El correo electrónico no es válido');
      return;
    }
    // Validar si el nombre y apellido tiene un formato válido
    if (!validateNombreApellido(nombreApellido)) {
      Alert.alert('Error', 'El nombre no es válido');
      return;
    }

    // Validar si el CI tiene un formato válido
    if (ci === null || !validateCi(ci)) {
      Alert.alert('Error', 'El CI no es válido mayor o menor a 10 digitos');
      return;
    }
    verifition(ci)
      .then((userExists) => {
        if (userExists) {
          Alert.alert('El usuario ya existe', 'El usuario ya tiene una cuenta');
        } else {
          register(nombreApellido, ci, telefono, email)
            .then(async () => {
              Alert.alert('Nuevo usuario agregado');
              navigation.goBack();
            })
        }
      })
      .catch((error) => {
        console.error('Error verificando el usuario:', error);
      });

  }
  return (
    <Layout style={{ flex: 1 }}>
      <TouchableOpacity
        style={{
          flexDirection: 'row-reverse',
          position: 'absolute',
          left: 10,
          top: 20,
          zIndex: 1,
        }}
        onPress={() => navigation.goBack()}
      >
        <MyIcon name="arrow-back-outline" />
      </TouchableOpacity>
      <ScrollView style={{ marginHorizontal: 40 }}>
        <Layout style={{ paddingTop: height * 0.30 }}>
          <Text category="h1">Registrar</Text>
          <Text category="p2">Por favor, ingrese los datos del nuevo usuario</Text>
        </Layout>

        {/* Inputs */}
        <Layout style={{ marginTop: 20 }}>
          <Input
            placeholder="Nombre y apellido"

            autoCapitalize="none"
            accessoryLeft={<MyIcon name="edit-outline" />}
            style={{ marginBottom: 10 }}
            onChangeText={(text) => setnombreApellido(text)}
          />

          <Input
            placeholder="Cedula"
            autoCapitalize="none"
            keyboardType='number-pad'
            accessoryLeft={<MyIcon name="credit-card-outline" />}
            style={{ marginBottom: 10 }}
            onChangeText={(text) => {
              const numericValue = Number(text); // Convierte el texto a número
              setCi(isNaN(numericValue) ? null : numericValue); // Valida si es un número
            }}

          />
          <Input
            placeholder="Teléfono"
            autoCapitalize="none"
            keyboardType='number-pad'
            accessoryLeft={<MyIcon name="phone-outline" />}
            style={{ marginBottom: 10 }}
            onChangeText={(text) => {
              const numericValue = Number(text); // Convierte el texto a número
              setTelefono(numericValue); // Valida si es un número
            }}
          />
          <Input
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            accessoryLeft={<MyIcon name="email-outline" />}
            style={{ marginBottom: 10 }}
            onChangeText={(text) => setemail(text)}
          />
        </Layout>


        {/* Space */}
        <Layout style={{ height: 10 }} />

        {/* Button */}
        <Layout>
          <Button
            accessoryRight={<MyIcon name="arrow-forward-outline" white />}
            onPress={() => handleCreateAccount()}>Registrar</Button>
        </Layout>

        {/* Información para crear cuenta */}
        <Layout style={{ height: 50 }} />

        <Layout
          style={{
            alignItems: 'flex-end',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
        </Layout>
      </ScrollView>
    </Layout>
  );
};
