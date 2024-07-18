import { Slot } from 'expo-router' //repassar as rotas
import { View, StatusBar } from 'react-native'
import { Loading } from '@/components/loading'
import '@/styles/global.css'
import '@/utils/dayjsLocaleConfig'

import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold
} from '@expo-google-fonts/inter'

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold
  })

  if (!fontsLoaded) {
    return <Loading />
  }

  return <View className='flex-1 bg-zinc-950'>
    <StatusBar
      barStyle="light-content"
      backgroundColor='transparent'
      translucent
    />
    <Slot />
  </View>
}