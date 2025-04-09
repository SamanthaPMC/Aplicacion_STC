import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Spinner, Text } from '@ui-kitten/components';
import { get, onValue, ref, set } from 'firebase/database';
import { database } from '../../../actions/auntentificarFirebase';
import { RootStackParams } from '../../navigation/StackNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import { Alert, BackHandler, Dimensions } from 'react-native';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';

interface Props extends StackScreenProps<RootStackParams, 'LoadingScreen'> { }
type LoandingScreenRouteProp = RouteProp<RootStackParams, 'LoadingScreen'>;

const { width } = Dimensions.get('window');

const tips = [
  'Recuerda mantener los sensores conectados durante la medición.',
  'En análisis rápido no se guarda un registro del paciente.',
  'Consulta el historial para analizar estadisticas anteriores.',
  'Recuerda seguir las recomendaciones.',
];

export const LoadingScreen = ({ navigation }: Props) => {
  const route = useRoute<LoandingScreenRouteProp>();
  const { CI } = route.params;
  const [currentTip, setCurrentTip] = useState(tips[0]);
  const [tipIndex, setTipIndex] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const handleBackPress = () => {
        Alert.alert("Aviso", "Análisis en curso");
        return true; 
      };

      BackHandler.addEventListener("hardwareBackPress", handleBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      };
    }, [])
  );


  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCurrentTip(tips[tipIndex]);
  }, [tipIndex]);
  const DatosObtenidos = async () => {
    try {
      const estadoSnapshot = await get(ref(database, 'Analisis/Resultado'));
      const Estado = estadoSnapshot.val();
      const GSRSnapshot = await get(ref(database, 'Analisis/GSR'));
      const GSR = GSRSnapshot.val();
      const EMGSnapshot = await get(ref(database, 'Analisis/EMG'));
      const EMG = EMGSnapshot.val();
      console.log(`El estado es una ${Estado}`)
      return { Estado, GSR, EMG };
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  
  useEffect(() => {
    console.log(`Este es el CI:---${CI}`);
  
    const emgRef = ref(database, `Analisis/Inicio`);
    const unsubscribe = onValue(emgRef, async (snapshot) => {
      const emgValue = snapshot.val();
      if (emgValue == 0) {
        const datos = await DatosObtenidos();
        if (datos) {
          console.log("⌛ Esperando 10 segundos antes de navegar...");
  
          setTimeout(() => {
            console.log("✅ Navegando a HomeScreen...");
            navigation.navigate('HomeScreen', {
              Estado: datos.Estado,
              EMG: datos.EMG,
              GSR: datos.GSR,
              CI: CI,
            });
          }, 10000); 
        }
      }
    });
  
    return () => {
      console.log("🔥 Desuscribiendo de Firebase");
      unsubscribe();
    };
  }, [CI]);


  return (
    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Spinner status="primary" size="large" />
      <Text style={{ marginTop: 20, textAlign: 'center', paddingHorizontal: 20 }} category='h6'>
        {currentTip}
      </Text>
    </Layout>
  );
};
