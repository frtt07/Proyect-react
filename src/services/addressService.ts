import axios from "axios";
import { Address } from "../models/Address";

const API_URL = import.meta.env.VITE_API_URL + "/addresses" || "";

class AddressService {
    async getAddresses(): Promise<Address[]> {
        try {
            const response = await axios.get<Address[]>(API_URL);
            return response.data;
        } catch (error) {
            console.error("Error al obtener direcciones:", error);
            return [];
        }
    }
    async getAddressById(id: number): Promise<Address | null> {
        try {
            const response = await axios.get<Address>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Dirección no encontrada:", error);
            return null;
        }
    }

    async createAddress(address: Omit<Address, "id">): Promise<Address | null> {
        try {
            const response = await axios.post<Address>(API_URL, address);
            return response.data;
        } catch (error) {
            console.error("Error al crear dirección:", error);
            return null;
        }
    }

    async updateAddress(id: number, address: Partial<Address>): Promise<Address | null> {
        try {
            const response = await axios.put<Address>(`${API_URL}/${id}`, address);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar dirección:", error);
            return null;
        }
    }

    async deleteAddress(id: number): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error("Error al eliminar dirección:", error);
            return false;
        }
    }
}
// Exportamos una instancia de la clase para reutilizarla
export const addressService = new AddressService();