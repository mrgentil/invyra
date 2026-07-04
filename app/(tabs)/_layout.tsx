import { useEffect } from "react";
import { Tabs } from "expo-router";
import { CustomTabBar } from "@/components/ui/CustomTabBar";
import { LocationPickerSheet } from "@/components/modals/LocationPickerSheet";
import { useLocationStore } from "@/store";

export default function TabLayout() {
  const hydrate = useLocationStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen name="home" options={{ title: "Accueil" }} />
        <Tabs.Screen name="discover" options={{ title: "Explorer" }} />
        <Tabs.Screen name="tickets" options={{ title: "Billets" }} />
        <Tabs.Screen name="profile" options={{ title: "Profil" }} />
      </Tabs>
      <LocationPickerSheet />
    </>
  );
}
