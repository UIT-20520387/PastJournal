//app/index.tsx
// app/index.tsx
import React, { useEffect } from "react";
import { Redirect, useRouter } from "expo-router";
import { Linking } from "react-native";
import "text-encoding";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;
      // Parse the URL and navigate to the appropriate screen
      if (url.includes("reset-password")) {
        router.replace("/reset-password/");
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, []);

  return <Redirect href={"/(tabs)/home"} />;
}
