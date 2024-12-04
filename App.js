import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Dimensions, View, ScrollView, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Fontisto } from '@expo/vector-icons'

const { width: SCREEN_WIDTH} = Dimensions.get("window");

const API_KEY = "524f96add4f7bb3b7b37f54296b5c857";

const icons = {
  Clouds : "cloudy",
  Clear : "day-sunny",
  Atmosphere : "",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "Lightning",
}

export default function App() {
  const [city, setCity] = useState("Loading...")
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async()=>{
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
    const {
      coords:{latitude,longitude},
    } = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMap: false })
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    const json = await response.json()
    
    setDays(
      json.list.filter((weather) => {
      if (weather.dt_txt.includes("00:00:00")) {
      return weather;
      }
      })
      );
  };
  
  useEffect(() => {
    getWeather();
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="white" size="large" style={{marginTop : 10}}></ActivityIndicator>
          </View>
        ) : (
          days.map((day, index) =>
          <View key={index} style={styles.day}>
            
            <View style={{width: "100%", flexDirection:"row", alignItems:"start", justifyContent:"flex-start"}}>
              <Text style={styles.temp}>
                {parseFloat(day.main.temp).toFixed(1)}
              </Text>
              <Text style={{color:"white", fontSize:"60", paddingTop:"20"}}>
                °C
              </Text>
            </View>

            <View style={{width: "100%", flexDirection:"row", alignItems:"center", justifyContent:"flex-start"}}>
              <Text style={styles.description}>
                {day.weather[0].main}
              </Text>
              <Fontisto name={icons[day.weather[0].main]} size={30} color="white" marginLeft="10" marginTop="-18"></Fontisto>
            </View>
            <Text style={styles.tinyText}>
              {day.weather[0].description}
            </Text>
          </View>)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: "teal",
  },
  city: {
    flex:1.2,
    justifyContent:"center",
    alignItems:"center",
  },
  cityName: {
    color: "white",
    fontSize: 80,
    fontWeight: 300,
  },
  weather: {
    backgroundColor:"tomato",
  },
  day :{
    width: SCREEN_WIDTH,
    alignItems:"left",
    backgroundColor: "teal",
  },
  temp: {
    color: "white",
    marginLeft: 15,
    fontWeight: 600,
    fontSize: 130,
  },
  description: {
    color: "white",
    marginLeft: 15,
    marginTop: -20,
    fontSize: 30,
  },
  tinyText :{
    color: "white",
    marginLeft: 15,
    fontSize: 20,
  }
});
