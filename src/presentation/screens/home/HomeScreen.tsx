import { Button, Layout, Text } from '@ui-kitten/components';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { Dimensions, StyleSheet, TouchableOpacity, useWindowDimensions, Image, Alert } from 'react-native';
import { MyIcon } from '../../components/ui/MyIcon';
import {RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { ref, set } from 'firebase/database';
import { database } from '../../../actions/auntentificarFirebase';
import { BackHandler } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');
interface Props extends StackScreenProps<RootStackParams, 'HomeScreen'> { }
type HomeScreenScreenRouteProp = RouteProp<RootStackParams, 'HomeScreen'>;

export const HomeScreen = ({ navigation }: Props) => {
  const route = useRoute<HomeScreenScreenRouteProp>();
  const { Estado, EMG, GSR, CI } = route.params;
  const { width } = useWindowDimensions();
  const [EstadoP, setEstadoP] = useState<any>('');
  const [EMGP, setEMGP] = useState<any>('');
  const [GSRP, setGSRP] = useState<any>('');
  const [boxcolor, setBoxcolor] = useState<string>('')
  const [recomendaciones, setRecomendaciones] = useState('');

  useFocusEffect(
    useCallback(() => {
      const handleBackPress = () => {
        navigation.navigate('PresentationScreen');
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", handleBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      };
    }, [navigation])
  );

  useEffect(() => {
    const AsignarValores = (Estado: any, EMG: any, GSR: any) => {
      let recomendacionesTexto = '';

      if (Estado === 0) {
        setEstadoP('Relajado');
        setBoxcolor('#2ecc71');
        recomendacionesTexto = `• Ejercicios de fortalecimiento: Aprieta una pelota de goma suave para fortalecer los músculos de la mano.\n• Estiramientos: Realiza estiramientos suaves.\n• Masajes: Masajea suavemente la muñeca.\n• Rotaciones de muñeca: Gira suavemente las muñecas en ambas direcciones.`;
      } else if (Estado === 1) {
        setEstadoP('Tenso');
        setBoxcolor('#ffa726');
        recomendacionesTexto = `• Descansa cada 30-40 minutos si estás realizando una tarea repetitiva.\n• Evita posiciones rígidas y forzadas al sujetar herramientas o dispositivos.\n• Alterna tareas: Cambia de actividad para evitar la sobrecarga en una sola zona.\n• Evita movimientos repetitivos prolongados: Si puedes, distribuye la carga de trabajo en ambas manos.`;
      } else if (Estado === 2) {
        setEstadoP('Fatiga');
        setBoxcolor('#f44336');
        recomendacionesTexto = `• Frío: Aplica frío en la muñeca.\n•Ajusta tu estación de trabajo: Si usas teclado y ratón, mantenlos a una altura adecuada, con la muñeca en posición neutral (ni doblada hacia arriba ni hacia abajo). \n• Aplica la regla 20-20-20: Cada 20 minutos, descansa 20 segundos y mueve las manos.\n•Sujeta las herramientas correctamente: Evita un agarre demasiado fuerte o incómodo si trabajas con herramientas manuales.`;
      }
      setEMGP(EMG);
      setGSRP(GSR);

      setRecomendaciones(recomendacionesTexto);
    };

    AsignarValores(Estado, EMG, GSR);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const currentCI = CI;
    console.log(`el CI es mira este ${CI}`)
    if (!currentCI) {
      console.log("❌ No se ejecuta GuardarHistorial porque CI es null.");
      return;
    }
    GuardarHistorial(currentCI).then(() => {
      if (isMounted) {
        console.log("✅ Historial guardado correctamente.");
      }
    });

    return () => {
      isMounted = false;
    };
  }, [CI]);

  const GuardarHistorial = async (currentCI: any) => {
    console.log(`✅ Guardando historial para UID: ${currentCI}`);

    // Obtener fecha y hora actual
    const now = new Date();
    const fecha = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const hora = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    try {
      console.log(`cuando se guarad es ${currentCI}`)
      await set(ref(database, `users/${currentCI}/historial/${fecha}/${hora}/estado`), Estado);
      await set(ref(database, `users/${currentCI}/historial/${fecha}/${hora}/EMG`), EMG);
      await set(ref(database, `users/${currentCI}/historial/${fecha}/${hora}/GSR`), GSR);
      console.log("✅ Historial guardado correctamente.");
    } catch (error) {
      console.error("❌ Error al guardar el historial:", error);
    }
  };


  // Función para obtener la imagen dependiendo de EstadoP
  const getImageSource = () => {
    switch (Estado) {
      case 0:
        return require('../../../assets/images_home/image_1.png'); // Cambia la ruta según tu estructura
      case 1:
        return require('../../../assets/images_home/image_2.png');
      case 2:
        return require('../../../assets/images_home/image_3.png');
      default:
        return require('../../../assets/images_home/image_1.png'); // Imagen por defecto
    }
  };

  return (
    <Layout style={styles.container}>
      <Text style={{ position: 'absolute', top: width * 0.02, left: width * 0.28 }}>
        {`CI Paciente: ${CI || "No registrado"}`}
      </Text>
      <Text style={{ position: 'absolute', top: width * 0.06, left: width * 0.3 }} category='h1'> Análisis </Text>

      {/* Botón de regreso */}
      <Layout style={{ position: 'absolute', top: width * 0.01, alignSelf: 'flex-start', paddingLeft: 5 }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('PresentationScreen')
          }}
        >
          <MyIcon name="undo-outline" color='black' />
        </TouchableOpacity>
      </Layout>

      {/* Botón de historial*/}
      <Layout style={{ position: 'absolute', top: width * 0.01, alignSelf: 'flex-end', paddingRight: 10 }}>
        <TouchableOpacity
          onPress={() => {

            if (CI != null) {
              navigation.navigate('HistoryScreen', { CI: CI })
            } else {
              Alert.alert('Realizaste un analisis rapido')
            }

          }}
        >
          <MyIcon name="clipboard-outline" color='black' />
        </TouchableOpacity>
      </Layout>


      <Layout style={{ width: width, flex: 0.07, top: width * 0.2, alignItems: 'center', justifyContent: 'center', borderColor: '#ddd', borderWidth: 1 }}>
        <Text style={{}} category='h2'>
          Estado
        </Text>
      </Layout>

      <Layout
        style={{
          flex: 0.2,
          width: width,
          justifyContent: 'space-between',
          alignItems: 'center',
          top: width * 0.2,
          flexDirection: 'row',
        }}>
        <Layout
          style={{
            flex: 1,
            backgroundColor: boxcolor,
            width: width,
            height: width * 0.4,
            justifyContent: 'center',
            alignItems: 'center',
            // borderRadius: 50,
            borderColor: '#ddd',
            borderWidth: 1,
          }}>
          <Text
            style={{
              width: '100%',
              textAlign: 'center',
            }}
            category='h2'
          >
            {EstadoP}
          </Text>
        </Layout>

        <Layout
          style={{
            flex: 0.8,
            // paddingLeft:5,
            // backgroundColor: 'black',
            height: width * 0.4,
            width: width,
            justifyContent: 'center',
            // alignItems: 'stretch',
            paddingBottom: 30,
            paddingRight: 30,
            // borderRadius: 50,
            // backgroundColor:'black',
            borderColor: '#ddd',
            borderWidth: 1,

          }}>
          <Image
            source={getImageSource()}
            style={{
              width: '150%', 
              height: '150%',
              resizeMode: 'contain',
              // backgroundColor:'red'
            }}
          />
        </Layout>
      </Layout>



      <Layout style={{ flex: 0.1, top: width * 0.2, justifyContent: 'center', alignItems: 'center', borderColor: '#ddd', borderWidth: 1, }}>
        <Text category='h2' >
          Datos obtenidos:
        </Text>
      </Layout>

      <Layout style={{ flex: 0.1, top: width * 0.2, width: width, justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row' }}>

        {/* Cuadro izquierdo */}
        <Layout
          style={{
            // backgroundColor: 'red',
            width: width * 0.4,
            height: width * 0.2,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: '#ddd',
            borderWidth: 1,
            // borderRadius: 50,
          }}
        >
          <Text category="h4">EMG (µV)</Text>
        </Layout>

        {/* Cuadro derecho */}
        <Layout
          style={{
            // backgroundColor: 'red',
            width: width * 0.4,
            height: width * 0.2,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: '#ddd',
            borderWidth: 1,
            // borderRadius: 50,
          }}
        >
          <Text category="h4">GSR (Ω)</Text>
        </Layout>
      </Layout>

      <Layout style={{ flex: 0.1, top: width * 0.2, width: width, justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row' }}>

        {/* Cuadro izquierdo */}
        <Layout
          style={{
            // backgroundColor: 'red',
            width: width * 0.4,
            height: width * 0.2,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            // borderRadius: 50,
            borderColor: '#ddd',
            borderWidth: 1,
            backgroundColor: boxcolor,

          }}
        >
          <Text category="h4">{EMGP}</Text>
        </Layout>

        {/* Cuadro derecho */}
        <Layout
          style={{
            // backgroundColor: 'red',
            width: width * 0.4, 
            height: width * 0.2,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            // borderRadius: 50,
            borderColor: '#ddd',
            borderWidth: 1,
            backgroundColor: boxcolor,

          }}
        >
          <Text category="h4">{GSRP}</Text>
        </Layout>
      </Layout>

      <Layout style={styles.textInputContainer}>
        <Text style={styles.textInput}>Recomendaciones:</Text>
        <Layout style={styles.recomendacionesContainer}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            <Text style={styles.recomendacionesText}>{recomendaciones}</Text>
          </ScrollView>
        </Layout>
        <Button style={styles.boton} onPress={() => { navigation.navigate('StartScreen', { CI: CI, NombreApellido: null, Email: null, Telefono: null }) }}>
          Realizar otro análisis
        </Button>
      </Layout>



    </Layout>



  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInputContainer: {
    flex: 0.32,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    top: width * 0.2,
    paddingHorizontal: 20,
  },
  textInput: {
    width: "100%",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  recomendacionesContainer: {
    width: "100%",
    height: 150,
    // backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  recomendacionesText: {
    fontSize: 16,
    textAlign: "justify",
  },
  boton: {
    marginTop: 10,
    backgroundColor: "#007bff",
    borderColor: "transparent",
  },
});
