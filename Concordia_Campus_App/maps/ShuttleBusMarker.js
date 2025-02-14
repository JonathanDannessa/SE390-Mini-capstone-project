import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Callout, Marker } from "react-native-maps";
import shuttleStopCoordinates from './shuttleBusInfo.js';
import BottomSheetComponent from '../shuttle_bus/bottom_sheet';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

const ShuttleBusMarker = ({ setToggleMapDirections, setShuttleStop}) => {
    const [selectedStop, setSelectedStop] = useState(null);
    const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);

    const [shuttleData, setShuttleData] = useState(null);

    useEffect(() =>{
        const fetchAndStoreData = async () => {
            try {
                const getResponse = await fetch(
                  "https://shuttle.concordia.ca/concordiabusmap/Map.aspx",
                  { 
                    method: "GET" 
                  }
                );
                const cookie = getResponse.headers.get('set-cookie');
        
                await AsyncStorage.setItem("cookie", cookie);
              } catch (e) {
                console.log("Error saving to storage:", e);
              } 
        };
        fetchAndStoreData();
    },[]);

    const handleToggleMapDirections = ( state ) => {
        setToggleMapDirections(state);
    }

    const handleSheetChanges = (index) => {
        if(index === -1){
            closeBottomSheet();
        }
        else{
            setBottomSheetIndex(index);
        }
    };

    const getData = async () => {
        try {
          const cookie = await AsyncStorage.getItem("cookie");
          const response = await axios.post(
            "https://shuttle.concordia.ca/concordiabusmap/WebService/GService.asmx/GetGoogleObject",
            {
              headers: {
                "Content-Type": "application/json",
                "Cookie": cookie,
              },
              withCredentials: true,
            }
          );
          return response.data;
        } catch (error) {
          console.log("Error retrieving cookie:", error);
          return null;
        }
      };

    useEffect(() => {
        let interval;
        if(selectedStop){
            interval = setInterval(async () => {
                const data = await getData();
                if(data && data.d && data.d.Points){
                    setShuttleData(data);
                }
            },5000);
        }
        return () => {
            if(interval){
                clearInterval(interval);
            }
        };
    },[selectedStop]);

    const openBottomSheet = async (stop) => {
        if(selectedStop?.keyID === stop.keyID){
            return;
        }
        setBottomSheetIndex(-1);
        setSelectedStop(null);
        setShuttleStop(null);
        
        const data = await getData();
        if (data && data.d && data.d.Points) {
            setShuttleData(data);
        }

        setTimeout(() => {
            setSelectedStop(stop);
            setShuttleStop(stop);
            setBottomSheetIndex(1);
        }, 100);
    };
    
    const closeBottomSheet = () => {
        setSelectedStop(null);
        setShuttleStop(null);
        setBottomSheetIndex(-1);
        setShuttleData(null);
    };

    return (
        <View style={{ flex: 1}}>
            {shuttleStopCoordinates.map((stop) => (
                <Marker onPress={() => openBottomSheet(stop)}
                    style={{ zIndex: 2 }}
                    key={stop.keyID}
                    coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
                    title={stop.title}
                    pinColor="#1D9E9A">
                    <Callout>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16, padding: 6 }}>
                                {stop.title}
                            </Text>
                        </View>
                    </Callout>
                </Marker>
            ))}

            {shuttleData?.d?.Points
                ?.filter((point) => point.ID.startsWith('BUS'))
                .map((point) => (
                    <Marker
                        key={`${point.ID}`}
                        coordinate={{ latitude: point.Latitude, longitude: point.Longitude }}
                        pinColor="#1D9E9A">
                        <Icon name="bus" size={30} color="black"/>
                    </Marker>
            ))}


            <BottomSheetComponent selectedStop={selectedStop} bottomSheetIndex={bottomSheetIndex} onSheetChanges={handleSheetChanges} toggleMapDirections={handleToggleMapDirections}/>
        </View>
    );
};

export default ShuttleBusMarker;