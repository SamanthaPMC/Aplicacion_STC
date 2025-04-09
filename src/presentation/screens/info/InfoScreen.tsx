import React from 'react';
import { Layout, Text } from '@ui-kitten/components';
import { View, Image, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MyIcon } from '../../components/ui/MyIcon';
import { useNavigation } from '@react-navigation/native';

export const InfoScreen = () => {
    const navigation = useNavigation()
    return (
        <Layout style={styles.container}>
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
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Imagen */}
                <Image source={require('../../../assets/images/utn.png')} style={styles.image} />

                {/* Descripción */}
                <Text category='h6' style={styles.title}>Descripción:</Text>
                <Text style={styles.justifiedText}>La aplicación móvil tiene como objetivo de monitorizar un dispositivo basado en inteligencia artificial y redes neuronales que ayude a prevenir el Síndrome del Túnel Carpiano (STC) en trabajadores que realizan movimientos repetitivos con las manos.</Text>

                {/* ¿Cómo funciona? */}
                <Text category='h6' style={styles.subtitle}>¿Cómo funciona?</Text>
                <View style={styles.list}>
                    <Text style={styles.justifiedText}>- La aplicación móvil recopila los datos del dispositivo físico mediante sensores que miden la respuesta galvánica de la piel y la electromiografía.</Text>
                    <Text style={styles.justifiedText}>- La información es procesada por un modelo de red neuronal que detecta signos tempranos de fatiga muscular.</Text>
                    <Text style={styles.justifiedText}>- La aplicación muestra a los usuarios la detección de riesgos de lesión, sugiriendo pausas y ejercicios preventivos.</Text>
                </View>

                {/* ¿Por qué es importante? */}
                <Text category='h6' style={styles.subtitle}>¿Por qué es importante?</Text>
                <View style={styles.list}>
                    <Text style={[styles.justifiedText]}>- El STC es una de las principales causas de discapacidad laboral.</Text>
                    <Text style={styles.justifiedText}>- Detectar signos tempranos de fatiga muscular puede reducir el riesgo de lesiones crónicas.</Text>
                    <Text style={styles.justifiedText}>- Mejora la ergonomía y la salud laboral en oficinas y otros entornos de trabajo.</Text>
                </View>

                {/* Información del desarrollador */}
                <Text category='h6' style={styles.subtitle}>Desarrollado por:</Text>
                <Text style={styles.justifiedText}>Samantha Mishell Pérez – Universidad Técnica del Norte</Text>
                <Text style={styles.justifiedText}>Carrera de Telecomunicaciones</Text>

                {/* Contacto */}
                <Text category='h6' style={styles.subtitle}>Más información:</Text>
                <TouchableOpacity onPress={() => Linking.openURL('mailto:snsns@gmail.com')}>
                    <Text style={styles.link}>smperec@utn.edu.ec</Text>
                </TouchableOpacity>
            </ScrollView>

        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    image: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginBottom: 20,
    },
    scrollContainer: {
        padding: 20,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subtitle: {
        fontWeight: 'bold',
        marginTop: 15,
    },
    list: {
        marginLeft: 10,
    },
    justifiedText: {
        textAlign: 'justify',
    },
    link: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
});

export default InfoScreen;
