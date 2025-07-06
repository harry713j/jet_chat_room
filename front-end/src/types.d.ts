
type SystemMessages = {
    type: "system"
    text: string
    time: string
}

type ChatMessages = {
    type: "chat"
    nickname: string
    text: string
    time: string
}

type MessagePayload = SystemMessages | ChatMessages