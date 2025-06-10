import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const OPENAI_API_KEY = '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'; // <-- Pega aquí tu API Key

export default function VirtualAssistant() {
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (inputText.trim() === '' || loading) return;

    // Agregar mensaje del usuario
    setMessages(prev => [...prev, { text: inputText, isUser: true }]);
    setLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'Eres un asistente virtual médico, responde de forma clara y sencilla.' },
            ...[...messages, { text: inputText, isUser: true }].map(m => ({
              role: m.isUser ? 'user' : 'assistant',
              content: m.text,
            }))
          ],
          max_tokens: 200,
          temperature: 0.7,
        }),
      });
      const data = await response.json();
      if (data.error) {
        setMessages(prev => [...prev, { text: `Error: ${data.error.message}`, isUser: false }]);
      } else {
        const aiText = data.choices?.[0]?.message?.content?.trim() || 'Lo siento, no pude responder en este momento.';
        setMessages(prev => [...prev, { text: aiText, isUser: false }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { text: 'Ocurrió un error al conectar con la IA.', isUser: false }]);
    }
    setInputText('');
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              message.isUser ? styles.userMessage : styles.assistantMessage,
            ]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Escribe tu pregunta aquí..."
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 0,
    marginTop: 0,
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  assistantMessage: {
    backgroundColor: '#E5E5EA',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 