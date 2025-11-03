import { Profile } from "../../models/Profile";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { profileService } from "../../services/profileService";
import { User } from "../../models/User";
import { userService } from "../../services/userService";
import Swal from "sweetalert2";

const CreateProfile: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);

    // 🔹 Cargar usuarios al montar el componente
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const usersData = await userService.getUsers();
            setUsers(usersData);
        } catch (error) {
            console.error("Error cargando usuarios:", error);
        }
    };

    const handleCreateProfile = async (profile: Profile) => {
        try {
            const createdProfile = await profileService.createProfile(profile);
            if (createdProfile) {
                Swal.fire({
                    title: "Completado",
                    text: "Se ha creado correctamente el perfil",
                    icon: "success",
                    timer: 3000,
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Hubo un problema al crear el perfil",
                    icon: "error",
                    timer: 3000,
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "No se pudo conectar con el servidor",
                icon: "error",
                timer: 3000,
            });
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                Crear Perfil
            </h2>

            <Formik
                initialValues={{
                    id: "",
                    phone: "",
                    photoURL: "",
                }}
                validationSchema={Yup.object({
                    id: Yup.number()
                        .typeError("Debe seleccionar un usuario")
                        .required("El usuario es obligatorio"),
                    phone: Yup.string()
                        .required("El teléfono es obligatorio")
                        .matches(/^\d{10}$/, "El teléfono debe tener 10 dígitos"),
                    photoURL: Yup.mixed().nullable(),
                })}
                onSubmit={(values, { resetForm }) => {
                    const formattedValues: Profile = {
                        id: Number(values.id),
                        phone: values.phone,
                        photoURL: values.photoURL,
                    };
                    handleCreateProfile(formattedValues);
                    resetForm();
                }}
            >
                {({ setFieldValue }) => (
                    <Form className="space-y-5">
                        {/* 🔹 Selector de Usuario */}
                        <div>
                            <label
                                htmlFor="id"
                                className="block font-semibold mb-1 text-gray-700"
                            >
                                Usuario
                            </label>
                            <Field
                                as="select"
                                name="id"
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="">Seleccione un usuario</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage
                                name="id"
                                component="p"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        {/* 🔹 Campo Teléfono */}
                        <div>
                            <label
                                htmlFor="phone"
                                className="block font-semibold mb-1 text-gray-700"
                            >
                                Teléfono
                            </label>
                            <Field
                                type="text"
                                name="phone"
                                placeholder="Ej: 3124567890"
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <ErrorMessage
                                name="phone"
                                component="p"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        {/* 🔹 Campo de Foto (archivo real) */}
                        <div>
                            <label
                                htmlFor="photoURL"
                                className="block font-semibold mb-1 text-gray-700"
                            >
                                Foto del perfil
                            </label>
                            <input
                                id="photoURL"
                                name="photoURL"
                                type="file"
                                accept="image/*"
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    const file = event.currentTarget.files?.[0];
                                    setFieldValue("photoURL", file || "");
                                }}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <ErrorMessage
                                name="photoURL"
                                component="p"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        {/* 🔹 Botón Crear Perfil */}
                        <div className="text-center mt-6">
                            <button
                                type="submit"
                                className="
                                    w-full
                                    bg-blue-700 
                                    text-yellow-100 
                                    font-extrabold 
                                    text-lg 
                                    py-3 
                                    rounded-xl 
                                    shadow-lg 
                                    hover:bg-blue-800 
                                    hover:text-white 
                                    transition-all 
                                    duration-300 
                                    transform 
                                    hover:scale-105
                                "
                            >
                                Crear Perfil
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default CreateProfile;
