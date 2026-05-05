const API_URL ="http://localhost:8085/persona"

const formCrear = document.getElementById("formCrear");

formCrear.addEventListener("submit", async (e) =>{   

    const persona = {
        nombre: document.getElementById("nombre"),
        apellidos: document.getElementById("apellidos"),
        domicilio: document.getElementById("domicilio"),
        email: document.getElementById("email")
    }

    try{
        const response = await fetch ('${API_URL}/create' , {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(persona)
        });

        if (!response.ok) {
            throw new Error ("Error al crear el usuario");
        }else{
            console.log("¡¡¡¡PERSONA CREADA!!!!");
        }



    } catch (error) {
        alert(error.message);
    }
});