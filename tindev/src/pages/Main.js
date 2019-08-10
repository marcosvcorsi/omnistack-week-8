import React, { useEffect, useState }from 'react';
import AsyncStorage from '@react-native-community/async-storage'
import { View, Text, SafeAreaView, Image, StyleSheet, TouchableOpacity} from 'react-native';

import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';
import itsamatch from '../assets/itsamatch.png';

import api from '../services/api'
import io from 'socket.io-client'

function Main({ navigation }){
    const userId = navigation.getParam('userId');

    const [users, setUsers] = useState([]);
    const [matchDev, setMatchDev] = useState(null);

    useEffect(() => {
        async function loadUsers(){
            const response = await api.get('devs', {
                headers: {
                    user: userId
                }
            })
            
            setUsers(response.data);
        }

        loadUsers();
    }, [userId]);

    useEffect(() => {
        const socket = io('http://192.168.1.110:3333', {
          query: { user: userId}    
        });
  
        socket.on('match', dev => {
          setMatchDev(dev);
        });
      }, [userId]);

    async function handleLike(){
        const [user, ...rest] = users;

        await api.post(`/devs/${user._id}/likes`, null, {
            headers: {user: userId}
        });

        setUsers(rest);
    }

    async function handleDislike(){
        const [user, ...rest] = users;


        await api.post(`/devs/${user._id}/dislikes`, null, {
            headers: {user: userId}
        });

        setUsers(rest);
    }

    async function handleLogout(){
        await AsyncStorage.clear();

        navigation.navigate('Login');
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleLogout}>
                <Image source={logo} style={styles.logo}/>
            </TouchableOpacity>
            
            <View style={styles.cardsContainer}>
                {users.length === 0 
                    ? <Text style={styles.empty}>Acabou</Text>
                    : (
                        users.map((user, index) => (
                            <View key={user._id} style={[styles.card, {zIndex: users.length - index}]}>
                                    <Image source={{uri: user.avatar }} style={styles.avatar} />
                                    <View style={styles.footer}>
                                        <Text style={styles.name}>{user.name}</Text>
                                        <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
                                    </View>
                            </View>
                        ))
                    )}
            </View>
            
            { users.length > 0 && (
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleDislike}>
                        <Image source={dislike} />    
                    </TouchableOpacity>
    
                    <TouchableOpacity style={styles.button} onPress={handleLike}>
                        <Image source={like} />  
                    </TouchableOpacity>
                </View>
            )}

            { matchDev && (
                <View style={[styles.matchContainer, {zIndex: users.length + 1}]}>
                    <Image source={itsamatch} styles={styles.matchImage}/>

                    <Image style={styles.matchAvatar} source={{uri: matchDev.avatar}} />
                    <Text style={styles.matchName}>{matchDev.name}</Text>
                    <Text style={styles.matchBio}>{matchDev.bio}</Text>

                    <TouchableOpacity onPress={() => setMatchDev(null)}>
                        <Text style={styles.closeMatch}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            )}
 
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    logo: {
        marginTop: 30
    },

    cardsContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500
    },

    card: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        margin: 30,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0    
    },

    avatar: {
        flex: 1,
        height: 300,
    },

    footer: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 15
    },

    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },

    bio: {
        fontSize: 14,
        color: '#999',
        marginTop: 2,
        lineHeight: 20
    },

    buttonsContainer: {
        flexDirection: 'row',
        marginBottom: 30
    },

    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2
    },

    empty: {
        alignSelf: 'center',
        color: '#999',
        fontSize: 24,
        fontWeight: 'bold'
    },

    matchContainer: {
        ... StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    matchImage: {
        height: 60,
        resizeMode: 'contain'
    },  

    matchAvatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: '#FFF',
        marginVertical: 30
    },

    matchName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFF'
    },

    matchBio: {
        marginTop: 10,
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 24,
        textAlign: 'center',
        paddingHorizontal: 30
    },

    closeMatch: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        marginTop: 30,
        fontWeight: 'bold'
    }
});

export default Main;