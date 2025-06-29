import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { API_URL } from "@env";

export default function RegistroUsuario() {
  const [form, setForm] = useState({
    usuario: "",
    fechaNacimiento: "", // formato: YYYY-MM-DD
    email: "",
    password: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      if (event.type === "set" && selectedDate) {
        const isoDate = selectedDate.toISOString().split("T")[0];
        handleChange("fechaNacimiento", isoDate);
      }
      setShowDatePicker(false);
    } else if (Platform.OS === "ios") {
      if (selectedDate) {
        const isoDate = selectedDate.toISOString().split("T")[0];
        handleChange("fechaNacimiento", isoDate);
      }
      // Puedes dejar el picker abierto en iOS o cerrarlo con un botón propio
    }
  };

  const handleSubmit = async () => {
    if (!form.usuario || !form.fechaNacimiento || !form.email || !form.password) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.usuario,
          fechaNacimiento: form.fechaNacimiento,
          correoElectronico: form.email,
          password: form.password,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Guarda el usuarioId para que quede logueado
        await AsyncStorage.setItem("usuarioId", data.id.toString());
        router.replace("/(tabs)");
      } else {
        const errorData = await res.json();
        Alert.alert("Error", errorData.message || "No se pudo registrar el usuario");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

  function formatFecha(fecha: string) {
    if (!fecha) return "Selecciona la fecha";
    const [year, month, day] = fecha.split("-");
    return `${day}-${month}-${year}`;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          backgroundColor: "#181A20",
          paddingHorizontal: 16,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            backgroundColor: "#000",
            padding: 24,
            borderRadius: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text style={{ color: "#2196F3", fontWeight: "bold", fontSize: 16 }}>
              {"← Volver"}
            </Text>
          </TouchableOpacity>

          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20, marginBottom: 4 }}>
            Registro
          </Text>
          <Text style={{ color: "#bcbcbc", marginBottom: 18 }}>
            Completa los datos para registrarse
          </Text>

          <Text style={{ color: "#fff", fontWeight: "bold", marginBottom: 4 }}>
            Usuario
          </Text>
          <TextInput
            style={{
              backgroundColor: "#181A20",
              borderColor: "#333",
              borderWidth: 1,
              borderRadius: 8,
              color: "#fff",
              marginBottom: 12,
              paddingHorizontal: 10,
              paddingVertical: 8,
            }}
            placeholder="Usuario"
            placeholderTextColor="#888"
            value={form.usuario}
            onChangeText={(text) => handleChange("usuario", text)}
          />

          <Text style={{ color: "#fff", fontWeight: "bold", marginBottom: 4 }}>
            Fecha de nacimiento
          </Text>
          {Platform.OS === "web" ? (
            <View style={{ width: "100%", marginBottom: 12 }}>
              <input
                type="date"
                style={{
                  backgroundColor: "#181A20",
                  borderColor: "#333",
                  borderWidth: 1,
                  borderRadius: 8,
                  padding: 10,
                  color: "#fff",
                  width: "100%", // Asegura que el input no se salga
                  boxSizing: "border-box", // Importante para que respete el padding y el ancho
                }}
                value={form.fechaNacimiento}
                onChange={(e) => handleChange("fechaNacimiento", e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={{
                  backgroundColor: "#181A20",
                  borderColor: "#333",
                  borderWidth: 1,
                  borderRadius: 8,
                  marginBottom: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 12,
                }}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ color: form.fechaNacimiento ? "#fff" : "#888" }}>
                  {formatFecha(form.fechaNacimiento)}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <>
                  <DateTimePicker
                    value={form.fechaNacimiento ? new Date(form.fechaNacimiento) : new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                    style={{ backgroundColor: "#181A20" }}
                  />
                  {Platform.OS === "ios" && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#2196F3",
                        borderRadius: 8,
                        paddingVertical: 10,
                        alignItems: "center",
                        marginTop: 8,
                      }}
                      onPress={() => setShowDatePicker(false)}
                    >
                      <Text style={{ color: "#fff", fontWeight: "bold" }}>Listo</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </>
          )}

          <Text style={{ color: "#fff", fontWeight: "bold", marginBottom: 4 }}>
            Correo electrónico
          </Text>
          <TextInput
            style={{
              backgroundColor: "#181A20",
              borderColor: "#333",
              borderWidth: 1,
              borderRadius: 8,
              color: "#fff",
              marginBottom: 12,
              paddingHorizontal: 10,
              paddingVertical: 8,
            }}
            placeholder="Correo electrónico"
            placeholderTextColor="#888"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(text) => handleChange("email", text)}
          />

          <Text style={{ color: "#fff", fontWeight: "bold", marginBottom: 4 }}>
            Contraseña
          </Text>
          <TextInput
            style={{
              backgroundColor: "#181A20",
              borderColor: "#333",
              borderWidth: 1,
              borderRadius: 8,
              color: "#fff",
              marginBottom: 18,
              paddingHorizontal: 10,
              paddingVertical: 8,
            }}
            placeholder="Contraseña"
            placeholderTextColor="#888"
            secureTextEntry
            value={form.password}
            onChangeText={(text) => handleChange("password", text)}
          />

          <TouchableOpacity
            style={{
              backgroundColor: "#e5e7eb",
              borderRadius: 8,
              paddingVertical: 12,
              alignItems: "center",
              marginTop: 4,
            }}
            onPress={handleSubmit}
          >
            <Text style={{ color: "#000", fontWeight: "bold", fontSize: 16 }}>
              Registrar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}