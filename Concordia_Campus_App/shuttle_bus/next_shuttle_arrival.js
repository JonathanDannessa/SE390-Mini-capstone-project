import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const ArrivalDisplay = ({ stop }) => {
    const currentTime = new Date();
    const [nextBus, setNextBus] = useState(findNextBus);
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();

    useEffect(() => {
        setLoading(true);
        const intervalId = setInterval(() => {
            const updatedBus = findNextBus();
            setNextBus(updatedBus);
        },1);
        return () => clearInterval(intervalId);
    },[nextBus]);

    const findNextBus = () => {
        //const currentDay = 4; //testing -> remove when done
        const currentDay = currentTime.getDay();
        if(currentDay >= 1 && currentDay <= 4){ // Mon to Thurs
            return getNextBus(stop.departureTimes.monday_to_thursday)
        }else if(currentDay == 5){ //Friday
            return getNextBus(stop.departureTimes.friday)
        }else{ // Sat & Sun
            setLoading(false);
            return null;
        }
    }

    const getNextBus = (departureTimes) =>{
        const currentHours = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();
        //const currentHours = 17; //testing -> remove when done
        //const currentMinutes = 45; //testing -> remove when done
        const departureTimesInMinutes = departureTimes.map(time => {
            const [timeString, period] = time.split(" ");
            let [hours, minutes] = timeString.split(":").map(Number);
            if(period === "PM" && hours !== 12){
                hours += 12;
            }else if(period === "AM" && hours === 12){
                hours = 0;
            }
            return hours * 60 + minutes;
        });

        let busDetails = [];

        const currentTimeInMinutes = currentHours * 60 + currentMinutes;
        for(let i = 0; i < departureTimesInMinutes.length; i++){
            const departureTimeInMinutes = departureTimesInMinutes[i];
            if(departureTimeInMinutes >= currentTimeInMinutes){
                const timeUntilNextBus = departureTimeInMinutes - currentTimeInMinutes;
                const hoursUntilNextBus = Math.floor(timeUntilNextBus / 60);
                const minutesUntilNextBus = timeUntilNextBus % 60;

                const arrivalTimeHours = Math.floor(departureTimesInMinutes[i]/60);
                const arrivalTimeMins = Math.floor(departureTimesInMinutes[i] - arrivalTimeHours * 60);

                busDetails.push(arrivalTimeHours + ':' + arrivalTimeMins);
                if(hoursUntilNextBus === 0){
                    if(minutesUntilNextBus === 1){
                        busDetails.push(minutesUntilNextBus + ' min');
                    }else{
                        busDetails.push(minutesUntilNextBus + ' mins');
                    }
                }else{
                    busDetails.push(hoursUntilNextBus + ' hour' + (hoursUntilNextBus !== 1 ? 's' : '') + ' ' + minutesUntilNextBus + ' min' + (minutesUntilNextBus !== 1 ? 's' : ''));
                }
                return busDetails;
            }
        }
    };

    return (
        
            <View style={{ marginTop: 40}}>
                {nextBus && (
                    <>
                        <View>
                            <Text style={{fontSize:15}}>{stop.from} → {stop.to}</Text>
                            <Text style={{fontSize:15}}>Scheduled at {nextBus[0]}</Text>
                        </View>

                        <View>
                            <Text style={{ fontSize: 15 }}>Leaving In</Text>
                            <Text style={{ fontSize: 15 }}>{nextBus[1]}</Text>
                        </View>

                        <View>
                            <TouchableOpacity>
                                <Text style={{color:'blue', textDecorationLine:'underline'}} onPress={() => navigation.navigate('Shuttle Bus Schedule')}>View full schedule</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {nextBus === undefined && (
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Icon name="frown-o" size={50} color="orange"/>
                        <Text style={{padding:10}}>No more buses available today.</Text>
                    </View>
                )}

                {!nextBus && !loading &&( 
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Icon name="frown-o" size={50} color="orange"/>
                        <Text style={{padding:10}}>Shuttle Bus only available during the week.</Text>
                    </View>
                )}
            </View>
    );
};

export default ArrivalDisplay;