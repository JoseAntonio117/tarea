let preguntas = [];
        let indicePreguntaActual = 0;

        function cargarPreguntas() {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "preguntas.xml", true);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const xml = xhr.responseXML;
                    const preguntasXML = xml.getElementsByTagName("pregunta");
                    for (let i = 0; i < preguntasXML.length; i++) {
                        let textoPregunta = preguntasXML[i].getElementsByTagName("texto")[0].textContent;
                        let opciones = [];
                        let opcionesXML = preguntasXML[i].getElementsByTagName("opcion");
                        for (let j = 0; j < opcionesXML.length; j++) {
                            let textoOpcion = opcionesXML[j].textContent;
                            let esCorrecta = opcionesXML[j].getAttribute("correcta") === "si";
                            opciones.push({ texto: textoOpcion, correcta: esCorrecta });
                        }
                        preguntas.push({ texto: textoPregunta, opciones: opciones });
                    }
                    mostrarPregunta();
                }
            };
            xhr.send();
        }

        function mostrarPregunta() {
            if (indicePreguntaActual < preguntas.length && indicePreguntaActual >= 0) {
                const pregunta = preguntas[indicePreguntaActual];
                document.getElementById("preguntaTexto").textContent = pregunta.texto;
                const opcionesForm = document.getElementById("formOpciones");
                opcionesForm.innerHTML = ""; 

                pregunta.opciones.forEach((opcion, index) => {
                    const label = document.createElement("label");
                    const input = document.createElement("input");
                    input.type = "radio";
                    input.name = "opcion";
                    input.value = index;
                    label.appendChild(input);
                    label.appendChild(document.createTextNode(opcion.texto));
                    opcionesForm.appendChild(label);
                });

                document.getElementById("btnAnterior").style.display = indicePreguntaActual > 0 ? "inline-block" : "none";
            } else if (indicePreguntaActual >= preguntas.length) {
                document.getElementById("contenedorPregunta").style.display = "none";
                document.getElementById("btnSiguiente").style.display = "none";
                document.getElementById("btnAnterior").style.display = "none";
                document.getElementById("mensajeFinal").style.display = "block";
            }
        }

        document.getElementById("btnSiguiente").addEventListener("click", function() {
            const opciones = document.getElementsByName("opcion");
            let seleccionada = false;

            for (let opcion of opciones) {
                if (opcion.checked) {
                    seleccionada = true;
                    break;
                }
            }

            if (seleccionada) {
               indicePreguntaActual++;
                mostrarPregunta();
            } else {
                alert("Por favor, selecciona una opción.");
           }
        });

        document.getElementById("btnAnterior").addEventListener("click", function() {
            if (indicePreguntaActual > 0) {
                indicePreguntaActual--;
                mostrarPregunta();
            }
        });

        window.onload = function() {
            cargarPreguntas();
        };