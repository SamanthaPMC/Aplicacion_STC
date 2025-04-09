import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { Alert, TouchableOpacity, useWindowDimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MyIcon } from '../../components/ui/MyIcon';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import { RootStackParams } from '../../navigation/StackNavigator';
import { modificar } from '../../../actions/auntentificarFirebase';

type ModificarScreenRouteProp = RouteProp<RootStackParams, 'ModificarScreen'>;

export const ModificarScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<ModificarScreenRouteProp>();

  const {
    CI: initialCI,
    email: initialEmail,
    nombreApellido: initialNombreApellido,
    telefono: initialTelefono
  } = route.params;

  const [email, setEmail] = useState(initialEmail);
  const [nombreApellido, setNombreApellido] = useState(initialNombreApellido);
  const [telefono, setTelefono] = useState<number | string>(initialTelefono);
  const [ci, setCi] = useState<number | null | string>(initialCI);

  const { height } = useWindowDimensions();


  const handleModificar = async () => {
    // Función para validar que el CI tenga 10 números
    const validateCi = (ci: number | string) => {
      const ciString = ci.toString();
      const ciRegex = /^\d{10}$/;
      return ciRegex.test(ciString);
    };
    // Función para validar el nombre y apellido
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
      Alert.alert("Error", "El correo electrónico no es válido");
      return;
    }

    // Validar si el nombre y apellido tiene un formato válido
    if (!validateNombreApellido(nombreApellido)) {
      Alert.alert("Error", "El nombre no es válido");
      return;
    }

    // Validar si el CI tiene un formato válido
    if (ci === null || !validateCi(ci)) {
      Alert.alert("Error", "El CI no es válido, debe tener 10 dígitos");
      return;
    }

    // Llamar a la función modificar
    try {
      const resultado = await modificar(nombreApellido, ci, telefono, email);
      Alert.alert("Resultado", resultado);
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al modificar el usuario.");
    }
  };

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
          <Text category="h1">Modificar usuario</Text>
          <Text category="p2">Por favor, ingrese los cambios</Text>
        </Layout>

        {/* Inputs con valores iniciales */}
        <Layout style={{ marginTop: 20 }}>
          <Input
            placeholder="Nombre y apellido"
            autoCapitalize="none"
            accessoryLeft={<MyIcon name="edit-outline" />}
            style={{ marginBottom: 10 }}
            value={nombreApellido}
            onChangeText={setNombreApellido}
          />

          <Input
            placeholder="Cédula"
            autoCapitalize="none"
            keyboardType="number-pad"
            accessoryLeft={<MyIcon name="credit-card-outline" />}
            style={{ marginBottom: 10 }}
            value={ci?.toString() || ''}
            showSoftInputOnFocus={false}
            editable={false}    
            disabled
          />

          <Input
            placeholder="Teléfono"
            autoCapitalize="none"
            keyboardType="number-pad"
            accessoryLeft={<MyIcon name="phone-outline" />}
            style={{ marginBottom: 10 }}
            value={telefono.toString()}
            onChangeText={(text) => {
              const numericValue = Number(text);
              setTelefono(isNaN(numericValue) ? 0 : numericValue);
            }}
          />

          <Input
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            accessoryLeft={<MyIcon name="email-outline" />}
            style={{ marginBottom: 10 }}
            value={email}
            onChangeText={setEmail}
          />
        </Layout>

        {/* Botón de Modificar */}
        <Layout>
          <Button
            accessoryRight={<MyIcon name="arrow-forward-outline" white />}
            onPress={handleModificar}>
            Modificar
          </Button>
        </Layout>
      </ScrollView>
    </Layout>
  );
};
