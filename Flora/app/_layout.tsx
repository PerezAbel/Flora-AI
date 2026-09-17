import { AgroProvider } from "@/contexts/agro-context";
import { Stack } from "expo-router";
import { LanguageProvider } from "@/contexts/language-context";
import { AgentDataProvider } from "@/contexts/agent-data-context";
import { ChatHistoryProvider } from "@/contexts/chat-history-context";

export default function RootLayout() {
  return (
    <LanguageProvider>
      <AgroProvider>
        <AgentDataProvider>
          <ChatHistoryProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="welcome" options={{ animation: "fade" }} />
              <Stack.Screen name="login" />
              <Stack.Screen name="signup" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="history" />
              <Stack.Screen name="settings" />
              <Stack.Screen name="animal-well-being" />
              <Stack.Screen name="farm-profile" />
              <Stack.Screen name="field-zones" />
              <Stack.Screen name="crop-monitoring-schedule" />
              <Stack.Screen name="disease-alert-preferences" />
              <Stack.Screen name="weather-units" />
              <Stack.Screen name="data-sync" />
              <Stack.Screen name="privacy-and-data" />
              <Stack.Screen name="farmer-help-support" />
              <Stack.Screen name="alert-details" />
              <Stack.Screen name="language-settings" />
              <Stack.Screen name="upload-snapshot" />
              <Stack.Screen name="scanning" />
              <Stack.Screen name="live-monitoring" />
              <Stack.Screen name="chat-conversation" />
            </Stack>
          </ChatHistoryProvider>
        </AgentDataProvider>
      </AgroProvider>
    </LanguageProvider>
  );
}
