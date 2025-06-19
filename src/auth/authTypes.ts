export interface LoginCredentials {
    username: string;
    room: string;
    roomPassword: string;
    device: {
        fingerprint: string;
        brand: string;
        model: string;
        hardware: string;
    }
}