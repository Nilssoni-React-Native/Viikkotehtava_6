import { ActivityIndicator, StyleSheet, Text, View, Image, TextInput, Button } from 'react-native';
import { useState, useEffect } from 'react';

export default function App() {

  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [city, setCity] = useState('')

  API_KEY = ''

  const getWeather = () => {
    if(!city.trim()) {
      alert('Please enter a city name')
      return;
    }
    setLoading(true)
    
    fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}`)
      .then((response) => response.json())
      .then((data) => {
        if(data && data.location && data.current) {
          const weatherData = {
            name: data.location.name,
            country: data.location.country,
            tz_id: data.location.tz_id,
            localtime: data.location.localtime,
            last_updated: data.current.last_updated,
            temp_c: data.current.temp_c,
            text: data.current.condition.text,
            icon: `https:${data.current.condition.icon}`,
            wind_kph: data.current.wind_kph,
            wind_degree: data.current.wind_degree,
            wind_dir: data.current.wind_dir,
            feelslike_c: data.current.feelslike_c,
          };
          setWeather(weatherData)
        } else {
          alert('City not found.');
          setWeather(null);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getWeather()
  }, [])  

  return (
    <View style={styles.container}>
      <TextInput 
      style={styles.input}
      placeholder='Enter city name'
      value={city}
      onChangeText={setCity}
      onSubmitEditing={getWeather}
      />
      <Button title="Search" onPress={getWeather} />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff"/>        
      ) : weather ? (
        <>        
        <Text style={styles.city}>City: {weather.name}, {weather.country}</Text>
        <Text>Temp: {weather.temp_c}{'\u00b0'}C (Feels like: {weather.feelslike_c}{'\u00b0'}C)</Text>        
        <Text>{weather.text}</Text>
        <Image source={{uri: weather.icon}} style={styles.weatherIcon}/>
        <Text>Wind: {weather.wind_kph} kph {weather.wind_dir} ({weather.wind_degree}{'\u00b0'})</Text>  
        <Text>Timezone: {weather.tz_id}</Text>
        <Text>Local time: {weather.localtime}</Text>
        <Text>Last updated: {weather.last_updated}</Text>
        </>
      ) : (
        <Text>No data available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    borderRadius:5,    
  },
  city: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  weatherIcon: {
    width: 64,
    height: 64,
    marginVertical: 10,
  },
});
