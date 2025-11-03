export interface Profile {
    id: number;           // ID del usuario (se usa como user_id)
    phone: string;        // Teléfono del perfil
    photoURL?: string | File; // Puede ser una URL o un archivo (File)
}

