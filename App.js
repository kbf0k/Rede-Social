// Kaique Bernardes Ferreira Joao Pedro da Cunha Machado
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';

import Inicio from './src/screens/Home';
import PerfilScreen from './src/screens/Perfil';
import NovoPostScreen from './src/screens/NovoPost';
import ChatScreen from './src/screens/ChatScreen';
import NotificacoesScreen from './src/screens/Notificacoes';
import Direct from './src/screens/Direct';
import TelaSplash from './src/screens/TelaSplash';
import Login from './src/screens/Login';
import Cadastro from './src/screens/Cadastro';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CustomHeader({ navigation }) {
  return (
    <View style={styles.headerContainer}>
      <Image
        style={styles.logo_nav}
        source={require('./src/assets/img/logo.png')}
        resizeMode="contain"
      />
      <View style={styles.menuIcon}>
        <TouchableOpacity onPress={() => navigation.navigate('Direct')}>
          <FontAwesome style={styles.icone} name="send" size={24} color="white" />
          <Text style={styles.direct}>Direct</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <FontAwesome style={styles.icone} name="sign-out" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}


function TabsNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={({ route }) => ({
        header: (props) => <CustomHeader {...props} />,
        tabBarStyle: {
          backgroundColor: '#00b5b8',
          borderTopWidth: 0,
          height: 60,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Novo post':
              iconName = focused ? 'camera' : 'camera-outline';
              break;
            case 'Inicio':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Perfil':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'alert-circle';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Novo post" component={NovoPostScreen} />
      <Tab.Screen name="Inicio" component={Inicio} />
      <Tab.Screen name="Notificações" component={NotificacoesScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TelaSplash" component={TelaSplash} screenOptions={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} screenOptions={{ headerShown: false }} />
        <Stack.Screen name="Cadastro" component={Cadastro} screenOptions={{ headerShown: false }} />
        <Stack.Screen name="Inicio" component={TabsNavigator} screenOptions={{ headerShown: false }} />
        <Stack.Screen name="Direct" component={Direct} screenOptions={{ headerShown: false }} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} screenOptions={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#ff8c00',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  logo_nav: {
    width: 120,
    height: 100,
  },

  icone: {
    alignSelf: 'center'
  },
  menuIcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 100,
  },
  direct: {
    alignContent: 'center',
    alignSelf: 'center',
    color: '#fff',
    fontFamily: 'Poppins-Regular',
  }
});
