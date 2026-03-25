import { AppText } from "@/components/AppText";
import { $styles } from "@/constants/styles";
import { whiteOpacity } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

type Props = {
  eventDate: string; // "2025-11-21"
  eventTime: string; // "05:00"
};

const CountDowntimer = ({ eventDate, eventTime }: Props) => {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const calculateCountdown = () => {
    try {
      const target = new Date(`${eventDate}T${eventTime}:00`);
      const now = new Date();

      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        return {
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        };
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      return {
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      };
    } catch (e) {
      return {
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      };
    }
  };

  useEffect(() => {
    // initial calculation
    setTimeLeft(calculateCountdown());

    const interval = setInterval(() => {
      setTimeLeft(calculateCountdown());
    }, 1000);

    return () => clearInterval(interval);
  }, [eventDate, eventTime]);

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <View style={{ paddingTop: 15 }}>
      <AppText style={{ fontSize: moderateSize(12) }}>Time Remaining</AppText>

      <View style={[$styles.flexCenter, { columnGap: 20, paddingTop: 10 }]}>
        {timeUnits.map((unit, index) => (
          <React.Fragment key={unit.label}>
            <View style={{ alignItems: "center" }}>
              <AppText style={{ fontSize: moderateSize(12) }} type="subtitle">
                {unit.label}
              </AppText>
              <AppText style={{ fontSize: moderateSize(12) }} type="subtitle">
                {unit.value}
              </AppText>
            </View>

            {index < timeUnits.length - 1 && (
              <View
                style={{
                  height: moderateSize(10),
                  width: moderateSize(2),
                  backgroundColor: whiteOpacity("0.1"),
                }}
              />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

export default CountDowntimer;
