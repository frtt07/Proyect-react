import { Formik, Form, Field, ErrorMessage } from "formik"; //Libreraia para formularios imprtante para el proyecto
import * as Yup from "yup"; //Libreria para validaciones de formularios leer documentacion
import { Profile } from "../../models/Profile"
import Swal from "sweetalert2";
import React, {useEffect, useState} from "react";
import { profileService } from "../../services/profileService";
import GenericTable from "../../components/GenericTable";

const ListProfiles: React.FC = () => {

    return(
        <div>
            <h2>Lista de perfil</h2>
            <GenericTable<Profile>
        </div>
    )
};

export default ListProfiles;
