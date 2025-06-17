import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

export default function RegistroUsuario() {
  const [form, setForm] = useState({
    usuario: "",
    edad: "",
    email: "",
    password: "",
  });

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    Alert.alert("Registro enviado", JSON.stringify(form, null, 2));
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#181A20",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          backgroundColor: "#000",
          padding: 24,
          borderRadius: 20,
          width: "85%",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20, marginBottom: 4 }}>
          Registro Admin
        </Text>
        <Text style={{ color: "#bcbcbc", marginBottom: 18 }}>
          Completa los datos para registrarse como administrador
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
          Edad
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
          placeholder="Edad"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={form.edad}
          onChangeText={(text) => handleChange("edad", text)}
        />

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
    </View>
  );
}