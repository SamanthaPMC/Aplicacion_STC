import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { Alert, TouchableOpacity, useWindowDimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MyIcon } from '../../components/ui/MyIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { useState } from 'react';
import { database, verifition } from '../../../actions/auntentificarFirebase';
import { ref, set } from 'firebase/database';


interface Props extends StackScreenProps<RootStackParams, 'LoginScreen'> { }

export const LoginScreen = ({ navigation }: Props) => {

  const [ci, setCi] = useState<number | null>(null);

  const { height } = useWindowDimensions();

  const handleLogingUser = async () => {
    // Función para validar que el CI tenga 10 números
    const validateCi = (ci: number) => {
      const ciString = ci.toString();
      const ciRegex = /^\d{10}$/;
      return ciRegex.test(ciString);
    };
    // Validar si el CI tiene un formato válido
    if (ci === null || !validateCi(ci)) {
      Alert.alert('Error', 'El CI no es válido mayor o menor a 10 digitos');
      return;
    }
    verifition(ci)
      .then(async (userExists) => {
        if (userExists) {
          console.log(`el ci es ${ci}`)
          navigation.navigate('Onboarding2Screen', { CI: ci, NombreApellido: null, Email: null, Telefono: null });
        } else {
          Alert.alert('El usuario no existe', 'El usuario no tiene una cuenta');
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
        <Layout style={{ paddingTop: height * 0.40 }}>
          <Text category="h1">Ingresar</Text>
          <Text category="p2">Por favor, ingresa la  cédula para continuar</Text>
        </Layout>

        {/* Inputs */}
        <Layout style={{ marginTop: 20 }}>
          <Input
            placeholder="Cedula"
            keyboardType='number-pad'
            accessoryLeft={<MyIcon name="credit-card-outline" />}
            style={{ marginBottom: 10 }}
            onChangeText={(text) => {
              const numericValue = Number(text); // Convierte el texto a número
              setCi(isNaN(numericValue) ? null : numericValue); // Valida si es un número
            }}
          />
        </Layout>

        {/* Space */}
        <Layout style={{ height: 10 }} />

        {/* Button */}
        <Layout>
          <Button
            accessoryRight={<MyIcon name="arrow-forward-outline" white />}
            onPress={() => handleLogingUser()}>Ingresar</Button>
        </Layout>

        {/* Información para crear cuenta */}
        <Layout style={{ height: 50 }} />

        <Layout
          style={{
            alignItems: 'flex-end',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Text>¿Aun no te registras?</Text>
          <Text
            status="primary"
            category="s1"
            onPress={() => navigation.goBack()}
          >
            {' '}
            Registrar aquí{' '}
          </Text>
        </Layout>
      </ScrollView>
    </Layout>
  );
};
