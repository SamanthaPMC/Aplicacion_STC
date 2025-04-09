import { Button, Icon, Input, Layout, Text } from '@ui-kitten/components';
import { Alert, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MyIcon } from '../../components/ui/MyIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { useState } from 'react';
import { database, signInAdmin, verifition } from '../../../actions/auntentificarFirebase';
import { ref, set } from 'firebase/database';


interface Props extends StackScreenProps<RootStackParams, 'AuthAdminScreen'> { }

export const AuthAdminScreen = ({ navigation }: Props) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [Password, setPassword] = useState('');
  const [User, setUser] = useState('');
  const { height } = useWindowDimensions();

  const toggleSecureEntry = (): void => {
    setSecureTextEntry(!secureTextEntry);
  };

  const handleLogingUser = async () => {
    if (!User) {
      Alert.alert("Ingrese el usuario");
      return;
    }
    if (!Password) {
      Alert.alert("Ingrese la contraseña");
      return;
    }

    try {
      const response = await signInAdmin(User, Password); // Espera la respuesta
      if (response.success) {
        navigation.navigate("AdminScreen"); // Solo si la autenticación es exitosa
      } else {
        Alert.alert("Error", response.message); // Muestra el mensaje de error
      }
    } catch (error) {
      Alert.alert("Error en la autenticación");
    }
  };


  const renderIcon = (props: any): React.ReactElement => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon
        {...props}
        name={secureTextEntry ? 'eye-off' : 'eye'}
      />
    </TouchableWithoutFeedback>
  );

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
          <Text category="h1">Administrador</Text>
          <Text category="p2">Por favor, ingresa los siguientes datos</Text>
        </Layout>

        {/* Inputs */}
        <Layout style={{ marginTop: 20 }}>
          <Input
            placeholder="Usuario"
            keyboardType='default'
            accessoryLeft={<MyIcon name="person" />}
            style={{ marginBottom: 10 }}
            onChangeText={(text) => setUser(text)}
          />
          <Input
            placeholder="Contraseña"
            autoCapitalize="none"
            secureTextEntry={secureTextEntry}
            accessoryLeft={<MyIcon name="lock-outline" />}
            accessoryRight={renderIcon}
            style={{ marginBottom: 10 }}
            onChangeText={(text) => setPassword(text)}
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
        </Layout>
      </ScrollView>
    </Layout>
  );
};
