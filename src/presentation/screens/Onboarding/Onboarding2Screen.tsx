import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Button, Layout, Text } from '@ui-kitten/components';
import { useRef, useState } from 'react';
import * as eva from '@eva-design/eva';
import { Alert, useColorScheme } from 'react-native';
import {
    Image,
    ImageSourcePropType,
    NativeScrollEvent,
    NativeSyntheticEvent,
    useWindowDimensions,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { MyIcon } from '../../components/ui/MyIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';


interface Slide {
    title: string;
    desc: string;
    img: ImageSourcePropType;
}

const items: Slide[] = [
    {
        title: 'Encender el dispositivo',
        desc: 'El dispositivo puede tardar unos segundos en encender debido al establecimiento de conexión con el servidor en la nube',
        img: require('../../../assets/images/turnon.png'),
    },
    {
        title: 'Colocación de los sensores',
        desc: 'Antes de comenzar recuerda tener conectado los sensores en la parte del antebrazo y en los dedos índice y medio',
        img: require('../../../assets/images/colocacion.png'),
    },
    {
        title: 'Iniciar el análisis',
        desc: 'Iniciar el análisis para tener un diagnostico realizado los pasos anteriores. Recuerda que no desconectar los sensores hasta terminar el análisis, ni cerrar la aplicación',
        img: require('../../../assets/images/analisis3.png'),
    },
];

interface Props extends StackScreenProps<RootStackParams, 'Onboarding2Screen'> { }
type OnboardingScreenRouteProp = RouteProp<RootStackParams, 'Onboarding2Screen'>;

export const Onboarding2Screen = ({ navigation }: Props) => {
    const route = useRoute<OnboardingScreenRouteProp>();

    const {NombreApellido,CI,Telefono,Email} = route.params;

    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const saveUsuario = async()=>{
        try {
            if (CI == null){
              navigation.navigate('StartScreen', { CI: CI, NombreApellido: null, Email: null, Telefono: null });
            }else{
              navigation.navigate('StartScreen', { CI: CI, NombreApellido: null, Email: null, Telefono: null });
            }
            
        } catch (error) {
            console.log('Error al crear cuenta:', error);
            Alert.alert('Error al guardar usuario', 'Ocurrió un error al registrar el usuario');
        }
    }

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset, layoutMeasurement } = event.nativeEvent;
        const currentIndex = Math.floor(contentOffset.x / layoutMeasurement.width);

        setCurrentSlideIndex(currentIndex > 0 ? currentIndex : 0);
    };

    const scrollToSlide = (index: number) => {
        if (!flatListRef.current) return;

        flatListRef.current.scrollToIndex({
            index: index,
            animated: true,
        });

    };

    return (
        <Layout style={{
            flex: 1,
            // backgroundColor: backgroundColor
        }}>
            <FlatList
                data={items}
                keyExtractor={(item) => item.title}
                ref={ flatListRef }
                renderItem={({ item }) => <SlideItem item={item} />}
                horizontal
                pagingEnabled
                decelerationRate='fast'
                onScroll={onScroll}
            >

            </FlatList>
            {currentSlideIndex === items.length - 1 ? (
                <Button
                    onPress={() =>{saveUsuario()}}
                    style={{ position: 'absolute', bottom: 60, right: 30, width: 120 }}>
                    Finalizar
                </Button>
            ) : (
                <Button style={{
                    position: 'absolute',
                    bottom:60,
                    right: 30,}}
                    appearance='ghost'
                    accessoryRight={<MyIcon name="arrow-forward" color='white' />}
                    onPress={() => scrollToSlide(currentSlideIndex + 1)}
                >
                    Siguiente
                </Button>
            )
            }

        </Layout>
    )
}

interface SlideItemProps {
    item: Slide;

}
const SlideItem = ({ item }: SlideItemProps) => {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? eva.dark : eva.light;
    const backgroundColor = (colorScheme === 'dark')
        ? theme['color-basic-800']
        : theme['color-basic-100'];
    const { width } = useWindowDimensions();
    const { title, desc, img } = item;
    return (
        <Layout style={{
            flex: 1,
            backgroundColor: backgroundColor,
            borderRadius: 5,
            padding: 40,
            justifyContent: 'center',
            width: width
        }}>
            <Image
                source={img}
                style={{
                    width: width * 0.7,
                    height: width * 0.7,
                    resizeMode: 'center',
                    alignSelf: 'center'
                }}
            />
            <Text category='h4'>{title}</Text>
            <Text category='s1'> {desc}</Text>

        </Layout>
    )

}