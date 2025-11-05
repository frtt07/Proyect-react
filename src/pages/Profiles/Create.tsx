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
            // ✅ Si hay una foto, usamos FormData
            const formData = new FormData();
            formData.append("id", profile.id.toString());
            formData.append("phone", profile.phone);
            if (profile.photoURL instanceof File) {
                // 👇 El backend espera el campo "photo", NO "photoURL"
                formData.append("photo", profile.photoURL);
            }

            // 🔹 Crear perfil en el backend
            const createdProfile = await profileService.createProfile(formData);

            if (createdProfile) {
                // ✅ Buscar el usuario correspondiente
                const userToUpdate = users.find((u) => u.id === createdProfile.id);

                if (userToUpdate) {
                    // ✅ Asignar el perfil recién creado al usuario
                    const updatedUser: User = {
                        ...userToUpdate,
                        profile: createdProfile,
                    };

                    // ✅ Actualizar usuario en el backend
                    await userService.updateUser(updatedUser.id!, updatedUser);
                }

                // 🔄 Refrescar lista de usuarios
                await fetchUsers();

                Swal.fire({
                    title: "✅ Completado",
                    text: "El perfil se ha creado correctamente",
                    icon: "success",
                    timer: 2500,
                    showConfirmButton: false,
                });
            } else {
                Swal.fire({
                    title: "❌ Error",
                    text: "Hubo un problema al crear el perfil",
                    icon: "error",
                    timer: 2500,
                    showConfirmButton: false,
                });
            }
        } catch (error) {
            console.error("Error creando perfil:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo conectar con el servidor",
                icon: "error",
                timer: 2500,
                showConfirmButton: false,
            });
        }
    };


    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                Crear Perfil
            </h2>

            <Formik
                initialValues={{
                    id: "",
                    phone: "",
                    photoURL: null,
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
                    const formattedProfile: Profile = {
                        id: Number(values.id),
                        phone: values.phone,
                        photoURL: values.photoURL,
                    };
                    console.log("📤 Enviando perfil:", formattedProfile);
                    handleCreateProfile(formattedProfile);
                    resetForm();
                }}
            >
                {({ setFieldValue, values }) => (
                    <Form className="space-y-5">
                        {/* 🔹 Selector de Usuario */}
                        <div>
                            <label
                                htmlFor="id"
                                className="block font-semibold mb-1 text-gray-700"
                            >
                                Usuario
                            </label>

                            <select
                                id="id"
                                name="id"
                                value={values.id}
                                onChange={(e) => setFieldValue("id", e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                            >
                                <option value="">Seleccione un usuario</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>

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
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                            />
                            <ErrorMessage
                                name="phone"
                                component="p"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        {/* 🔹 Campo Foto */}
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
                                    const file = event.currentTarget.files?.[0] || null;
                                    setFieldValue("photoURL", file);
                                }}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                            />
                            <ErrorMessage
                                name="photoURL"
                                component="p"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        {/* 🔹 Botón Crear */}
                        <div className="text-center mt-6">
                            <button
                                type="submit"
                                className="
                                    w-full
                                    bg-sky-600
                                    text-yellow-100
                                    font-bold
                                    text-lg
                                    py-3
                                    rounded-xl
                                    shadow-md
                                    hover:bg-sky-700
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
