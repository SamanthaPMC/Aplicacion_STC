import React from 'react'
import { Button, Layout, Text } from '@ui-kitten/components'
import { MyIcon } from '../../components/ui/MyIcon'
import { TouchableOpacity, useWindowDimensions } from 'react-native';
import { RootStackParams } from '../../navigation/StackNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import { CommonActions, RouteProp, useRoute } from '@react-navigation/native';
import { database } from '../../../actions/auntentificarFirebase';
import { ref, set } from 'firebase/database';
interface Props extends StackScreenProps<RootStackParams, 'StartScreen'> { }
type StartScreenScreenRouteProp = RouteProp<RootStackParams, 'StartScreen'>;

export default function StartScreen({ navigation }: Props) {
    const route = useRoute<StartScreenScreenRouteProp>();
    const { NombreApellido, CI, Email, Telefono } = route.params;
    const { width } = useWindowDimensions();

    const handleNextScreen = async () => {
        if (NombreApellido == null && CI == null && Email == null && Telefono == null) {
            await set(ref(database, `Analisis/Inicio`), 1);
            console.log(`Camino 1 ci es ${CI}`)
            const newCI = null
            navigation.navigate('LoadingScreen', { CI: newCI })
        } else {
            console.log(`Camino 2 ci es ${CI}`)
            await set(ref(database, `Analisis/Inicio`), 1);
            navigation.navigate('LoadingScreen', { CI: CI })
        }
    }
    return (
        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
            <Text category='h6' >Recuerda conectar los sensores antes de iniciar la medición</Text>
            <Button
                style={{ width: width * 0.3, top: width * 0.5, borderColor: 'white' }}
                accessoryRight={<MyIcon name="arrow-right-outline" white />}
                onPress={() => handleNextScreen()}
            >
                Iniciar

            </Button>
        </Layout>
    )
}