import { Button } from "@/components/button"
import { Input } from "@/components/input"
import { Modal } from "@/components/modal"
import { ParticipantProps, Participant } from "@/components/participant"
import { TripLink, TripLinkProps } from "@/components/tripLink"
import { linksServer } from "@/server/links-server"
import { participantsServer } from "@/server/participants-server"
import { colors } from "@/styles/colors"
import { validateInput } from "@/utils/validateInput"
import { Plus } from "lucide-react-native"
import { useEffect, useState } from "react"
import { View, Text, Alert, FlatList } from "react-native"

export function Details({ tripId }: { tripId: string }) {
  //MODAL
  const [showModal, setShowModal] = useState(false)

  //LOADING
  const [isCreatingLink, setIsCreatingLink] = useState(false)

  //DATA
  const [linkName, setLinkName] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [links, setLinks] = useState<TripLinkProps[]>([])
  const [participants, setParticipants] = useState<ParticipantProps[]>([])

  function resetInputs() {
    setLinkName("")
    setLinkUrl("")
    setShowModal(false)
  }

  async function handleCreateLink() {
    try {
      if (!linkName.trim()) {
        return Alert.alert("Link", "Informe um título para o link")
      }
      if (validateInput.url(linkUrl.trim())) {
        return Alert.alert("Link", "Link inválido")
      }
      setIsCreatingLink(true)
      await linksServer.create({
        tripId,
        title: linkName,
        url: linkUrl,
      })
      Alert.alert("Link", "Link criado com sucesso!")
      resetInputs()
      await getLinks()
    } catch (e) {
      console.log(e)
    } finally {
      setIsCreatingLink(false)
    }
  }

  async function getLinks() {
    try {
      const links = await linksServer.getLinksByTripId(tripId)
      setLinks(links)
    } catch (e) {
      console.log(e)
    } finally {
      setIsCreatingLink(false)
    }
  }

  async function getTripParticipants() {
    try {
      const participants = await participantsServer.getByTripId(tripId)
      setParticipants(participants)
    } catch (e) {
      console.log(e)
    } finally {
    }
  }

  useEffect(() => {
    getLinks()
    getTripParticipants()
  }, [])

  return (
    <View className="flex-1 mt-10">
      <Text className="text-zinc-50 text-2xl font-semibold mb-2">
        Links importantes
      </Text>

      <View className="flex-1">
        {links.length > 0 ? (
          <FlatList
            data={links}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TripLink data={item} />}
            contentContainerClassName="gap-4"
          />
        ) : (
          <Text className="text-zinc-400 font-regular text-base mt-2 mb-6">
            Nenhum link adicionado.
          </Text>
        )}

        <Button variant="secondary" onPress={() => setShowModal(true)}>
          <Plus color={colors.zinc[200]} size={20} />
          <Button.Title>Cadastrar novo link</Button.Title>
        </Button>
      </View>

      <View className="flex-1 border-t border-zinc-800 mt-6">
        <Text className="text-zinc-50 text-2xl font-semibold mb-2 ">
          Convidados
        </Text>
        <FlatList
          data={participants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Participant data={item} />}
          contentContainerClassName="gap-4 pb-44"
        />
      </View>

      <Modal
        title="Cadastrar link"
        subtitle="Todos os convidados podem visualizar os links imporantes"
        visible={showModal}
        onClose={() => setShowModal(false)}
      >
        <View className="gap-2 mb-3">
          <Input variant="secondary">
            <Input.Field
              placeholder="Título do link ?"
              onChangeText={setLinkName}
            />
          </Input>

          <Input variant="secondary">
            <Input.Field placeholder="URL ?" onChangeText={setLinkUrl} />
          </Input>
        </View>

        <Button isLoading={isCreatingLink} onPress={handleCreateLink}>
          <Button.Title>Salvar link</Button.Title>
        </Button>
      </Modal>
    </View>
  )
}
