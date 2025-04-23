document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // Mostrar nombre del usuario (decodificando el JWT)
    const payload = JSON.parse(atob(token.split('.')[1]));
    document.getElementById("username").textContent = payload.sub;

    // Cargar personas
    fetch("http://localhost:8000/persons/", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(data => {
        const tbody = document.querySelector("#tablaPersonas tbody");
        tbody.innerHTML = "";
        data.forEach(persona => {
            const fila = `
                <tr>
                    <td>${persona.nombre}</td>
                    <td>${persona.apellido}</td>
                    <td>${persona.cedula}</td>
                    <td>${persona.tribunal}</td>
                </tr>`;
            tbody.innerHTML += fila;
        });
    });

    // Logout
    document.getElementById("cerrarSesion").addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });
});


document.getElementById("createPersonForm").addEventListener("submit", async function(e) {
  e.preventDefault(); // evita que recargue la página

  const token = localStorage.getItem("token");
  if (!token) {
    alert("No estás autenticado");
    return;
  }

  const data = {
    nombre: document.getElementById("nombre").value,
    apellido: document.getElementById("apellido").value,
    cedula: document.getElementById("cedula").value,
    fecha_nacimiento: document.getElementById("fecha_nacimiento").value,
    numero_oficio: document.getElementById("numero_oficio").value,
    tribunal: document.getElementById("tribunal").value,
    observaciones: document.getElementById("observaciones").value,
    foto: document.getElementById("foto").value
  };

  try {
    const response = await fetch("http://localhost:8000/persons/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      alert("Persona creada correctamente");
      console.log(result);
        // Cerrar el modal usando Bootstrap
  const modalElement = document.getElementById('crearPersonaModal');
  const modal = bootstrap.Modal.getInstance(modalElement); // Obtiene la instancia activa
  modal.hide();
    } else {
      console.error(result);
      alert("Error al crear persona: " + result.detail);
    }
  } catch (error) {
    console.error("Error al hacer la solicitud:", error);
    alert("Error de red al crear persona");
  }
});



