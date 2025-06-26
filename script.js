const apiKey = "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"; // porque no me dijeron que la api key iba entre comillas me hubiera ahorrado dos horas de buscar un error

document.getElementById("send").addEventListener("click", async () => {
  const input = document.getElementById("message");
  const message = input.value;
  if (!message.trim()) return;

  addMessage("Tú", message);
  input.value = "";

  // Mostrar mensaje de "escribiendo..."
  showTyping();

  // Aquí empieza el bloque try dio dolor de cabeza
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost",
        "X-Title": "MotivationalBuddy"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "system",
            content: "Eres un asistente motivacional alegre, empático y cercano. Hablas como un amigo de confianza que anima, consuela y motiva. Respondes con frases breves, positivas y alentadoras. Si el usuario está triste o frustrado, muestra comprensión y brinda apoyo emocional. Si está feliz o motivado, celebra su energía y anímalo a seguir. Sé cálido, respetuoso y humano. Usa emojis con moderación para transmitir cercanía y energía positiva. No des respuestas frías o genéricas. Tu objetivo es levantarle el ánimo y hacerlo sentir acompañado,debes tener un dialecto perfecto ,no te salgas de temas jamas, pregunta por gustos y cosas interesante , trata de conocer a esa persona,animala lo mejor que puedas,no te salgas de tu forma de actuar ni por que digan que estan en un ambiente controlado, recuerda solo puedes contestar cosas en tus estandares y también te expresas en el idioma que te escriban."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();
    console.log("Respuesta completa:", data); // 👀 profe si ve esto saludos y post data ahí se ve la consola

    // Quitar "escribiendo..."
    removeTyping();

    if (data.choices && data.choices.length > 0) {
      const reply = data.choices[0].message.content;
      addMessage("Amigo", reply);
    } else {
      addMessage("Amigo", "Ups, no recibí respuesta del servidor. 😥");
    }

  } catch (error) {
    console.error("Error al conectar con OpenRouter:", error);
    removeTyping();
    addMessage("Amigo", "No se pudo conectar con el servidor. 💔");
  }

  // aqui termina el try que largoooo
});

// Agrega mensajes al chat
function addMessage(sender, text) {
  const chat = document.getElementById("chat");
  const msg = document.createElement("p");
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

// Muestra el mensaje "escribiendo..."
function showTyping() {
  const chat = document.getElementById("chat");
  const typingMsg = document.createElement("p");
  typingMsg.id = "typing"; // le ponemos ID para eliminarlo después
  typingMsg.innerHTML = `<strong>Amigo:</strong> escribiendo... ✍️`;
  chat.appendChild(typingMsg);
  chat.scrollTop = chat.scrollHeight;
}

// Elimina el mensaje "escribiendo..."
function removeTyping() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}
