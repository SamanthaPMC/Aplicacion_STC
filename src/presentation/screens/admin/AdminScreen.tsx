import React, { useEffect, useState } from "react";
import { View, FlatList, TouchableOpacity, useWindowDimensions, Alert } from "react-native";
import { Button, Text, Layout, Card } from "@ui-kitten/components";
import { getDatabase, ref, get, remove, onValue } from "firebase/database";
import { MyIcon } from "../../components/ui/MyIcon";
import { backgroundColor } from "../../../productsApp";
import { useNavigation } from "@react-navigation/native";
import { database } from "../../../actions/auntentificarFirebase";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';

const AdminScreen = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParams>>();
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

    const { height } = useWindowDimensions();

    console.log(`el fondo es: ${backgroundColor}`)
    useEffect(() => {
        const db = getDatabase();
        const usersRef = ref(db, "users");

        const unsubscribe = onValue(usersRef, (snapshot) => {
            if (snapshot.exists()) {
                const usersData = snapshot.val();
                console.log("Usuarios obtenidos:", usersData); 

                const formattedUsers = Object.keys(usersData).map((key) => ({
                    cedula: key,
                    nombreApellido: usersData[key].nombreApellido || "Sin nombre",
                    telefono: usersData[key].telefono || "Sin teléfono",
                    email: usersData[key].email || "Sin email",
                }));

                console.log("Usuarios formateados:", formattedUsers);
                setUsers([...formattedUsers]);
            } else {
                console.log("No hay usuarios en la base de datos.");
                setUsers([]); 
            }
        });

        return () => unsubscribe();
    }, []);


    const handleSelectUser = (user: any) => {
        setSelectedUsers((prevSelected) => {
            if (prevSelected.some((u) => u.cedula === user.cedula)) {
                return prevSelected.filter((u) => u.cedula !== user.cedula);
            } else {
                return [...prevSelected, user];
            }
        });
    };

    const handleModify = () => {
        if (selectedUsers.length === 1) {
            const { cedula, email, nombreApellido, telefono } = selectedUsers[0];
            console.log("Modificar usuario:", cedula, email, nombreApellido, telefono);
            navigation.navigate('ModificarScreen', { CI: cedula, email: email, nombreApellido: nombreApellido, telefono: telefono });

        }
    };

    const handleDelete = () => {
        if (selectedUsers.length > 0) {
            Alert.alert(
                "Confirmar eliminación",
                `¿Estás seguro de que quieres eliminar ${selectedUsers.length > 1 ? "estos usuarios" : "este usuario"}?`,
                [
                    { text: "Cancelar", style: "cancel" },
                    {
                        text: "Eliminar",
                        style: "destructive",
                        onPress: async () => {
                            try {
                                const deletePromises = selectedUsers.map(async (user) => {
                                    const userRef = ref(database, `users/${user.cedula}`);
                                    await remove(userRef);
                                });

                                await Promise.all(deletePromises); // Esperar a que todos los usuarios sean eliminados

                                console.log("Usuarios eliminados:", selectedUsers.map((u) => u.cedula));
                                Alert.alert("Éxito", "Usuarios eliminados correctamente");

                                setSelectedUsers([]); // Resetear la selección después de eliminar
                            } catch (error) {
                                console.error("Error al eliminar usuarios:", error);
                                Alert.alert("Error", "No se pudo eliminar los usuarios");
                            }
                        }
                    }
                ]
            );
        }
    };


    const handleHistorial = () => {
        if (selectedUsers.length === 1) {
            const { cedula, email, nombreApellido, telefono } = selectedUsers[0]; 
            console.log("Modificar usuario:", cedula, email, nombreApellido, telefono);
            navigation.navigate('HistoryScreen', { CI: cedula })
        }
    }

    const renderItem = ({ item }: { item: any }) => {
        const isSelected = selectedUsers.some((u) => u.cedula === item.cedula);

        return (

            <TouchableOpacity
                onPress={() => handleSelectUser(item)}
                style={{
                    flexDirection: "row",
                    paddingVertical: 10,
                    borderBottomWidth: 1,
                    borderColor: "#ccc",
                    backgroundColor: isSelected ? "#ddd" : backgroundColor,
                }}
            >
                <Text style={{ flex: 1.4 }}>{item.cedula}</Text>
                <Text style={{ flex: 2 }}>{item.nombreApellido}</Text>
                <Text style={{ flex: 2 }}>{item.telefono}</Text>
                <Text style={{ flex: 2 }}>{item.email}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <Layout style={{ flex: 1, padding: 20 }}>
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
            <TouchableOpacity
                style={{
                    // flexDirection: 'row',
                    justifyContent: 'flex-start',
                    position: 'absolute',
                    right: 20,
                    top: 20,
                    zIndex: 2,
                }}
                disabled={selectedUsers.length !== 1}
                onPress={() => { handleHistorial() }}
            >
                <MyIcon name="clipboard" />
            </TouchableOpacity>
            <Text category="h5" style={{ textAlign: "center", marginBottom: 10 }}>ADMINISTRADOR</Text>

            {/* Botones */}
            <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 10 }}>
                <Button onPress={() => navigation.navigate('AddNewUserScreen')} status="primary">NUEVO</Button>
                <Button onPress={handleModify} disabled={selectedUsers.length !== 1} status="warning">MODIFICAR</Button>
                <Button onPress={handleDelete} disabled={selectedUsers.length === 0} status="danger">BORRAR</Button>
            </View>

            {/* Mostrar si no hay usuarios */}
            {users.length === 0 ? (
                <Text style={{ textAlign: "center", marginTop: 20 }}>Cargando usuarios...</Text>
            ) : (
                <Card disabled style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", borderBottomWidth: 2, paddingBottom: 5 }}>
                        <Text style={{ flex: 1.5, fontWeight: "bold", color: "red" }}>Cédula</Text>
                        <Text style={{ flex: 2, fontWeight: "bold", color: "red" }}>Nombre y Apellido</Text>
                        <Text style={{ flex: 2, fontWeight: "bold", color: "red" }}>Teléfono</Text>
                        <Text style={{ flex: 2, fontWeight: "bold", color: "red" }}>Email</Text>
                    </View>

                    <FlatList
                        data={users}
                        keyExtractor={(item) => item.cedula}
                        renderItem={renderItem}
                        style={{ height: height * 0.7 }}

                    />
                </Card>
            )}
        </Layout>
    );
};

export default AdminScreen;
