import { Ionicons } from '@expo/vector-icons';
import React, { useState, useRef } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const GEMINI_API_KEY = "AIzaSyAJXm75JWQX7f0wiy2sO1yjLOfIsijfTQo";

export default function VirtualAssistant() {
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean, image?: string}>>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSendMessage = async () => {
    if ((inputText.trim() === '' && !image) || loading) return;

    setMessages(prev => [...prev, { text: inputText, isUser: true, image }]);
    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      let contents: any[] = [
        { role: "user", parts: [{ text: "Eres un asistente virtual médico, responde de forma clara y sencilla." }] },
        ...messages.map(m => ({
          role: m.isUser ? "user" : "model",
          parts: [{ text: m.text }],
        })),
      ];

      if (image) {
        const base64 = await FileSystem.readAsStringAsync(image, { encoding: FileSystem.EncodingType.Base64 });
        contents.push({
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64,
              },
            },
            { text: inputText }
          ],
        });
      } else {
        contents.push({
          role: "user",
          parts: [{ text: inputText }],
        });
      }

      const result = await model.generateContent({ contents });
      const aiText = result.response.text().trim() || "Lo siento, no pude responder en este momento.";
      setMessages(prev => [...prev, { text: aiText, isUser: false }]);
    } catch (e) {
      setMessages(prev => [...prev, { text: "Ocurrió un error al conectar con la IA.", isUser: false }]);
    }
    setInputText('');
    setImage(null);
    setLoading(false);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleRemoveImage = () => setImage(null);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 60}
    >
      <View style={styles.container}>
        <ScrollView
          style={{ flex: 1 }}
          ref={scrollViewRef}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', paddingBottom: 16 }}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          keyboardShouldPersistTaps="handled"
        >
          {/* Título y disclaimer SOLO al principio */}
          {messages.length === 0 && (
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Asistente Inteligente</Text>
              <Text style={styles.subtitle}>
                Tu asistente virtual con IA. ¡Hazme cualquier pregunta !
              </Text>
              <Text style={styles.disclaimerText}>
                La información proporcionada por esta IA es orientativa y podría no ser completamente precisa o actualizada. No debe considerarse una fuente totalmente confiable ni reemplaza el asesoramiento profesional.
              </Text>
            </View>
          )}

          {messages.map((message, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                message.isUser ? styles.userMessage : styles.assistantMessage,
              ]}
            >
              {message.image && (
                <Image
                  source={{ uri: message.image }}
                  style={{ width: 120, height: 120, borderRadius: 10, marginBottom: 6 }}
                />
              )}
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Vista previa de imagen antes de enviar */}
        {image && (
          <View style={styles.previewContainer}>
            <Image source={{ uri: image }} style={styles.previewImage} />
            <TouchableOpacity style={styles.removeImageBtn} onPress={handleRemoveImage}>
              <Ionicons name="close-circle" size={28} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        )}

        {/* Input SIEMPRE visible arriba del teclado */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.imageButton} onPress={handlePickImage}>
            <Ionicons name="add" size={24} color="#2196F3" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Escribe tu pregunta aquí..."
            placeholderTextColor="#666"
            onSubmitEditing={handleSendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181A20',
    paddingTop: 0,
    marginTop: 0,
  },
  headerContainer: {
    marginTop: 32,
    marginBottom: 18,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  title: {
    color: '#FFD93D',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  disclaimerText: {
    color: '#FFD93D',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginVertical: 6,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#1976D2',
    alignSelf: 'flex-end',
  },
  assistantMessage: {
    backgroundColor: '#23272f',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#181A20',
    borderTopWidth: 0,
  },
  input: {
    flex: 1,
    backgroundColor: '#23272f',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
    color: '#fff',
    borderWidth: 0,
  },
  sendButton: {
    backgroundColor: '#1976D2',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageButton: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23272f',
    padding: 8,
    marginHorizontal: 10,
    marginBottom: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    maxWidth: 180,
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  removeImageBtn: {
    marginLeft: 8,
  },
});