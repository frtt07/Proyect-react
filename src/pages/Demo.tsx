import React, { useState, useEffect } from "react";
import PropertyComponent from "../components/Property";
const Demo: React.FC = () => {

    useEffect(() => {
        console.log("Componente montado");
        return () => {
            console.log("Componente desmontado");
        };
    }, []);

    //Este es el TS
    //Nombre como variable reactiva
    let [name, setName] = useState("Felipe"); //useState me permite manipular la variable desde el HTML

    let edad: number = 10;
    let activo: boolean = true;
    let poderes: string[] = ["volar", "fuerza", "velocidad"];

    // Función para manejar los cambios en la caja de texto
    const manejarCambio = (event: any) => {
        setName(event.target.value); // Actualizar el estado con el valor del input
    };
    const manejarClick = () => {
        console.log(`Hola, ${name}`); // Mostrar el saludo en la consola
    }

    //Este es HTML
    return <div>
        <p>Hola mundo {name}</p>
        <p>Edad: {edad}</p>
        <p>{edad >= 18 ? "Mayor de edad" : "Menor de edad"}</p>
        <p>Poderes</p>
        <ul>
            {poderes.map(poder => <li>{poder}</li>)}
        </ul>
        <input
            type="text"
            value={name} // El valor del input está ligado al estado 'texto'
            onChange={manejarCambio} // Se actualiza el estado cada vez que el usuario escribe
        />
        <button onClick={manejarClick}>Saludar</button>
        <div className="row">
            <div className="col-3">
                <PropertyComponent name="Propiedad 1" color="red" price={100} rent={[10, 20, 30]} />
            </div>
        </div>
    </div>;

}
export default Demo;
