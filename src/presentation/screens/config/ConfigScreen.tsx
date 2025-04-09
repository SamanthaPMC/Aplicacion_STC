import { useState } from 'react';
import { Button, Icon, Input, Layout, Text } from "@ui-kitten/components"
import { TouchableWithoutFeedback, useWindowDimensions, Image, Alert, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler"
import { MyIcon } from "../../components/ui/MyIcon";
import { useNavigation } from '@react-navigation/native';
import { database } from '../../../actions/auntentificarFirebase';
import { ref, set } from 'firebase/database';

export const ConfigScreen = () => {
    const navigation = useNavigation()

    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const [ssid, setSsid] = useState('');
    const [password, setPassword] = useState('');

    const sendCredentials = async () => {
        if (!ssid || !password) {
            Alert.alert('Error', 'Por favor ingrese el SSID y la contraseña');
            return;
        }
    
        Alert.alert(
            "Confirmación",
            "¿Seguro que deseas enviar las credenciales de WiFi?",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Enviar",
                    onPress: async () => {
                        try {
                            const ssidRef = ref(database, `Wifi/SSID`);
                            const passwordRef = ref(database, `Wifi/Password`);
                            const controlRef = ref(database, `Wifi/Control`);
                            const control = 1;
                            await set(ssidRef, ssid);
                            await set(passwordRef, password);
                            await set(controlRef,control);
    
                            Alert.alert("Éxito", "Las credenciales de WiFi han sido enviadas.");
                        } catch (error) {
                            console.error("Error al enviar credenciales:", error);
                            Alert.alert("Error", "No se pudieron enviar las credenciales.");
                        }
                    },
                    style: "default",
                },
            ]
        );
    };
    
    const resetCredentials = async () => {
        Alert.alert(
            "Confirmación",
            "¿Seguro que deseas restablecer las credenciales de WiFi?",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Enviar",
                    onPress: async () => {
                        try {
                            // Referencia en Firebase
                            const controlRef = ref(database, `Wifi/Control`);
                            const control = 2;
                            // Guardar datos en Firebase
                            await set(controlRef, control);
    
                            Alert.alert("Éxito", "Las credenciales de WiFi han sido restablecidas.");
                        } catch (error) {
                            console.error("Error en restablecer credenciales:", error);
                            Alert.alert("Error", "No se pudieron restablecer las credenciales.");
                        }
                    },
                    style: "default",
                },
            ]
        );
    };


    const toggleSecureEntry = (): void => {
        setSecureTextEntry(!secureTextEntry);
    };
    const { height } = useWindowDimensions();


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
                <Layout style={{ justifyContent: 'center', alignItems: 'center', paddingTop: height * 0.30 }}>

                    <Text style={{ textAlign: 'center' }} category="h3">Configuración de red</Text>
                    <Text style={{ textAlign: 'center' }} category="c2">Por favor, ingrese los siguientes datos de su red para continuar</Text>
                </Layout>

                {/* Ingreso de credenciales: SSID */}
                <Layout style={{ marginTop: 20 }}>
                    <Input
                        placeholder="SSID"
                        autoCapitalize="none"
                        accessoryLeft={<MyIcon name="globe" />}
                        style={{ marginBottom: 10 }}
                        onChangeText={(val) => setSsid(val)}
                    />
                    <Input
                        placeholder="Contraseña"
                        autoCapitalize="none"
                        secureTextEntry={secureTextEntry}
                        accessoryLeft={<MyIcon name="lock-outline" />}
                        accessoryRight={renderIcon}
                        style={{ marginBottom: 10 }}
                        onChangeText={(val) => setPassword(val)}
                    />

                    {/* Button */}
                    <Layout>
                        <Button
                            accessoryRight={<MyIcon name="cloud-upload" white />}
                            onPress={() => {
                                sendCredentials();
                            }}
                        // appearance="fille"
                        >
                            Enviar
                        </Button>
                        <Button
                            accessoryRight={<MyIcon name="cloud-upload" white />}
                            onPress={() => {
                                resetCredentials();
                            }}
                        // appearance="fille"
                        >
                            Restablecer a valores por defecto
                        </Button>
                    </Layout>



                </Layout>
            </ScrollView>
        </Layout>
    )
}